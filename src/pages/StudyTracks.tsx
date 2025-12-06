import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { 
  Map, Compass, Lightbulb, CheckCircle2, 
  ArrowRight, BookOpen, Target, CalendarDays, 
  Trophy, Flame, Scale, Stethoscope, Biohazard, 
  Siren, Users, Lock, PlayCircle, Brain, Star, ChevronDown,
  Calculator, Gavel, Briefcase, Scissors, Activity
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
import { useUserLevel } from "@/hooks/useUserLevel";

interface Profile {
  id: string;
  plan: string;
}

const iconMap: Record<string, React.ElementType> = {
  Scale, Stethoscope, Biohazard, Siren, Users, 
  Calculator, Gavel, Briefcase, Scissors, Activity
};

const StudyTracks = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [activeTab, setActiveTab] = useState("tracks");
  const navigate = useNavigate();

  // Hook de Gamificação
  const { data: levelData, isLoading: isLoadingLevel } = useUserLevel(profile?.id);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Trilha de Estudos', path: '/study-tracks', icon: 'Map' });
  }, [addActivity]);

  // Simulação de progresso dos módulos
  const getProgress = (moduleId: string) => {
    const hash = moduleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 100;
  };

  const handleStartSession = (category: string) => {
    navigate(`/questions?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Immersive Header Dinâmico */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-5 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Map className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Trilha de Estudos</h1>
            </div>
            <p className="text-emerald-100 max-w-xl text-sm sm:text-base leading-relaxed">
              Seu GPS para a aprovação. Avance nos níveis completando questões e desbloqueie novas conquistas.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 w-full md:w-auto">
            <div className="text-center min-w-[100px] sm:min-w-[120px]">
              <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-1">Nível Atual</p>
              <div className="flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 text-orange-400 fill-orange-400" />
                <span className="font-bold text-lg">
                  {isLoadingLevel ? "..." : levelData?.levelName || "Novato"}
                </span>
              </div>
              <div className="mt-2 w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-400 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${levelData?.progressToNextLevel || 0}%` }}
                />
              </div>
              <p className="text-[10px] text-emerald-100 mt-1">
                {levelData ? `${Math.round(levelData.progressToNextLevel)}% para prox.` : "Carregando..."}
              </p>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-white/20 mx-2" />
            <div className="h-px w-full bg-white/20 sm:hidden my-2" />

            <div className="text-center">
              <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-1">XP Total</p>
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-lg">{levelData?.currentXP || 0}</span>
              </div>
              <p className="text-[10px] text-emerald-100 mt-1">Acertos acumulados</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />
        
        {profile && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
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
        <div className="flex justify-center mb-6 sm:mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 h-10 sm:h-12 bg-muted/50 p-1 rounded-full">
            <TabsTrigger value="tracks" className="rounded-full text-[10px] sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-md transition-all px-1">
              <Compass className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> A Trilha
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-full text-[10px] sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-md transition-all px-1">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Cronograma
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="rounded-full text-[10px] sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-md transition-all px-1">
              <Lightbulb className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Mentoria
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: TRILHAS (MÓDULOS) */}
        <TabsContent value="tracks" className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-1 sm:px-2">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> Módulos
            </h2>
            <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">9 Disponíveis</span>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {studyData.tracks.map((track, index) => {
              const Icon = iconMap[track.icon] || BookOpen;
              const progress = getProgress(track.id);
              const isLocked = false; 

              return (
                <Card key={track.id} className={cn(
                  "border-l-4 transition-all duration-300 hover:shadow-lg overflow-hidden group",
                  `border-l-${track.color.split('-')[1]}-500`
                )}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="module-content" className="border-0">
                      <div className="flex flex-col md:flex-row">
                        <AccordionTrigger className="hover:no-underline px-4 py-4 sm:px-6 sm:py-6 w-full">
                          <div className="flex items-start gap-3 sm:gap-4 w-full text-left">
                            <div className={cn(
                              "p-2.5 sm:p-3 rounded-xl shrink-0 transition-colors",
                              `bg-${track.color.split('-')[1]}-100 dark:bg-${track.color.split('-')[1]}-900/30 ${track.color}`
                            )}>
                              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                                <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight line-clamp-2">
                                  {track.title}
                                </h3>
                                <Badge variant="default" className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 shrink-0 h-5 px-1.5">
                                  {track.level}
                                </Badge>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground pr-2 leading-snug line-clamp-2 sm:line-clamp-none">{track.description}</p>
                              
                              <div className="flex items-center gap-3 mt-3 max-w-sm">
                                <Progress value={progress} className="h-1.5 sm:h-2" />
                                <span className="text-[10px] sm:text-xs font-bold text-muted-foreground w-8 text-right">{progress}%</span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                      </div>

                      <AccordionContent className="px-0 pb-0">
                        <div className="border-t bg-muted/30 p-4 sm:p-6 space-y-6">
                          
                          {/* DICA DE ESTRATÉGIA */}
                          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 sm:p-4 rounded-lg flex gap-3">
                            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-amber-800 dark:text-amber-300 text-xs sm:text-sm uppercase mb-1">Estratégia do Mentor</h4>
                              <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">{track.strategy}</p>
                            </div>
                          </div>

                          {/* Ajuste de Layout: Vertical */}
                          <div className="flex flex-col gap-6">
                            
                            {/* LISTA DE TÓPICOS (AGORA CLICÁVEIS) */}
                            <div className="space-y-3">
                              <h4 className="font-bold text-sm flex items-center gap-2">
                                <BookOpen className="h-4 w-4" /> Tópicos Essenciais
                              </h4>
                              
                              <Accordion type="single" collapsible className="w-full space-y-2">
                                {track.topics.map((topic, i) => (
                                  <AccordionItem 
                                    key={i} 
                                    value={`topic-${i}`} 
                                    className="border rounded-md bg-background overflow-hidden"
                                  >
                                    <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-accent/50 transition-colors text-sm [&[data-state=open]]:bg-accent/50">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left gap-2 sm:gap-3">
                                        <span className="font-medium text-foreground/90 text-xs sm:text-sm leading-snug">{topic.name}</span>
                                        <Badge variant="outline" className={cn(
                                          "text-[9px] sm:text-[10px] uppercase tracking-wider w-fit shrink-0",
                                          topic.importance === "Altíssima" ? "border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20" :
                                          topic.importance === "Alta" ? "border-orange-200 bg-orange-50 text-orange-600 dark:bg-orange-900/20" :
                                          "border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                        )}>
                                          {topic.importance}
                                        </Badge>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-3 sm:px-4 py-3 bg-muted/20 border-t text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                                      <div dangerouslySetInnerHTML={{ __html: topic.content || "Conteúdo em breve." }} />
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </div>

                            {/* CARD DE AÇÃO */}
                            <div className="w-full">
                              <Card className="bg-background border-dashed flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="flex-1">
                                  <CardHeader className="pb-2 pt-4 px-4 sm:pt-6 sm:px-6">
                                    <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">Meta Diária</CardTitle>
                                  </CardHeader>
                                  <CardContent className="pb-4 px-4 sm:pb-6 sm:px-6">
                                    <div className="text-2xl sm:text-3xl font-black text-primary mb-1">{track.dailyGoal}</div>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">Questões selecionadas para este módulo.</p>
                                  </CardContent>
                                </div>
                                <CardFooter className="pt-0 pb-4 px-4 sm:pt-6 sm:pb-6 sm:px-6">
                                  <Button 
                                    className="w-full sm:w-auto h-auto py-3 px-6 flex items-center justify-center gap-2 whitespace-normal text-sm" 
                                    onClick={() => handleStartSession(track.dbCategory)}
                                  >
                                    <PlayCircle className="h-4 w-4 shrink-0" /> 
                                    <span className="text-center leading-tight">Iniciar Sessão</span>
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

        {/* TAB 2: CRONOGRAMA (MANTIDO IGUAL) */}
        <TabsContent value="schedule" className="animate-in slide-in-from-right-4 duration-500">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" /> Sugestão Semanal
                </h2>
                <Badge variant="outline">Ciclo 7 Dias</Badge>
              </div>
              
              <div className="space-y-3">
                {studyData.schedule.map((day, idx) => (
                  <Card key={idx} className="transition-all hover:border-primary/50 group">
                    <div className="flex">
                      <div className="bg-primary/5 p-3 sm:p-4 flex flex-col items-center justify-center border-r min-w-[60px] sm:min-w-[80px]">
                        <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Dia</span>
                        <span className="text-xl sm:text-2xl font-black text-primary">{idx + 1}</span>
                      </div>
                      <div className="p-3 sm:p-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                          <div>
                            <h3 className="font-bold text-sm sm:text-base leading-tight">{day.focus}</h3>
                            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide font-semibold mt-0.5">{day.day.split(':')[1]}</p>
                          </div>
                          <Badge variant="secondary" className="font-mono text-[10px] sm:text-xs w-fit">Meta: {day.questionGoal} Qts</Badge>
                        </div>
                        <ul className="space-y-1 mt-2">
                          {day.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="text-xs sm:text-sm text-foreground/80 flex items-start gap-2">
                              <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500 shrink-0 mt-0.5" />
                              <span className="group-hover:text-primary transition-colors leading-snug">{task}</span>
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
              {/* DESAFIO DINÂMICO */}
              <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Trophy className="w-24 h-24" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 relative z-10 text-lg"><Trophy className="h-5 w-5 text-yellow-300" /> Desafio da Semana</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <p className="text-sm opacity-90 font-medium leading-relaxed">
                    Sua meta: Acertar <strong>{levelData?.weeklyTarget || 30} questões</strong> nesta semana para avançar mais rápido.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase opacity-80">
                      <span>Progresso</span>
                      <span>{levelData?.weeklyProgress || 0}/{levelData?.weeklyTarget || 30} Acertos</span>
                    </div>
                    <Progress 
                      value={levelData ? Math.min(100, (levelData.weeklyProgress / levelData.weeklyTarget) * 100) : 0} 
                      className="h-3 bg-primary-foreground/20" 
                      indicatorClassName="bg-yellow-300" 
                    />
                  </div>
                  {levelData && levelData.weeklyProgress >= levelData.weeklyTarget && (
                    <div className="flex items-center gap-2 bg-white/20 p-2 rounded-lg text-xs font-bold animate-pulse">
                      <CheckCircle2 className="w-4 h-4 text-green-300" /> Meta Batida! Continue assim!
                    </div>
                  )}
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

        {/* TAB 3: MENTORIA (MANTIDO IGUAL) */}
        <TabsContent value="mentorship" className="animate-in slide-in-from-right-4 duration-500">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">Sala de Mentoria</h2>
              <p className="text-sm sm:text-base text-muted-foreground px-4">Estratégias de alta performance para acelerar sua aprovação.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="md:col-span-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><Brain className="h-6 w-6" /> Mindset de Aprovado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-lg font-medium leading-relaxed opacity-90">
                    "O estudo para concurso ou para a excelência profissional não é uma corrida de 100 metros, é uma maratona. O seu maior adversário não é a banca, é o seu espelho. Controle a ansiedade, confie no processo e faça o básico bem feito todos os dias."
                  </p>
                </CardContent>
              </Card>

              {studyData.mentorship.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-all border-t-4 border-t-primary">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        {index === 0 ? <Target className="h-4 w-4" /> : index === 1 ? <ArrowRight className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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