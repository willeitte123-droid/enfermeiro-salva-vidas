import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Timer, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { Question } from "@/context/QuestionsContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
}

interface SimuladoQuizProps {
  numQuestions: number;
  totalTime: number;
  onFinish: (results: { userAnswers: UserAnswer[]; questions: Question[]; timeTaken: number }) => void;
}

const fetchSimuladoQuestions = async (numQuestions: number) => {
  const { data, error } = await supabase.rpc('get_random_questions', { limit_count: numQuestions });
  if (error) {
    throw new Error(error.message);
  }
  return data as Question[];
};

const SimuladoQuiz = ({ numQuestions, totalTime, onFinish }: SimuladoQuizProps) => {
  const { data: simuladoQuestions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['simuladoQuestions', numQuestions],
    queryFn: () => fetchSimuladoQuestions(numQuestions),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [isFinishingOnTimeUp, setIsFinishingOnTimeUp] = useState(false);

  useEffect(() => {
    if (isLoadingQuestions) return;
    if (timeLeft <= 0 && !isFinishingOnTimeUp) {
      setIsFinishingOnTimeUp(true);
      setShowTimeUpDialog(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoadingQuestions, isFinishingOnTimeUp]);

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

  const handleDialogClose = (open: boolean) => {
    setShowTimeUpDialog(open);
    if (!open && isFinishingOnTimeUp) {
      // Apenas finaliza o simulado DEPOIS que o diálogo for completamente fechado.
      finishSimulado(userAnswers);
    }
  };

  if (isLoadingQuestions || simuladoQuestions.length === 0) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-2">Preparando seu simulado...</span></div>;
  }

  const currentQuestion = simuladoQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / simuladoQuestions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <AlertDialog open={showTimeUpDialog} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> Tempo Esgotado!</AlertDialogTitle>
            <AlertDialogDescription>Seu tempo para o simulado acabou. Vamos ver seus resultados.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Ver Resultados</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Questão {currentQuestionIndex + 1} de {simuladoQuestions.length}</CardTitle>
            <div className="flex items-center gap-2 font-bold text-lg bg-destructive text-destructive-foreground px-3 py-1 rounded-md">
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
            <p className="text-sm text-muted-foreground mb-2">{currentQuestion.category}</p>
            <p className="font-semibold text-lg">{currentQuestion.question}</p>
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