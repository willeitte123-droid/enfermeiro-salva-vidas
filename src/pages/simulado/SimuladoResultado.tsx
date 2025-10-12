import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, Clock, Award, RefreshCw, LayoutDashboard } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
}

const SimuladoResultado = () => {
  const location = useLocation();
  const { userAnswers, questions, timeTaken } = location.state as {
    userAnswers: UserAnswer[];
    questions: Question[];
    timeTaken: number;
  };

  const score = userAnswers.reduce((acc, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    const saveResult = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase.from('user_simulations').insert({
          user_id: session.user.id,
          score: score,
          total_questions: questions.length,
          percentage: percentage,
          time_taken_seconds: timeTaken,
        });
        if (error) {
          console.error("Error saving simulation result:", error);
        }
      }
    };
    saveResult();
  }, [score, questions.length, percentage, timeTaken]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Resultado do Simulado</h1>
        <p className="text-muted-foreground">Analise seu desempenho e aprenda com seus erros.</p>
      </div>

      <Card className="text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Award className="h-10 w-10 text-amber-500" />
          </div>
          <CardTitle className="text-3xl">Desempenho Final</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Pontuação</p>
            <p className="text-4xl font-bold text-primary">{score}/{questions.length}</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Aproveitamento</p>
            <p className="text-4xl font-bold text-primary">{percentage}%</p>
            <Progress value={percentage} className="mt-2" />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Tempo Gasto</p>
            <p className="text-4xl font-bold text-primary">{formatTime(timeTaken)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revisão Detalhada</CardTitle>
          <CardDescription>Analise cada questão para aprimorar seus conhecimentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {questions.map((q, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === q.id);
              const isCorrect = userAnswer?.selectedAnswer === q.correctAnswer;
              return (
                <AccordionItem key={q.id} value={`item-${index}`} className="border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 w-full">
                      {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                      <span className="text-left flex-1">Questão {index + 1}: {q.question.substring(0, 50)}...</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <p className="font-semibold">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map(opt => {
                        const isUserChoice = userAnswer?.selectedAnswer === opt.id;
                        const isCorrectChoice = q.correctAnswer === opt.id;
                        return (
                          <div key={opt.id} className={`p-3 rounded-md border-2 ${isCorrectChoice ? 'border-green-500 bg-green-50 dark:bg-green-950' : (isUserChoice ? 'border-red-500 bg-red-50 dark:bg-red-950' : '')}`}>
                            {opt.id}) {opt.text}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-semibold text-sm">Explicação:</h4>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button asChild variant="outline" size="lg">
          <Link to="/"><LayoutDashboard className="mr-2 h-4 w-4" />Menu Principal</Link>
        </Button>
        <Button asChild size="lg">
          <Link to="/simulado"><RefreshCw className="mr-2 h-4 w-4" />Fazer Novo Simulado</Link>
        </Button>
      </div>
    </div>
  );
};

export default SimuladoResultado;