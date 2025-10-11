import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Lightbulb, Award, RefreshCw, MessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";

interface Question {
  id: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

const commentSchema = z.object({
  content: z.string().min(1, { message: "O comentário não pode estar vazio." }).max(500, { message: "O comentário não pode ter mais de 500 caracteres." }),
});

const Questions = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questions.json");
        if (!response.ok) throw new Error("Falha ao carregar as questões.");
        const data: Question[] = await response.json();
        setQuestions(data.sort(() => Math.random() - 0.5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const fetchComments = async (questionId: number) => {
    setIsCommentsLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(first_name, last_name)")
      .eq("question_id", questionId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao buscar comentários", { description: error.message });
    } else {
      setComments(data || []);
    }
    setIsCommentsLoading(false);
  };

  useEffect(() => {
    if (isCommentsOpen && questions.length > 0) {
      fetchComments(questions[currentQuestion].id);
    }
  }, [isCommentsOpen, currentQuestion, questions]);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    setShowExplanation(true);
    if (!answeredQuestions.includes(currentQuestion)) {
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setShowExplanation(false);
    setIsCommentsOpen(false);
    setComments([]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const resetQuiz = () => {
    setIsFinished(false);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setIsCommentsOpen(false);
    setQuestions([...questions].sort(() => Math.random() - 0.5));
  };

  async function onCommentSubmit(values: z.infer<typeof commentSchema>) {
    if (!profile) return;
    setIsSubmittingComment(true);
    const { error } = await supabase.from("comments").insert({
      question_id: questions[currentQuestion].id,
      content: values.content,
    });
    setIsSubmittingComment(false);
    if (error) {
      toast.error("Falha ao enviar comentário", { description: "Por favor, tente novamente. Se o erro persistir, contate o suporte." });
      console.error("Error submitting comment:", error);
    } else {
      toast.success("Comentário enviado!");
      form.reset();
      fetchComments(questions[currentQuestion].id);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="ml-4 text-muted-foreground">Carregando...</span></div>;
  if (error) return <Alert variant="destructive"><XCircle className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  if (questions.length === 0) return <p>Nenhuma questão encontrada.</p>;

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let feedbackMessage = "Não desanime! A prática leva à perfeição.";
    if (percentage >= 90) feedbackMessage = "Excelente desempenho! Você é um expert!";
    else if (percentage >= 70) feedbackMessage = "Ótimo trabalho! Continue assim.";
    else if (percentage >= 50) feedbackMessage = "Bom esforço! Continue estudando para melhorar.";

    return (
      <div className="max-w-4xl mx-auto"><Card className="text-center"><CardHeader><div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4"><Award className="h-8 w-8 text-amber-500" /></div><CardTitle className="text-2xl">Quiz Finalizado!</CardTitle><CardDescription>{feedbackMessage}</CardDescription></CardHeader><CardContent className="space-y-6"><div className="text-4xl font-bold text-primary">{score} / {questions.length}</div><div className="space-y-2"><Progress value={percentage} className="w-full" /><p className="text-lg font-semibold">{percentage}% de acerto</p></div><Button onClick={resetQuiz} className="w-full md:w-auto"><RefreshCw className="mr-2 h-4 w-4" />Reiniciar Quiz</Button></CardContent></Card></div>
    );
  }

  const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-3xl font-bold text-foreground mb-2">Banca de Questões</h1><p className="text-muted-foreground">Teste seus conhecimentos com questões de concurso comentadas.</p></div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2"><Badge variant="secondary">{questions[currentQuestion].category}</Badge><CardDescription>Pontuação: <strong>{score} / {answeredQuestions.length}</strong></CardDescription></div>
          <CardTitle className="text-lg">Questão {currentQuestion + 1} de {questions.length}</CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">{questions[currentQuestion].question}</h3>
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showExplanation} className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <Label key={option.id} htmlFor={`${option.id}-${questions[currentQuestion].id}`} className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${showExplanation ? (option.id === questions[currentQuestion].correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-950 font-semibold" : (option.id === selectedAnswer ? "border-red-500 bg-red-50 dark:bg-red-950" : "border-border")) : "border-border hover:border-primary hover:bg-accent"}`}>
                  <RadioGroupItem value={option.id} id={`${option.id}-${questions[currentQuestion].id}`} />
                  <span className="flex-1 text-foreground"><span className="font-bold">{option.id})</span> {option.text}</span>
                  {showExplanation && option.id === questions[currentQuestion].correctAnswer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {showExplanation && option.id === selectedAnswer && option.id !== questions[currentQuestion].correctAnswer && <XCircle className="h-5 w-5 text-red-600" />}
                </Label>
              ))}
            </RadioGroup>
          </div>

          {showExplanation && (
            <>
              <Alert className={`border-2 ${isCorrect ? "border-green-500" : "border-red-500"}`}>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="font-semibold">{isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}</AlertTitle>
                <AlertDescription><strong>Gabarito: {questions[currentQuestion].correctAnswer}.</strong> {questions[currentQuestion].explanation}</AlertDescription>
              </Alert>

              <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full"><MessageSquare className="mr-2 h-4 w-4" />Ver Comentários da Comunidade <Badge variant="secondary" className="ml-2">{comments.length}</Badge></Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  {isCommentsLoading ? <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                    comments.length === 0 ? <p className="text-sm text-center text-muted-foreground">Nenhum comentário ainda. Seja o primeiro!</p> :
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {comments.map(comment => (
                          <div key={comment.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback>{`${comment.profiles?.first_name?.[0] || ''}${comment.profiles?.last_name?.[0] || ''}`}</AvatarFallback></Avatar>
                            <div className="flex-1 bg-muted p-3 rounded-lg"><div className="flex justify-between items-center"><p className="text-sm font-semibold">{`${comment.profiles?.first_name} ${comment.profiles?.last_name}`}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}</p></div><p className="text-sm mt-1">{comment.content}</p></div>
                          </div>
                        ))}
                      </div>
                  }
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onCommentSubmit)} className="flex items-start gap-3">
                      <FormField control={form.control} name="content" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl><Textarea placeholder="Adicione seu comentário..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" disabled={isSubmittingComment}>{isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}</Button>
                    </form>
                  </Form>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          <div className="flex justify-end">
            {!showExplanation ? <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="w-full md:w-auto">Responder</Button> :
              (currentQuestion < questions.length - 1 ? <Button onClick={handleNextQuestion} className="w-full md:w-auto">Próxima Questão</Button> :
                <Button onClick={() => setIsFinished(true)} className="w-full md:w-auto">Ver Resultados</Button>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questions;