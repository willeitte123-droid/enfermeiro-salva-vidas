import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useOutletContext } from "react-router-dom";
import { Syringe, ListChecks, Lightbulb, ArrowRight, FileQuestion, ClipboardList, Loader2, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import * as LucideIcons from "lucide-react";
import { Question } from "@/context/QuestionsContext";

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
    description: "Guia rápido de fármacos.",
    colorClasses: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      hoverBorder: "hover:border-red-400 dark:hover:border-red-600",
    },
  },
  {
    title: "Escalas Clínicas",
    icon: ListChecks,
    path: "/scales",
    description: "Avaliações padronizadas.",
    colorClasses: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
    },
  },
  {
    title: "Banca de Questões",
    icon: FileQuestion,
    path: "/questions",
    description: "Teste seus conhecimentos.",
    colorClasses: {
      bg: "bg-violet-100 dark:bg-violet-900/30",
      text: "text-violet-600 dark:text-violet-400",
      hoverBorder: "hover:border-violet-400 dark:hover:border-violet-600",
    },
  },
  {
    title: "Procedimentos",
    icon: ClipboardList,
    path: "/procedures",
    description: "Guias passo a passo.",
    colorClasses: {
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
      text: "text-cyan-600 dark:text-cyan-400",
      hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-600",
    },
  },
];

const clinicalTips = [
  "Lembre-se: a Escala de Coma de Glasgow avalia o nível de consciência, não o diagnóstico neurológico.",
  "Na PCR, a qualidade das compressões é mais importante que a velocidade. 'Comprima forte e rápido' (100-120/min).",
  "Sempre verifique a compatibilidade de medicamentos antes de administrá-los na mesma linha endovenosa.",
  "A hipoglicemia pode mimetizar sintomas neurológicos. Sempre verifique a glicemia capilar em pacientes com alteração de consciência.",
  "O antídoto para intoxicação por opioides é a Naloxona. Para benzodiazepínicos, é o Flumazenil.",
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
  const recentActivities = activities.slice(0, 3);
  const [randomTip, setRandomTip] = useState("");

  const { data: randomQuestion, isLoading: isLoadingQuestion } = useQuery({
    queryKey: ['randomQuestion'],
    queryFn: fetchRandomQuestion,
    refetchInterval: 15000, // Rotate question every 15 seconds
    staleTime: 10000,
  });

  useEffect(() => {
    // Set initial tip
    setRandomTip(clinicalTips[Math.floor(Math.random() * clinicalTips.length)]);

    const intervalId = setInterval(() => {
      setRandomTip(clinicalTips[Math.floor(Math.random() * clinicalTips.length)]);
    }, 15000); // Change tip every 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Olá, {profile?.first_name || 'Profissional'}!</h1>
        <p className="text-muted-foreground">Bem-vindo(a) de volta ao seu ambiente de estudo e trabalho.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <History className="h-6 w-6" />
              Continue de onde parou
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = LucideIcons[activity.icon] as LucideIcons.LucideIcon;
                  return (
                    <Link to={activity.path} key={activity.path} className="block p-3 rounded-md bg-background/50 hover:bg-background/70 transition-colors">
                      <div className="flex items-center gap-4">
                        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                        <div>
                          <p className="font-semibold text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.type}</p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Sua atividade recente aparecerá aqui conforme você navega pela plataforma.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="h-full bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Lightbulb className="h-5 w-5" />
              Dica Clínica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-900 dark:text-blue-200 italic">"{randomTip}"</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickAccessLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link to={link.path} key={link.title}>
                <Card className={cn("h-full bg-card hover:bg-accent transition-all group border-2 border-transparent", link.colorClasses.hoverBorder)}>
                  <CardContent className="flex flex-col items-center justify-center text-center p-3 sm:p-4">
                    <div className={cn("p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 transition-colors", link.colorClasses.bg)}>
                      <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6 transition-colors", link.colorClasses.text)} />
                    </div>
                    <p className="font-semibold text-xs sm:text-sm text-foreground">{link.title}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto shadow-lg bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-400">
            <FileQuestion className="h-6 w-6" />
            Questão em Destaque
          </CardTitle>
          <CardDescription className="text-blue-900/80 dark:text-blue-200/80">
            Um novo desafio a cada 15 segundos para testar seus conhecimentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[150px] flex items-center justify-center">
          {isLoadingQuestion ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : randomQuestion ? (
            <div className="space-y-4 animate-in fade-in-50 duration-500 w-full">
              <p className="text-center font-semibold text-blue-900 dark:text-blue-200">
                {randomQuestion.question}
              </p>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Não foi possível carregar uma questão. Tente novamente mais tarde.
            </p>
          )}
        </CardContent>
        <CardFooter className="p-4 flex justify-end">
          <Button asChild>
            <Link to="/questions">
              Responder essa Questão <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;