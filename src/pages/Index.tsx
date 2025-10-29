import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { initTelegramApp, getTelegramUser, tg } from '@/utils/telegram';

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  isCompleted: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  icon: string;
}

const PROGRESS_API = 'https://functions.poehali.dev/cfb0e480-e45a-4d22-80a9-20cd16bc77d8';

const Index = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async (userId: number) => {
    try {
      const response = await fetch(`${PROGRESS_API}?telegram_id=${userId}`);
      const data = await response.json();
      
      if (data.progress && data.progress.length > 0) {
        setModules((prevModules) =>
          prevModules.map((module) => ({
            ...module,
            lessons: module.lessons.map((lesson) => {
              const progressItem = data.progress.find((p: any) => p.lesson_id === lesson.id);
              return progressItem
                ? { ...lesson, isCompleted: progressItem.is_completed }
                : lesson;
            }),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initTelegramApp();
    const user = getTelegramUser();
    setTelegramUser(user);
    
    if (user?.id) {
      loadProgress(user.id);
    } else {
      setIsLoading(false);
    }

    if (selectedLesson && tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => setSelectedLesson(null));
      return () => {
        tg.BackButton.hide();
        tg.BackButton.offClick(() => setSelectedLesson(null));
      };
    } else if (tg) {
      tg.BackButton.hide();
    }
  }, [selectedLesson]);
  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Основы финансовой грамотности',
      description: 'Базовые понятия и принципы управления личными финансами',
      icon: 'BookOpen',
      lessons: [
        {
          id: '1-1',
          title: 'Введение в финансы',
          description: 'Что такое финансовая грамотность и почему она важна',
          videoUrl: 'https://vcdn1.soholms.com/ePcSxvPE?title=0&speed=1&id_recovery=187-254-298',
          duration: '12:30',
          isCompleted: true,
        },
        {
          id: '1-2',
          title: 'Личный бюджет',
          description: 'Как правильно планировать доходы и расходы',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '15:45',
          isCompleted: true,
        },
        {
          id: '1-3',
          title: 'Финансовые цели',
          description: 'Постановка и достижение финансовых целей',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '10:20',
          isCompleted: false,
        },
        {
          id: '1-4',
          title: 'Учет доходов и расходов',
          description: 'Системы учета и контроля личных финансов',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '13:15',
          isCompleted: false,
        },
        {
          id: '1-5',
          title: 'Финансовая подушка',
          description: 'Создание резервного фонда на непредвиденные расходы',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '11:40',
          isCompleted: false,
        },
        {
          id: '1-6',
          title: 'Долги и кредиты',
          description: 'Как правильно работать с заемными средствами',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '16:20',
          isCompleted: false,
        },
      ],
    },
    {
      id: '2',
      title: 'Инвестиции для начинающих',
      description: 'Основы инвестирования и типы инвестиционных инструментов',
      icon: 'TrendingUp',
      lessons: [
        {
          id: '2-1',
          title: 'Что такое инвестиции',
          description: 'Базовые понятия инвестирования',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '18:00',
          isCompleted: false,
        },
        {
          id: '2-2',
          title: 'Акции и облигации',
          description: 'Основные типы ценных бумаг',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '22:15',
          isCompleted: false,
        },
        {
          id: '2-3',
          title: 'Риски инвестирования',
          description: 'Как оценивать и управлять рисками',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '16:30',
          isCompleted: false,
        },
        {
          id: '2-4',
          title: 'Диверсификация портфеля',
          description: 'Распределение активов для снижения рисков',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '19:45',
          isCompleted: false,
        },
        {
          id: '2-5',
          title: 'ETF и фонды',
          description: 'Инвестирование через биржевые фонды',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '17:20',
          isCompleted: false,
        },
        {
          id: '2-6',
          title: 'Анализ компаний',
          description: 'Как выбирать акции для инвестирования',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '24:30',
          isCompleted: false,
        },
        {
          id: '2-7',
          title: 'Стратегии инвестирования',
          description: 'Долгосрочные и краткосрочные стратегии',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '21:10',
          isCompleted: false,
        },
      ],
    },
    {
      id: '3',
      title: 'Налоги и оптимизация',
      description: 'Налоговая система и легальные способы оптимизации',
      icon: 'Calculator',
      lessons: [
        {
          id: '3-1',
          title: 'Основы налогообложения',
          description: 'Виды налогов для физических лиц',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '14:20',
          isCompleted: false,
        },
        {
          id: '3-2',
          title: 'Налоговые вычеты',
          description: 'Как получить налоговые вычеты',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '19:45',
          isCompleted: false,
        },
        {
          id: '3-3',
          title: 'НДФЛ с инвестиций',
          description: 'Налогообложение доходов от инвестиций',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '18:30',
          isCompleted: false,
        },
        {
          id: '3-4',
          title: 'ИИС и льготы',
          description: 'Индивидуальный инвестиционный счет и налоговые льготы',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '16:50',
          isCompleted: false,
        },
        {
          id: '3-5',
          title: 'Налоги при продаже имущества',
          description: 'Налогообложение при продаже недвижимости и авто',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '15:25',
          isCompleted: false,
        },
      ],
    },
    {
      id: '4',
      title: 'Пассивный доход',
      description: 'Создание источников пассивного дохода',
      icon: 'Coins',
      lessons: [
        {
          id: '4-1',
          title: 'Что такое пассивный доход',
          description: 'Основные виды пассивного дохода',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '11:30',
          isCompleted: false,
        },
        {
          id: '4-2',
          title: 'Дивиденды и рента',
          description: 'Инвестиции в дивидендные акции и недвижимость',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '20:00',
          isCompleted: false,
        },
        {
          id: '4-3',
          title: 'Инвестиции в недвижимость',
          description: 'Покупка и сдача недвижимости в аренду',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '23:15',
          isCompleted: false,
        },
        {
          id: '4-4',
          title: 'Облигации как источник дохода',
          description: 'Регулярные выплаты по облигациям',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '17:40',
          isCompleted: false,
        },
        {
          id: '4-5',
          title: 'Онлайн-бизнес и автоматизация',
          description: 'Создание автоматизированных источников дохода',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '19:20',
          isCompleted: false,
        },
        {
          id: '4-6',
          title: 'Роялти и авторские права',
          description: 'Доход от интеллектуальной собственности',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '14:50',
          isCompleted: false,
        },
      ],
    },
    {
      id: '5',
      title: 'Криптовалюты',
      description: 'Введение в мир криптовалют и блокчейн',
      icon: 'Bitcoin',
      lessons: [
        {
          id: '5-1',
          title: 'Основы блокчейн',
          description: 'Что такое блокчейн и как он работает',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '17:15',
          isCompleted: false,
        },
        {
          id: '5-2',
          title: 'Биткоин и альткоины',
          description: 'Основные криптовалюты на рынке',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '21:30',
          isCompleted: false,
        },
        {
          id: '5-3',
          title: 'Безопасность криптоактивов',
          description: 'Как безопасно хранить криптовалюту',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '13:45',
          isCompleted: false,
        },
        {
          id: '5-4',
          title: 'Криптобиржи',
          description: 'Выбор биржи и безопасная торговля',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '18:20',
          isCompleted: false,
        },
        {
          id: '5-5',
          title: 'Кошельки и хранение',
          description: 'Типы кошельков: холодные и горячие',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '16:35',
          isCompleted: false,
        },
        {
          id: '5-6',
          title: 'DeFi и децентрализованные финансы',
          description: 'Новые возможности в мире финансов',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '22:10',
          isCompleted: false,
        },
        {
          id: '5-7',
          title: 'NFT и токены',
          description: 'Невзаимозаменяемые токены и их применение',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '19:25',
          isCompleted: false,
        },
        {
          id: '5-8',
          title: 'Стейкинг и пассивный доход',
          description: 'Заработок на стейкинге криптовалют',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: '20:50',
          isCompleted: false,
        },
      ],
    },
  ]);

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, module) => acc + module.lessons.filter((l) => l.isCompleted).length,
    0
  );
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  const subscriptionEndDate = '15 декабря 2025';

  const toggleLessonCompletion = async (moduleId: string, lessonId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    const lesson = module?.lessons.find((l) => l.id === lessonId);
    
    if (!lesson || !telegramUser?.id) return;
    
    const newCompletedState = !lesson.isCompleted;
    
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, isCompleted: newCompletedState } : lesson
              ),
            }
          : module
      )
    );
    
    try {
      await fetch(PROGRESS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: telegramUser.id,
          telegram_user: {
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
          },
          lesson_id: lessonId,
          is_completed: newCompletedState,
        }),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
          <p className="text-green-800 text-lg font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setSelectedLesson(null)}
            variant="ghost"
            className="mb-4 hover:bg-green-200/50"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад к модулям
          </Button>

          <Card className="border-green-300 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{selectedLesson.title}</CardTitle>
                  <CardDescription className="text-base">{selectedLesson.description}</CardDescription>
                </div>
                {selectedLesson.isCompleted && (
                  <Badge className="bg-green-600 text-white">
                    <Icon name="CheckCircle2" size={16} className="mr-1" />
                    Просмотрен
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedLesson.videoUrl}
                  title={selectedLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>{selectedLesson.duration}</span>
                </div>
                <Button
                  onClick={() => {
                    const moduleId = modules.find((m) =>
                      m.lessons.some((l) => l.id === selectedLesson.id)
                    )?.id;
                    if (moduleId) {
                      toggleLessonCompletion(moduleId, selectedLesson.id);
                      setSelectedLesson({
                        ...selectedLesson,
                        isCompleted: !selectedLesson.isCompleted,
                      });
                    }
                  }}
                  className={
                    selectedLesson.isCompleted
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }
                >
                  {selectedLesson.isCompleted ? (
                    <>
                      <Icon name="X" size={16} className="mr-2" />
                      Отметить непросмотренным
                    </>
                  ) : (
                    <>
                      <Icon name="Check" size={16} className="mr-2" />
                      Отметить просмотренным
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      <div className="max-w-6xl mx-auto p-4 pb-20">
        <div className="text-center mb-8 pt-8">
          <div className="inline-block mb-6">
            <div className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide">
              Клуб ФИНАНСИСТ<span className="font-bold">PRO</span>
            </div>
          </div>
          {telegramUser && (
            <p className="text-lg text-black">Привет, {telegramUser.first_name}! 👋</p>
          )}
        </div>

        <Card className="mb-6 border-green-300 shadow-lg bg-white/95 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={24} className="text-green-700" />
                  Подписка активна
                </CardTitle>
                <CardDescription className="mt-2">До {subscriptionEndDate}</CardDescription>
              </div>
              <Badge variant="outline" className="border-green-600 text-green-700 text-base px-4 py-2">
                PRO
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-8 border-green-300 shadow-lg bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={24} className="text-green-700" />
              Ваш прогресс
            </CardTitle>
            <CardDescription>
              {completedLessons} из {totalLessons} уроков пройдено
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercent} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground text-right">{progressPercent}%</p>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-black">Модули обучения</h2>
          <div className="grid gap-4">
            {modules.map((module) => {
              const moduleCompleted = module.lessons.filter((l) => l.isCompleted).length;
              const moduleTotal = module.lessons.length;
              const moduleProgress = Math.round((moduleCompleted / moduleTotal) * 100);

              return (
                <Card
                  key={module.id}
                  className="border-green-300 shadow-md hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur hover-scale"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-green-500 p-3 rounded-lg">
                          <Icon name={module.icon as any} size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-green-600 text-green-700">
                        {moduleCompleted}/{moduleTotal}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={moduleProgress} className="h-2 mb-4" />

                    <Accordion type="single" collapsible>
                      <AccordionItem value="lessons" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Icon name="List" size={16} />
                            Показать уроки
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                                  lesson.isCompleted
                                    ? 'bg-green-100 border-green-500'
                                    : 'bg-white border-gray-200 hover:border-green-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    {lesson.isCompleted ? (
                                      <div className="flex items-center gap-2">
                                        <Icon name="CheckCircle2" size={22} className="text-green-700 fill-green-700" />
                                        <Badge className="bg-green-700 text-white text-xs px-2 py-0.5">
                                          Просмотрен
                                        </Badge>
                                      </div>
                                    ) : (
                                      <Icon name="Circle" size={22} className="text-gray-300" />
                                    )}
                                    <div className="flex-1">
                                      <p className={`font-medium text-sm ${lesson.isCompleted ? 'text-green-900' : ''}`}>
                                        {lesson.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{lesson.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                    <Icon name="Play" size={16} className="text-green-600" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;