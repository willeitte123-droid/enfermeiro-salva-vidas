import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useOutletContext } from "react-router-dom";
import { Syringe, ListChecks, Lightbulb, ArrowRight, FileQuestion, ClipboardList, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
}

interface FeaturedComment {
  content: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  questions: {
    id: number;
    question: string;
  };
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

const fetchFeaturedComments = async () => {
  const { data, error } = await supabase
    .from("comments")
    .select("content, profiles(id, first_name, last_name, avatar_url), questions(id, question)")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  // Filtrar comentários onde o perfil ou a questão associada são nulos
  return data.filter(comment => comment.profiles && comment.questions) as FeaturedComment[];
};

const Dashboard = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  const { data: featuredComments = [], isLoading: isLoadingComment } = useQuery({
    queryKey: ['featuredComments'],
    queryFn: fetchFeaturedComments,
  });

  useEffect(() => {
    if (featuredComments.length > 1) {
      const timer = setInterval(() => {
        setCurrentCommentIndex(prevIndex => (prevIndex + 1) % featuredComments.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [featuredComments]);

  const randomTip = useMemo(() => clinicalTips[Math.floor(Math.random() * clinicalTips.length)], []);
  const currentComment = featuredComments[currentCommentIndex];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Olá, {profile?.first_name || 'Profissional'}!</h1>
        <p className="text-muted-foreground">Bem-vindo(a) de volta ao seu ambiente de estudo e trabalho.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
        <div className="lg:col-span-1">
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
      </div>

      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            Comentários em Destaque
          </CardTitle>
          <CardDescription>Veja o que a comunidade está discutindo.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingComment ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : currentComment ? (
            <div key={currentCommentIndex} className="space-y-4 animate-in fade-in-50 duration-500">
              <blockquote className="border-l-4 pl-4 italic text-foreground">
                "{currentComment.content}"
              </blockquote>
              <div className="flex justify-end items-center gap-3 mt-2">
                <p className="text-sm font-semibold text-right">
                  — <Link to={`/user/${currentComment.profiles.id}`} className="hover:underline text-primary">
                    {`${currentComment.profiles.first_name} ${currentComment.profiles.last_name}`}
                  </Link>
                </p>
                <Link to={`/user/${currentComment.profiles.id}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentComment.profiles.avatar_url} alt={`Avatar de ${currentComment.profiles.first_name}`} className="object-cover" />
                    <AvatarFallback>{`${currentComment.profiles.first_name?.[0] || ''}${currentComment.profiles.last_name?.[0] || ''}`.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
              <Link to="/questions" className="block mt-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <FileQuestion className="h-4 w-4" />
                  <span>Referente à questão:</span>
                </div>
                <p className="text-sm text-foreground font-medium">
                  "{currentComment.questions.question.substring(0, 120)}..."
                </p>
              </Link>
            </div>
          ) : (
            <p className="text-center text-muted-foreground h-32 flex items-center justify-center">
              Nenhuma interação recente. Seja o primeiro a comentar em uma questão!
            </p>
          )}
        </CardContent>
        <CardFooter className="bg-muted/30 p-4 flex justify-end">
          <Button asChild>
            <Link to="/questions">
              Participar da Discussão <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;