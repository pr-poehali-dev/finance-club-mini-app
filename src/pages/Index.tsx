import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

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

const Index = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
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
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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

  const toggleLessonCompletion = (moduleId: string, lessonId: string) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, isCompleted: !lesson.isCompleted } : lesson
              ),
            }
          : module
      )
    );
  };

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
          <h1 className="text-5xl font-bold mb-2 text-black">ОНЛАЙН</h1>
          <div className="inline-block bg-white px-6 py-2 rounded-full text-lg font-semibold text-black shadow-md">
            В ЧЕТВЕРГ
          </div>
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
                                    ? 'bg-green-50 border-green-300'
                                    : 'bg-white border-gray-200 hover:border-green-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    {lesson.isCompleted ? (
                                      <Icon name="CheckCircle2" size={20} className="text-green-600" />
                                    ) : (
                                      <Icon name="Circle" size={20} className="text-gray-300" />
                                    )}
                                    <div>
                                      <p className="font-medium text-sm">{lesson.title}</p>
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
