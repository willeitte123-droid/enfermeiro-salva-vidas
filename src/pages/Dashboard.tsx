import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useOutletContext } from "react-router-dom";
import { 
  Syringe, ListChecks, Lightbulb, ArrowRight, FileQuestion, 
  ClipboardList, Loader2, History, Sparkles, Activity, 
  ChevronRight, Brain, Zap, Clock, GraduationCap, BrainCircuit, Lock, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import * as LucideIcons from "lucide-react";
import { Question } from "@/context/QuestionsContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
  plan?: string;
}

const quickAccessLinks = [
  {
    title: "Medicamentos",
    icon: Syringe,
    path: "/medications",
    description: "Guia rápido de fármacos e diluições.",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "group-hover:border-rose-200 dark:group-hover:border-rose-800"
  },
  {
    title: "Escalas Clínicas",
    icon: ListChecks,
    path: "/scales",
    description: "Braden, Glasgow, Fugulin e mais.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "group-hover:border-emerald-200 dark:group-hover:border-emerald-800"
  },
  {
    title: "Flashcards",
    icon: BrainCircuit,
    path: "/flashcards",
    description: "Memorização ativa e repetição espaçada.",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "group-hover:border-indigo-200 dark:group-hover:border-indigo-800"
  },
  {
    title: "Procedimentos",
    icon: ClipboardList,
    path: "/procedures",
    description: "POP's e passo a passo técnico.",
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "group-hover:border-cyan-200 dark:group-hover:border-cyan-800"
  },
];

const clinicalTips = [
  "Lembre-se: a Escala de Coma de Glasgow avalia o nível de consciência, não o diagnóstico neurológico.",
  "Na PCR, a qualidade das compressões é mais importante que a velocidade. 'Comprima forte e rápido' (100-120/min).",
  "Sempre verifique a compatibilidade de medicamentos antes de administrá-los na mesma linha endovenosa.",
  "A hipoglicemia pode mimetizar sintomas neurológicos. Sempre verifique a glicemia capilar em pacientes com alteração de consciência.",
  "O antídoto para intoxicação por opioides é a Naloxona. Para benzodiazepínicos, é o Flumazenil.",
  "Em caso de suspeita de sepse, lembre-se do 'Hour-1 Bundle': Lactato, Hemoculturas, Antibiótico e Volume na primeira hora.",
  "Para gestantes em decúbito dorsal, lembre-se da Síndrome da Hipotensão Supina: lateralize para a esquerda para descomprimir a veia cava.",
  "O Sinal de Blumberg positivo (dor à descompressão súbita no Ponto de McBurney) é um forte indicativo de apendicite aguda.",
  "A insulina NPH tem aspecto leitoso e deve ser homogeneizada suavemente antes do uso. A Regular é límpida e transparente.",
  "Em pediatria, a frequência cardíaca e respiratória são mais elevadas que no adulto. Consulte sempre a tabela de sinais vitais por idade.",
  "A higiene das mãos é a medida isolada mais eficaz para prevenir infecções hospitalares. Pratique os 5 momentos da OMS.",
  "Nunca reencape agulhas após o uso. O descarte deve ser imediato em coletor rígido (Perfurocortante).",
  "Na administração de Potássio (KCl) endovenoso, nunca faça em bolus. O risco de parada cardíaca é iminente. Dilua e infunda lentamente.",
  "O posicionamento em Fowler (cabeceira elevada 30-45º) melhora a expansibilidade torácica e previne broncoaspiração na dieta enteral.",
  "Lesão por Pressão Estágio 1: Pele íntegra com eritema que NÃO embranquece ao toque. Alivie a pressão imediatamente.",
  "A troca do cateter venoso periférico deve ocorrer a cada 72-96h ou imediatamente se houver sinais de flebite (dor, calor, rubor).",
];

const fetchRandomQuestion = async (): Promise<Question | null> => {
  const { data, error } = await supabase.rpc('get_random_questions', { limit_count: 1 });
  if (error) {
    console.error("Error fetching random question:", error);
    throw error;
  }
  return data?.[0] as Question || null;
};

const Dashboard = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { activities } = useActivityTracker();
  const recentActivities = activities.slice(0, 4);
  const [randomTip, setRandomTip] = useState("");

  const { data: randomQuestion, isLoading: isLoadingQuestion } = useQuery({
    queryKey: ['randomQuestion'],
    queryFn: fetchRandomQuestion,
    refetchInterval: 30000, 
    staleTime: 10000,
  });

  // Query para verificar inatividade (Questões > 6 dias, Flashcards > 2 dias)
  const { data: inactivityAlerts } = useQuery({
    queryKey: ['inactivityAlerts', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      // Busca a última questão respondida
      const { data: lastQ } = await supabase.from('user_question_answers').select('created_at').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(1);
      
      // Busca o último simulado realizado
      const { data: lastS } = await supabase.from('user_simulations').select('created_at').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(1);
      
      // Busca flashcards atrasados há mais de 2 dias
      const { count: overdueFlashcards } = await supabase.from('user_flashcard_progress').select('*', { count: 'exact', head: true }).eq('user_id', profile.id).lt('next_review', twoDaysAgo.toISOString());

      let daysSinceLastQuestionOrSim = Infinity;
      const qDate = lastQ?.[0]?.created_at ? new Date(lastQ[0].created_at).getTime() : 0;
      const sDate = lastS?.[0]?.created_at ? new Date(lastS[0].created_at).getTime() : 0;
      const maxDate = Math.max(qDate, sDate);

      if (maxDate > 0) {
          daysSinceLastQuestionOrSim = (Date.now() - maxDate) / (1000 * 60 * 60 * 24);
      }

      return {
          needsQuestionAlert: daysSinceLastQuestionOrSim > 6,
          needsFlashcardAlert: (overdueFlashcards || 0) > 0,
          overdueFlashcardsCount: overdueFlashcards || 0,
          daysInactive: maxDate > 0 ? Math.floor(daysSinceLastQuestionOrSim) : null
      };
    },
    enabled: !!profile?.id,
  });

  useEffect(() => {
    setRandomTip(clinicalTips[Math.floor(Math.random() * clinicalTips.length)]);
    const intervalId = setInterval(() => {
      setRandomTip(clinicalTips[Math.floor(Math.random() * clinicalTips.length)]);
    }, 20000); 
    return () => clearInterval(intervalId);
  }, []);

  // Lógica blindada para garantir o bloqueio do usuário
  const plan = profile?.plan?.toLowerCase().trim() || 'free';
  const isPremium = plan !== 'free' && plan !== '';
  const isAdmin = profile?.role === 'admin';
  const isLocked = !isPremium && !isAdmin;

  const handleLockedClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toast.info("Conteúdo Exclusivo", { 
      description: "Assine a plataforma para liberar o acesso a este módulo." 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 1. Hero Section Imersiva */}
      <div 
        className="relative overflow-hidden rounded-3xl text-white shadow-2xl"
        style={{ backgroundColor: 'hsl(var(--hero-background))' }}
      >
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-5 gap-8 p-6 sm:p-10 items-center">
          <div className="lg:col-span-3 space-y-4 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-blue-200">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Painel de Controle Profissional</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight w-full text-center lg:text-left">
              Bem-vindo, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-white">
                {profile?.first_name || 'Colega'}!
              </span>
            </h1>
            
            <div className="flex flex-col xl:flex-row items-center lg:items-start xl:items-center gap-4">
              <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed text-center lg:text-left">
                {isLocked 
                  ? "Assine o Plano mensal ou anual e tenha acesso completo da plataforma." 
                  : "Prepare-se para o plantão ou seus estudos. Você tem acesso rápido às ferramentas essenciais da enfermagem moderna."}
              </p>
              
              {isLocked && (
                <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 whitespace-nowrap shrink-0">
                  <a href="https://www.enfermagempro.com/oferta">
                    <Zap className="w-4 h-4 mr-2" /> Assinar Agora
                  </a>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
              {isLocked ? (
                 <Button onClick={handleLockedClick} className="font-bold rounded-full shadow-lg transition-all bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-not-allowed">
                   <Lock className="mr-2 h-4 w-4" /> Iniciar Simulado
                 </Button>
              ) : (
                 <Button asChild className="font-bold rounded-full shadow-lg transition-all bg-white text-slate-900 hover:bg-blue-50 hover:scale-105 shadow-white/10">
                   <Link to="/simulado"><Brain className="mr-2 h-4 w-4" /> Iniciar Simulado</Link>
                 </Button>
              )}
              
              {isLocked ? (
                 <Button onClick={handleLockedClick} variant="outline" className="rounded-full transition-all bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-300 cursor-not-allowed">
                   <Lock className="mr-2 h-4 w-4" /> Banca de Questões
                 </Button>
              ) : (
                 <Button asChild variant="outline" className="rounded-full transition-all bg-transparent border-white/20 text-white hover:bg-white/10">
                   <Link to="/questions"><FileQuestion className="mr-2 h-4 w-4" /> Banca de Questões</Link>
                 </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:bg-white/15 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lightbulb className="w-24 h-24 text-yellow-300 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-yellow-300 font-bold uppercase text-xs tracking-wider mb-3">
                  <Zap className="w-4 h-4" /> Insight Clínico
                </div>
                <p className="text-sm sm:text-base font-medium text-white leading-relaxed italic">
                  "{randomTip}"
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" /> Atualiza a cada 20s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Inatividade */}
      {inactivityAlerts && (inactivityAlerts.needsQuestionAlert || inactivityAlerts.needsFlashcardAlert) && !isLocked && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          {inactivityAlerts.needsQuestionAlert && (
            <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 shadow-sm">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              <AlertTitle className="text-amber-800 dark:text-amber-400 font-bold text-base">Alerta de Inatividade</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
                <span>Você está há <strong>{inactivityAlerts.daysInactive ? `${inactivityAlerts.daysInactive} dias` : 'muito tempo'}</strong> sem resolver questões ou simulados. A constância é a chave da aprovação!</span>
                <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-none w-full sm:w-auto shadow-md">
                  <Link to="/questions">Resolver Questões</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {inactivityAlerts.needsFlashcardAlert && (
            <Alert className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 shadow-sm">
              <BrainCircuit className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
              <AlertTitle className="text-indigo-800 dark:text-indigo-400 font-bold text-base">Revisões Acumuladas</AlertTitle>
              <AlertDescription className="text-indigo-700 dark:text-indigo-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
                <span>Você tem <strong>flashcards</strong> atrasados. Não deixe a curva do esquecimento apagar seu progresso!</span>
                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none w-full sm:w-auto shadow-md">
                  <Link to="/flashcards">Revisar Agora</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* 2. Grid de Acesso Rápido */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Acesso Rápido
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickAccessLinks.map((link) => {
            const Icon = link.icon;
            
            if (isLocked) {
              return (
                <div key={link.title} onClick={handleLockedClick} className="group outline-none cursor-pointer">
                  <Card className="h-full border-2 border-transparent bg-card relative opacity-70 transition-all hover:bg-muted/50">
                    <Lock className="absolute top-3 right-3 h-4 w-4 text-muted-foreground opacity-50" />
                    <CardContent className="p-5 flex flex-col items-center text-center h-full justify-center gap-3">
                      <div className={cn("p-3 rounded-2xl shadow-sm grayscale", link.bg, link.color)}>
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">{link.title}</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">{link.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            return (
              <Link to={link.path} key={link.title} className="group outline-none">
                <Card className={cn("h-full border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-card", link.border)}>
                  <CardContent className="p-5 flex flex-col items-center text-center h-full justify-center gap-3">
                    <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 shadow-sm", link.bg, link.color)}>
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">{link.title}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">{link.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Seção Mista: Desafio + Histórico */}
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        
        <div className="lg:col-span-2">
          <Card className="h-full border-none shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
               <Brain className="w-32 h-32 text-white" />
            </div>
            
            <CardHeader className="relative z-10 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <Brain className="h-6 w-6 text-blue-200" /> Desafio Rápido
                  </CardTitle>
                  <CardDescription className="text-blue-100/80">Teste seu conhecimento agora.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm">
                  Nova a cada 30s
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-center min-h-[120px] relative z-10">
              {isLoadingQuestion ? (
                <div className="flex flex-col items-center justify-center gap-2 text-blue-100 py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-xs">Carregando desafio...</span>
                </div>
              ) : randomQuestion ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-blue-100 border-white/20 bg-black/10">
                      {randomQuestion.category}
                    </Badge>
                    {randomQuestion.banca && (
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-blue-100 border-white/20 bg-black/10">
                            {randomQuestion.banca}
                        </Badge>
                    )}
                  </div>
                  <p className={cn("font-semibold text-base sm:text-lg text-white leading-relaxed line-clamp-4 drop-shadow-sm", isLocked && "blur-sm select-none")}>
                    {isLocked ? "Conteúdo exclusivo para assinantes. O texto desta questão está oculto para usuários gratuitos." : randomQuestion.question}
                  </p>
                </div>
              ) : (
                <p className="text-center text-blue-200 py-8">Questão indisponível no momento.</p>
              )}
            </CardContent>
            
            <CardFooter className="pt-4 border-t border-white/10 bg-black/10 relative z-10">
              {isLocked ? (
                 <Button onClick={handleLockedClick} className="w-full sm:w-auto ml-auto group font-bold border-none shadow-lg transition-all bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-not-allowed">
                   <Lock className="mr-2 h-4 w-4" /> Responder Agora
                 </Button>
              ) : (
                 <Button asChild disabled={isLoadingQuestion || !randomQuestion} className="w-full sm:w-auto ml-auto group font-bold border-none shadow-lg transition-all bg-white text-blue-700 hover:bg-blue-50">
                   <Link to={randomQuestion ? `/questions?id=${randomQuestion.id}` : "/questions"}>
                     Responder Agora <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                   </Link>
                 </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-muted-foreground" /> Retomar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-full max-h-[300px] lg:max-h-[250px]">
                {recentActivities.length > 0 ? (
                  <div className="flex flex-col divide-y">
                    {recentActivities.map((activity, i) => {
                      const Icon = LucideIcons[activity.icon] as LucideIcons.LucideIcon;
                      
                      if (isLocked) {
                         return (
                           <div key={`${activity.path}-${i}`} onClick={handleLockedClick} className="flex items-center gap-3 p-4 bg-muted/20 opacity-70 cursor-pointer hover:bg-muted/40 transition-colors">
                             <div className="p-2 rounded-lg bg-muted grayscale">
                               {Icon ? <Icon className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-medium truncate text-muted-foreground">
                                 {activity.title}
                               </p>
                               <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                 {activity.type}
                               </p>
                             </div>
                             <Lock className="h-4 w-4 text-muted-foreground/50" />
                           </div>
                         )
                      }

                      return (
                        <Link 
                          to={activity.path} 
                          key={`${activity.path}-${i}`} 
                          className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {Icon ? <Icon className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {activity.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              {activity.type}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4 text-center">
                    <History className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">Nenhuma atividade recente.</p>
                    <p className="text-xs mt-1">Navegue pela plataforma para ver seu histórico aqui.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;