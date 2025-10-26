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
    conn.autocommit = True
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
            f"SELECT id FROM users WHERE telegram_id = {int(telegram_id)}"
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
            f"SELECT lesson_id, is_completed, completed_at FROM lesson_progress WHERE user_id = {user['id']}"
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
            f"SELECT id FROM users WHERE telegram_id = {int(telegram_id)}"
        )
        user = cursor.fetchone()
        
        if not user:
            first_name = telegram_user.get('first_name', '').replace("'", "''")
            last_name = (telegram_user.get('last_name') or '').replace("'", "''")
            username = (telegram_user.get('username') or '').replace("'", "''")
            
            cursor.execute(
                f"INSERT INTO users (telegram_id, first_name, last_name, username) VALUES ({int(telegram_id)}, '{first_name}', '{last_name}', '{username}') RETURNING id"
            )
            user = cursor.fetchone()
        
        lesson_id_safe = lesson_id.replace("'", "''")
        completed_time = 'CURRENT_TIMESTAMP' if is_completed else 'NULL'
        
        cursor.execute(
            f"""
            INSERT INTO lesson_progress (user_id, lesson_id, is_completed, completed_at, updated_at)
            VALUES ({user['id']}, '{lesson_id_safe}', {is_completed}, {completed_time}, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, lesson_id)
            DO UPDATE SET 
                is_completed = {is_completed},
                completed_at = {completed_time},
                updated_at = CURRENT_TIMESTAMP
            """
        )
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