import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { 
  Map, Compass, Lightbulb, CheckCircle2, 
  ArrowRight, BookOpen, Target, CalendarDays, 
  Trophy, Flame, Scale, Stethoscope, Biohazard, 
  Siren, Users, Lock, PlayCircle, Brain
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import studyData from "@/data/studyTracks.json";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  plan: string;
}

const iconMap: Record<string, React.ElementType> = {
  Scale, Stethoscope, Biohazard, Siren, Users
};

const StudyTracks = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [activeTab, setActiveTab] = useState("tracks");
  const navigate = useNavigate();

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Trilha de Estudos', path: '/study-tracks', icon: 'Map' });
  }, [addActivity]);

  // Simulação de progresso
  const getProgress = (moduleId: string) => {
    const hash = moduleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 100;
  };

  const handleStartSession = (category: string, count: number) => {
    // Redireciona para o Simulado com parâmetros de URL
    navigate(`/simulado?category=${encodeURIComponent(category)}&count=${count}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Immersive Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Map className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Trilha de Estudos</h1>
            </div>
            <p className="text-emerald-100 max-w-xl text-sm sm:text-base leading-relaxed">
              Seu GPS para a aprovação. Uma jornada estruturada com o que realmente importa, estratégias validadas e metas diárias.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="text-center">
              <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-1">Nível Atual</p>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400 fill-orange-400" />
                <span className="font-bold text-lg">Iniciado</span>
              </div>
            </div>
            <div className="w-px h-10 bg-white/20 mx-2" />
            <div className="text-center">
              <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-1">Foco Hoje</p>
              <span className="font-bold text-lg">Módulo 1</span>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/study-tracks"
              itemType="Estudo"
              itemTitle="Trilha de Estudos"
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      <Tabs defaultValue="tracks" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 h-12 bg-muted/50 p-1 rounded-full">
            <TabsTrigger value="tracks" className="rounded-full text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-md transition-all">
              <Compass className="mr-2 h-4 w-4" /> A Trilha
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-full text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-md transition-all">
              <CalendarDays className="mr-2 h-4 w-4" /> Cronograma
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="rounded-full text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-md transition-all">
              <Lightbulb className="mr-2 h-4 w-4" /> Mentoria
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: TRILHAS (MÓDULOS) */}
        <TabsContent value="tracks" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> Módulos de Aprendizagem
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">5 Módulos Disponíveis</span>
          </div>

          <div className="grid gap-6">
            {studyData.tracks.map((track, index) => {
              const Icon = iconMap[track.icon] || BookOpen;
              const progress = getProgress(track.id);
              const isLocked = index > 0 && getProgress(studyData.tracks[index-1].id) < 50; 

              return (
                <Card key={track.id} className={cn(
                  "border-l-4 transition-all duration-300 hover:shadow-lg overflow-hidden group",
                  isLocked ? "border-l-muted opacity-80" : `border-l-${track.color.split('-')[1]}-500`
                )}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Module Header / Trigger */}
                        <AccordionTrigger className="hover:no-underline px-6 py-6 w-full">
                          <div className="flex items-start gap-4 w-full text-left">
                            <div className={cn(
                              "p-3 rounded-xl shrink-0 transition-colors",
                              isLocked ? "bg-muted text-muted-foreground" : `bg-${track.color.split('-')[1]}-100 dark:bg-${track.color.split('-')[1]}-900/30 ${track.color}`
                            )}>
                              {isLocked ? <Lock className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className={cn("text-lg font-bold truncate", isLocked ? "text-muted-foreground" : "text-foreground")}>
                                  {track.title}
                                </h3>
                                <Badge variant={isLocked ? "outline" : "default"} className={cn("text-[10px]", !isLocked && "bg-primary/10 text-primary hover:bg-primary/20")}>
                                  {track.level}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1 pr-4">{track.description}</p>
                              
                              {!isLocked && (
                                <div className="flex items-center gap-4 mt-3 max-w-sm">
                                  <Progress value={progress} className="h-2" />
                                  <span className="text-xs font-bold text-muted-foreground w-12">{progress}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                      </div>

                      {/* Expanded Content */}
                      <AccordionContent className="px-0 pb-0">
                        <div className="border-t bg-muted/30 p-6 space-y-6">
                          
                          {/* DICA DE ESTRATÉGIA */}
                          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg flex gap-3">
                            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm uppercase mb-1">Estratégia do Mentor</h4>
                              <p className="text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">{track.strategy}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* LISTA DE TÓPICOS */}
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" /> Tópicos Essenciais
                                </h4>
                                <div className="space-y-2">
                                  {track.topics.map((topic, i) => (
                                    <div key={i} className="flex items-center justify-between bg-background p-2.5 rounded border text-sm">
                                      <span className="truncate flex-1 mr-2">{topic.name}</span>
                                      <Badge variant="outline" className={cn(
                                        "text-[10px] uppercase tracking-wider",
                                        topic.importance === "Altíssima" ? "border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20" :
                                        topic.importance === "Alta" ? "border-orange-200 bg-orange-50 text-orange-600 dark:bg-orange-900/20" :
                                        "border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                      )}>
                                        {topic.importance}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* CARD DE AÇÃO */}
                            <div className="flex flex-col gap-4">
                              <Card className="bg-background border-dashed h-full flex flex-col justify-between">
                                <div>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">Meta Diária</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-3xl font-black text-primary mb-1">{track.dailyGoal}</div>
                                    <p className="text-xs text-muted-foreground">Questões selecionadas especificamente para este módulo.</p>
                                  </CardContent>
                                </div>
                                <CardFooter>
                                  <Button 
                                    className="w-full" 
                                    disabled={isLocked}
                                    onClick={() => handleStartSession(track.dbCategory, track.questionCount)}
                                  >
                                    <PlayCircle className="mr-2 h-4 w-4" /> Iniciar Sessão Prática
                                  </Button>
                                </CardFooter>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2: CRONOGRAMA */}
        <TabsContent value="schedule" className="animate-in slide-in-from-right-4 duration-500">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" /> Sugestão Semanal
                </h2>
                <Badge>Ciclo 7 Dias</Badge>
              </div>
              
              <div className="space-y-3">
                {studyData.schedule.map((day, idx) => (
                  <Card key={idx} className="transition-all hover:border-primary/50 group">
                    <div className="flex">
                      <div className="bg-primary/5 p-4 flex flex-col items-center justify-center border-r min-w-[80px]">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Dia</span>
                        <span className="text-2xl font-black text-primary">{idx + 1}</span>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-base">{day.focus}</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{day.day.split(':')[1]}</p>
                          </div>
                          <Badge variant="secondary" className="font-mono text-xs">Meta: {day.questionGoal} Qts</Badge>
                        </div>
                        <ul className="space-y-1">
                          {day.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="text-sm text-foreground/80 flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                              <span className="group-hover:text-primary transition-colors">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-300" /> Desafio da Semana</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm opacity-90">Complete 7 dias consecutivos de estudo para ganhar a medalha <strong>"Semana Perfeita"</strong>.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase opacity-80">
                      <span>Progresso</span>
                      <span>3/7 Dias</span>
                    </div>
                    <Progress value={42} className="h-3 bg-primary-foreground/20" indicatorClassName="bg-yellow-300" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dica de Organização</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Não quebre a corrente. Se você tem apenas 20 minutos hoje, use-os para resolver 10 questões rápidas. A consistência vence a intensidade no longo prazo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: MENTORIA */}
        <TabsContent value="mentorship" className="animate-in slide-in-from-right-4 duration-500">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Sala de Mentoria</h2>
              <p className="text-muted-foreground">Estratégias de alta performance para acelerar sua aprovação.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="md:col-span-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl"><Brain className="h-6 w-6" /> Mindset de Aprovado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium leading-relaxed opacity-90">
                    "O estudo para concurso ou para a excelência profissional não é uma corrida de 100 metros, é uma maratona. O seu maior adversário não é a banca, é o seu espelho. Controle a ansiedade, confie no processo e faça o básico bem feito todos os dias."
                  </p>
                </CardContent>
              </Card>

              {studyData.mentorship.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-all border-t-4 border-t-primary">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        {index === 0 ? <Target className="h-4 w-4" /> : index === 1 ? <ArrowRight className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyTracks;