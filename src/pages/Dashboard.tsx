import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useOutletContext } from "react-router-dom";
import { Syringe, Siren, Scale, Lightbulb, CheckCircle, XCircle, ArrowRight, RefreshCw, FileQuestion, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
}

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  category: string;
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
    icon: Scale,
    path: "/scales",
    description: "Avaliações padronizadas.",
    colorClasses: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
    },
  },
  {
    title: "Emergências",
    icon: Siren,
    path: "/emergency",
    description: "Protocolos de emergência.",
    colorClasses: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-600 dark:text-amber-400",
      hoverBorder: "hover:border-amber-400 dark:hover:border-amber-600",
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

const Dashboard = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [dailyQuestion, setDailyQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => {
        setAllQuestions(data);
        setDailyQuestion(data[Math.floor(Math.random() * data.length)]);
      });
  }, []);

  const handleSelectOption = (optionId: string) => {
    if (showAnswer) return;
    setSelectedOption(optionId);
    setShowAnswer(true);
  };

  const loadNewQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setDailyQuestion(allQuestions[Math.floor(Math.random() * allQuestions.length)]);
  };

  const randomTip = useMemo(() => clinicalTips[Math.floor(Math.random() * clinicalTips.length)], []);
  const isCorrect = showAnswer && selectedOption === dailyQuestion?.correctAnswer;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Olá, {profile?.first_name || 'Profissional'}!</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo(a) de volta ao seu ambiente de estudo e trabalho.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickAccessLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link to={link.path} key={link.title}>
                  <Card className={cn("h-full hover:bg-accent transition-all group border-2 border-transparent", link.colorClasses.hoverBorder)}>
                    <CardContent className="flex flex-col items-center justify-center text-center p-4">
                      <div className={cn("p-3 rounded-lg mb-3 transition-colors", link.colorClasses.bg)}>
                        <Icon className={cn("h-6 w-6 transition-colors", link.colorClasses.text)} />
                      </div>
                      <p className="font-semibold text-sm">{link.title}</p>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-5 w-5" />
                Dica Clínica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-900 dark:text-amber-200 italic">"{randomTip}"</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Questão do Dia</CardTitle>
            {dailyQuestion && <Badge variant="outline">{dailyQuestion.category}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {dailyQuestion ? (
            <>
              <p className="text-base font-semibold leading-relaxed text-foreground">{dailyQuestion.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dailyQuestion.options.map((opt) => {
                  const isCorrectOption = opt.id === dailyQuestion.correctAnswer;
                  const isSelectedOption = opt.id === selectedOption;
                  return (
                    <Button
                      key={opt.id}
                      variant="outline"
                      className={cn(
                        "w-full justify-between items-center text-left h-auto py-3 px-4 whitespace-normal transition-all duration-200",
                        "hover:bg-accent hover:border-primary",
                        showAnswer && isCorrectOption && "bg-green-100 border-green-400 text-green-900 hover:bg-green-200 dark:bg-green-900/30 dark:border-green-700 dark:text-white",
                        showAnswer && isSelectedOption && !isCorrectOption && "bg-red-100 border-red-400 text-red-900 hover:bg-red-200 dark:bg-red-900/30 dark:border-red-700 dark:text-white",
                        showAnswer && !isSelectedOption && !isCorrectOption && "bg-muted/50 text-muted-foreground opacity-60"
                      )}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={showAnswer}
                    >
                      <div className="flex items-center">
                        <span className="font-bold mr-3">{opt.id})</span>
                        <span className="flex-1">{opt.text}</span>
                      </div>
                      {showAnswer && isCorrectOption && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {showAnswer && isSelectedOption && !isCorrectOption && <XCircle className="h-5 w-5 text-red-600" />}
                    </Button>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando questão...</p>
          )}
        </CardContent>
        {showAnswer && dailyQuestion && (
          <div className="p-6 border-t bg-muted/30">
            <Alert className={cn("border-2", isCorrect ? "border-green-400 dark:border-green-700" : "border-red-400 dark:border-red-700")}>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className="font-semibold">{isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}</AlertTitle>
              <AlertDescription>
                <strong>Gabarito: {dailyQuestion.correctAnswer}.</strong> {dailyQuestion.explanation}
              </AlertDescription>
            </Alert>
          </div>
        )}
        <CardFooter className="p-4 flex justify-end items-center bg-muted/30">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={loadNewQuestion}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Nova Questão
            </Button>
            <Button asChild>
              <Link to="/questions">
                Ver Banco de Questões <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;