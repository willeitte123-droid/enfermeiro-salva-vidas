import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Timer, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Question {
  id: number;
  category: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
}

const Simulado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { numQuestions, totalTime } = location.state || { numQuestions: 20, totalTime: 20 * 2 * 60 };

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [simuladoQuestions, setSimuladoQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questions.json");
        const data: Question[] = await response.json();
        setAllQuestions(data);
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setSimuladoQuestions(shuffled.slice(0, numQuestions));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [numQuestions]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setShowTimeUpDialog(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleNext = () => {
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
    navigate("/simulado/resultado", {
      state: {
        userAnswers: finalAnswers,
        questions: simuladoQuestions,
        totalTime: totalTime,
        timeTaken: totalTime - timeLeft,
      },
    });
  };

  if (loading || simuladoQuestions.length === 0) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const currentQuestion = simuladoQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / simuladoQuestions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
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
          <div className="flex justify-between items-center">
            <CardTitle>Questão {currentQuestionIndex + 1} de {simuladoQuestions.length}</CardTitle>
            <div className="flex items-center gap-2 font-bold text-lg bg-destructive text-destructive-foreground px-3 py-1 rounded-md">
              <Timer className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{currentQuestion.category}</p>
            <p className="font-semibold text-lg">{currentQuestion.question}</p>
          </div>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {currentQuestion.options.map((option) => (
              <Label key={option.id} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-accent transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10">
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

export default Simulado;