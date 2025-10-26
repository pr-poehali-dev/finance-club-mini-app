import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage user lesson progress - get, update completion status
    Args: event with httpMethod (GET/POST/OPTIONS), body with telegram_id, lesson_id, is_completed
    Returns: HTTP response with progress data or update confirmation
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        telegram_id = event.get('queryStringParameters', {}).get('telegram_id')
        
        if not telegram_id:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'telegram_id required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute(
            "SELECT id FROM users WHERE telegram_id = %s",
            (int(telegram_id),)
        )
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'progress': []}),
                'isBase64Encoded': False
            }
        
        cursor.execute(
            "SELECT lesson_id, is_completed, completed_at FROM lesson_progress WHERE user_id = %s",
            (user['id'],)
        )
        progress = cursor.fetchall()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'progress': [
                    {
                        'lesson_id': row['lesson_id'],
                        'is_completed': row['is_completed'],
                        'completed_at': row['completed_at'].isoformat() if row['completed_at'] else None
                    }
                    for row in progress
                ]
            }),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        telegram_id = body_data.get('telegram_id')
        telegram_user = body_data.get('telegram_user', {})
        lesson_id = body_data.get('lesson_id')
        is_completed = body_data.get('is_completed', False)
        
        if not telegram_id or not lesson_id:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'telegram_id and lesson_id required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute(
            "SELECT id FROM users WHERE telegram_id = %s",
            (int(telegram_id),)
        )
        user = cursor.fetchone()
        
        if not user:
            cursor.execute(
                "INSERT INTO users (telegram_id, first_name, last_name, username) VALUES (%s, %s, %s, %s) RETURNING id",
                (
                    int(telegram_id),
                    telegram_user.get('first_name'),
                    telegram_user.get('last_name'),
                    telegram_user.get('username')
                )
            )
            user = cursor.fetchone()
            conn.commit()
        
        cursor.execute(
            """
            INSERT INTO lesson_progress (user_id, lesson_id, is_completed, completed_at, updated_at)
            VALUES (%s, %s, %s, CASE WHEN %s THEN CURRENT_TIMESTAMP ELSE NULL END, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, lesson_id)
            DO UPDATE SET 
                is_completed = EXCLUDED.is_completed,
                completed_at = CASE WHEN EXCLUDED.is_completed THEN CURRENT_TIMESTAMP ELSE NULL END,
                updated_at = CURRENT_TIMESTAMP
            """,
            (user['id'], lesson_id, is_completed, is_completed)
        )
        conn.commit()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'lesson_id': lesson_id, 'is_completed': is_completed}),
            'isBase64Encoded': False
        }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
