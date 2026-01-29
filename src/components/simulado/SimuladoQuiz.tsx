import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Timer, AlertTriangle, Building2, BookOpen, CheckCircle2 } from "lucide-react";
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
  userId?: string;
  onFinish: (results: { userAnswers: UserAnswer[]; questions: Question[]; timeTaken: number }) => void;
}

const fetchSimuladoQuestions = async (numQuestions: number, banca: string, category?: string, userId?: string) => {
  // 1. Buscar IDs de questões que o usuário JÁ respondeu
  let answeredIds: number[] = [];
  
  if (userId) {
    const { data: answeredData } = await supabase
      .from('user_question_answers')
      .select('question_id')
      .eq('user_id', userId);
    
    if (answeredData && answeredData.length > 0) {
      answeredIds = answeredData.map(a => a.question_id);
    }
  }

  // 2. Tentar buscar questões INÉDITAS (excluindo as respondidas)
  let query = supabase.from('questions').select('*');

  if (category && category !== 'Todas') {
    query = query.eq('category', category);
  }

  // Se a lista de respondidas não for vazia, aplicamos o filtro NOT IN
  if (answeredIds.length > 0) {
    // Supabase aceita string de ids separados por vírgula para filtros 'in' e 'not.in'
    // Limitamos o tamanho do filtro para evitar erro de URL muito longa se houver milhares
    // Se houver muitas, pegamos as últimas 1000 por exemplo, ou confiamos no limite do POST do supabase
    query = query.not('id', 'in', `(${answeredIds.join(',')})`);
  }

  // Buscamos um pouco mais do que o necessário para garantir aleatoriedade
  query = query.limit(numQuestions * 2);

  const { data: newQuestionsData, error: newQuestionsError } = await query;
  
  if (newQuestionsError) {
    console.error("Erro ao buscar questões novas:", newQuestionsError);
    // Se der erro (ex: lista muito longa), fazemos fallback para busca normal
  }

  let finalQuestions: Question[] = newQuestionsData ? (newQuestionsData as Question[]) : [];

  // 3. Se não houver questões inéditas suficientes, completamos com questões repetidas
  if (finalQuestions.length < numQuestions) {
    const missingCount = numQuestions - finalQuestions.length;
    
    let retryQuery = supabase.from('questions').select('*');
    if (category && category !== 'Todas') {
      retryQuery = retryQuery.eq('category', category);
    }
    // Buscamos questões gerais sem filtro de exclusão
    retryQuery = retryQuery.limit(missingCount + 20); // Margem de segurança

    const { data: fillerData } = await retryQuery;
    
    if (fillerData) {
      const fillerQuestions = fillerData as Question[];
      // Adicionamos apenas as que já não estão na lista (para evitar duplicação imediata)
      const currentIds = new Set(finalQuestions.map(q => q.id));
      const validFillers = fillerQuestions.filter(q => !currentIds.has(q.id));
      
      finalQuestions = [...finalQuestions, ...validFillers];
    }
  }

  // Embaralhar as questões
  let shuffledQuestions = finalQuestions.sort(() => 0.5 - Math.random());
  
  // Cortar para o tamanho do simulado
  shuffledQuestions = shuffledQuestions.slice(0, numQuestions);

  // Processar opções e banca visual
  return shuffledQuestions.map(q => {
    const questionWithOptions = shuffleQuestionOptions(q);
    
    // Se o usuário selecionou uma banca específica (diferente de "Todas"), 
    // nós "simulamos" que a questão é daquela banca para fins de imersão visual,
    // já que o banco de dados pode não ter questões suficientes de cada banca específica ainda.
    if (banca !== 'Todas') {
      return { ...questionWithOptions, banca: banca };
    }
    
    return questionWithOptions;
  });
};

const SimuladoQuiz = ({ numQuestions, totalTime, banca, category, userId, onFinish }: SimuladoQuizProps) => {
  const { data: simuladoQuestions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['simuladoQuestions', numQuestions, banca, category, userId], // Adicionado userId à chave para refetch se mudar
    queryFn: () => fetchSimuladoQuestions(numQuestions, banca, category, userId),
    staleTime: 0, // Não cachear para forçar busca nova e aleatória
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
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" /> 
        <div className="text-center">
          <p className="font-semibold text-lg">Preparando seu simulado...</p>
          <p className="text-sm text-muted-foreground">Selecionando questões inéditas para você.</p>
        </div>
      </div>
    );
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
    <div className="flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-500">
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

      <Card className="w-full max-w-3xl shadow-2xl border-t-4 border-t-primary">
        <CardHeader className="border-b bg-muted/10 pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs font-medium flex items-center gap-1 bg-background px-2 py-1">
                        <Building2 className="h-3 w-3" /> {currentQuestion.banca || 'Geral'}
                    </Badge>
                    {currentQuestion.category && (
                        <Badge variant="secondary" className="text-xs font-medium flex items-center gap-1 px-2 py-1">
                            <BookOpen className="h-3 w-3" /> {currentQuestion.category}
                        </Badge>
                    )}
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Questão {currentQuestionIndex + 1}</span>
                   <span className="text-xs text-muted-foreground">de {simuladoQuestions.length}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-xl bg-destructive/5 text-destructive border border-destructive/20 px-4 py-2 rounded-lg shadow-inner self-start md:self-auto">
              <Timer className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
             <ProgressPrimitive.Root value={progress} className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <ProgressPrimitive.Indicator
                className="h-full w-full flex-1 bg-primary transition-all duration-500 ease-in-out"
                style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
                />
             </ProgressPrimitive.Root>
             <span className="text-xs font-bold text-muted-foreground w-8 text-right">{Math.round(progress)}%</span>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-8">
          <div>
            <p className="font-medium text-lg sm:text-xl leading-relaxed text-foreground/90">{currentQuestion.question}</p>
          </div>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {currentQuestion.options.map((option) => (
              <Label key={option.id} className="flex items-start space-x-3 p-4 rounded-xl border-2 border-transparent bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-sm group">
                <RadioGroupItem value={option.id} className="mt-1" />
                <span className="text-base group-has-[:checked]:font-medium">{option.text}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <div className="p-6 border-t bg-muted/10 flex justify-between items-center">
          <span className="text-xs text-muted-foreground italic hidden sm:block">
             <CheckCircle2 className="inline h-3 w-3 mr-1"/>
             Selecione uma alternativa para avançar
          </span>
          <Button onClick={handleNext} disabled={!selectedAnswer} size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20">
            {currentQuestionIndex === simuladoQuestions.length - 1 ? "Finalizar Simulado" : "Próxima Questão"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SimuladoQuiz;