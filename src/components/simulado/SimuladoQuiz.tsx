import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Timer, AlertTriangle, Building2, BookOpen } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { Question } from "@/context/QuestionsContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { shuffleQuestionOptions } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
}

interface SimuladoQuizProps {
  numQuestions: number;
  totalTime: number;
  banca: string;
  category?: string;
  onFinish: (results: { userAnswers: UserAnswer[]; questions: Question[]; timeTaken: number }) => void;
}

const fetchSimuladoQuestions = async (numQuestions: number, banca: string, category?: string) => {
  // LÓGICA ALTERADA: 
  // Não filtramos pela banca no banco de dados para garantir que sempre haja questões.
  // Filtramos apenas por categoria se selecionada.
  
  let query = supabase.from('questions').select('*');

  if (category && category !== 'Todas') {
    query = query.eq('category', category);
  }

  // Buscamos um pool maior de questões para garantir aleatoriedade
  query = query.limit(100); 

  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }

  // Embaralhar as questões trazidas
  let shuffledQuestions = (data as Question[]).sort(() => 0.5 - Math.random());
  
  // Pegar apenas a quantidade solicitada
  shuffledQuestions = shuffledQuestions.slice(0, numQuestions);

  // Embaralhar opções E sobrescrever a banca se o usuário escolheu uma específica
  return shuffledQuestions.map(q => {
    const questionWithOptions = shuffleQuestionOptions(q);
    
    // Se o usuário selecionou uma banca específica (diferente de "Todas"), 
    // nós "simulamos" que a questão é daquela banca para fins de imersão.
    if (banca !== 'Todas') {
      return { ...questionWithOptions, banca: banca };
    }
    
    return questionWithOptions;
  });
};

const SimuladoQuiz = ({ numQuestions, totalTime, banca, category, onFinish }: SimuladoQuizProps) => {
  const { data: simuladoQuestions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['simuladoQuestions', numQuestions, banca, category],
    queryFn: () => fetchSimuladoQuestions(numQuestions, banca, category),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  useEffect(() => {
    if (isLoadingQuestions) return;
    if (timeLeft <= 0) {
      setShowTimeUpDialog(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoadingQuestions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (!simuladoQuestions[currentQuestionIndex]) return;
    const newAnswer = {
      questionId: simuladoQuestions[currentQuestionIndex].id,
      selectedAnswer: selectedAnswer,
    };
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);
    setSelectedAnswer("");

    if (currentQuestionIndex < simuladoQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishSimulado(updatedAnswers);
    }
  };

  const finishSimulado = (finalAnswers: UserAnswer[]) => {
    onFinish({
      userAnswers: finalAnswers,
      questions: simuladoQuestions,
      timeTaken: totalTime - timeLeft,
    });
  };

  if (isLoadingQuestions) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-2">Preparando seu simulado...</span></div>;
  }

  if (simuladoQuestions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h3 className="text-lg font-semibold">Nenhuma questão encontrada</h3>
            <p className="text-muted-foreground">
                Não encontramos questões suficientes para os filtros selecionados:
                <br/>Categoria: <strong>{category || 'Todas'}</strong>
            </p>
            <Button onClick={() => window.location.reload()}>Voltar</Button>
        </div>
    );
  }

  const currentQuestion = simuladoQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / simuladoQuestions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <AlertDialog open={showTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> Tempo Esgotado!</AlertDialogTitle>
            <AlertDialogDescription>Seu tempo para o simulado acabou. Vamos ver seus resultados.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => finishSimulado(userAnswers)}>Ver Resultados</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs font-normal flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {currentQuestion.banca || 'Geral'}
                    </Badge>
                    {currentQuestion.category && (
                        <Badge variant="outline" className="text-xs font-normal flex items-center gap-1 bg-primary/5 text-primary border-primary/20">
                            <BookOpen className="h-3 w-3" /> {currentQuestion.category}
                        </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-1">Questão {currentQuestionIndex + 1} de {simuladoQuestions.length}</span>
                </div>
                <CardTitle className="text-lg">Simulado em Andamento</CardTitle>
            </div>
            <div className="flex items-center gap-2 font-bold text-lg bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 rounded-md self-start md:self-auto">
              <Timer className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <ProgressPrimitive.Root value={progress} className="relative h-4 w-full overflow-hidden rounded-full bg-muted mt-4">
            <ProgressPrimitive.Indicator
              className="h-full w-full flex-1 bg-gradient-to-r from-green-400 to-blue-500 transition-all"
              style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
            />
          </ProgressPrimitive.Root>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <p className="font-semibold text-lg leading-relaxed">{currentQuestion.question}</p>
          </div>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {currentQuestion.options.map((option) => (
              <Label key={option.id} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-accent transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:scale-[1.02]">
                <RadioGroupItem value={option.id} />
                <span className="font-medium">{option.text}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <div className="p-6 border-t flex justify-end">
          <Button onClick={handleNext} disabled={!selectedAnswer} size="lg">
            {currentQuestionIndex === simuladoQuestions.length - 1 ? "Finalizar Simulado" : "Próxima Questão"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SimuladoQuiz;