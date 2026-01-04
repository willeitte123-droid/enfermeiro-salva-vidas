import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useOutletContext } from "react-router-dom";
import { 
  Syringe, ListChecks, Lightbulb, ArrowRight, FileQuestion, 
  ClipboardList, Loader2, History, Sparkles, Activity, 
  ChevronRight, Brain, Zap, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import * as LucideIcons from "lucide-react";
import { Question } from "@/context/QuestionsContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
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
    title: "Banca de Questões",
    icon: FileQuestion,
    path: "/questions",
    description: "Treine para provas e concursos.",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "group-hover:border-violet-200 dark:group-hover:border-violet-800"
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
    refetchInterval: 30000, // Rotate question every 30 seconds
    staleTime: 10000,
  });

  useEffect(() => {
    // Set initial tip
    setRandomTip(clinicalTips[Math.floor(Math.random() * clinicalTips.length)]);

    const intervalId = setInterval(() => {
      setRandomTip(clinicalTips[Math.floor(Math.random() * clinicalTips.length)]);
    }, 20000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 1. Hero Section Imersiva */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        {/* Background Gradients & Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-5 gap-8 p-6 sm:p-10 items-center">
          {/* Saudação e Info - CENTRALIZADO */}
          <div className="lg:col-span-3 space-y-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-blue-200">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Painel de Controle Profissional</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight w-full text-center">
              Bem-vindo, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-white">
                {profile?.first_name || 'Colega'}!
              </span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed text-center">
              Prepare-se para o plantão ou seus estudos. Você tem acesso rápido às ferramentas essenciais da enfermagem moderna.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 justify-center">
              <Button asChild className="bg-white text-slate-900 hover:bg-blue-50 font-bold rounded-full shadow-lg shadow-white/10 transition-all hover:scale-105">
                <Link to="/simulado">
                  <Brain className="mr-2 h-4 w-4" /> Iniciar Simulado
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full">
                <Link to="/library">
                  <ArrowRight className="mr-2 h-4 w-4" /> Biblioteca
                </Link>
              </Button>
            </div>
          </div>

          {/* Card Flutuante de Dica (Insight) */}
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
        
        {/* Coluna Esquerda: Desafio da Questão */}
        <div className="lg:col-span-2">
          <Card className="h-full border-l-4 border-l-primary bg-gradient-to-br from-card to-secondary/5 shadow-md flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Brain className="h-6 w-6 text-primary" /> Desafio Rápido
                  </CardTitle>
                  <CardDescription>Teste seu conhecimento agora.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  Nova a cada 30s
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-center min-h-[120px]">
              {isLoadingQuestion ? (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                  <span className="text-xs">Carregando desafio...</span>
                </div>
              ) : randomQuestion ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground border-primary/20">
                      {randomQuestion.category}
                    </Badge>
                    {randomQuestion.banca && (
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {randomQuestion.banca}
                        </Badge>
                    )}
                  </div>
                  <p className="font-semibold text-base sm:text-lg text-foreground leading-relaxed line-clamp-4">
                    {randomQuestion.question}
                  </p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Questão indisponível no momento.</p>
              )}
            </CardContent>
            
            <CardFooter className="pt-2 border-t bg-muted/20">
              <Button asChild className="w-full sm:w-auto ml-auto group" disabled={isLoadingQuestion || !randomQuestion}>
                <Link to={randomQuestion ? `/questions?id=${randomQuestion.id}` : "/questions"}>
                  Responder Agora <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Coluna Direita: Atividade Recente */}
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