import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOutletContext, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Lightbulb, RefreshCw, MessageSquare, Smile, Trash2, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Question } from "@/context/QuestionsContext";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { shuffleQuestionOptions } from "@/lib/utils";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  role: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  } | null;
}

const commentSchema = z.object({
  content: z.string().min(1, { message: "O comentário não pode estar vazio." }).max(500, { message: "O comentário não pode ter mais de 500 caracteres." }),
});

const QUESTIONS_PER_PAGE = 1;

const Questions = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const { addActivity } = useActivityTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const questionId = searchParams.get('id');
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "Todas");
  const [answerStatusFilter, setAnswerStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  // Estado para forçar recarregamento aleatório
  const [randomSeed, setRandomSeed] = useState(0);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Banca de Questões', path: '/questions', icon: 'FileQuestion' });
  }, [addActivity]);

  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSearchParams(prev => {
      if (value === "Todas") {
        prev.delete("category");
      } else {
        prev.set("category", value);
      }
      return prev;
    });
  };

  // Determina se estamos no modo aleatório (sem filtros e sem ID específico)
  const isRandomMode = !questionId && selectedCategory === "Todas" && answerStatusFilter === "all";

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['questionCategories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('questions').select('category');
      if (error) throw error;
      const uniqueCategories = [...new Set(data.map(q => q.category))];
      return ["Todas", ...uniqueCategories.sort()];
    }
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['questions', selectedCategory, answerStatusFilter, currentPage, questionId, randomSeed],
    queryFn: async () => {
      // Caso 1: Questão específica por ID (via Link do Dashboard)
      if (questionId) {
        const { data, error } = await supabase.from('questions').select('*').eq('id', questionId).single();
        if (error) throw error;
        const shuffledQuestion = data ? shuffleQuestionOptions(data as Question) : null;
        return { questions: shuffledQuestion ? [shuffledQuestion] : [], count: data ? 1 : 0 };
      }

      // Caso 2: Modo Aleatório (Sem filtros) - Usa RPC
      if (selectedCategory === "Todas" && answerStatusFilter === "all") {
        const { data, error } = await supabase.rpc('get_random_questions', { limit_count: 1 });
        if (error) throw error;
        const shuffledQuestions = (data as Question[]).map(shuffleQuestionOptions);
        // No modo aleatório, count é irrelevante para paginação, retornamos 0 ou um placeholder
        return { questions: shuffledQuestions, count: -1 }; 
      }

      // Caso 3: Modo Filtrado (Categoria ou Status) - Usa Paginação Padrão
      const from = currentPage * QUESTIONS_PER_PAGE;
      const to = from + QUESTIONS_PER_PAGE - 1;

      let query = supabase.from('questions').select('*', { count: 'exact' });
      
      if (selectedCategory !== "Todas") {
        query = query.eq('category', selectedCategory);
      }

      if (profile && answerStatusFilter !== 'all') {
        const answeredQuery = supabase
          .from('user_question_answers')
          .select('question_id, is_correct')
          .eq('user_id', profile.id);
        
        const { data: answeredData, error: answeredError } = await answeredQuery;
        if (answeredError) throw answeredError;

        if (answerStatusFilter === 'unanswered') {
          const answeredIds = answeredData.map(a => a.question_id);
          if (answeredIds.length > 0) {
            query = query.not('id', 'in', `(${answeredIds.join(',')})`);
          }
        } else {
          const isCorrect = answerStatusFilter === 'correct';
          const relevantIds = answeredData
            .filter(a => a.is_correct === isCorrect)
            .map(a => a.question_id);
          
          if (relevantIds.length === 0) {
            return { questions: [], count: 0 };
          }
          query = query.in('id', relevantIds);
        }
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      
      const shuffledQuestions = (data as Question[]).map(shuffleQuestionOptions);
      return { questions: shuffledQuestions, count };
    },
    keepPreviousData: !questionId && !isRandomMode, // Não manter dados anteriores no modo aleatório para forçar refresh visual
  });

  const currentQuestion = data?.questions?.[0];
  const totalQuestions = data?.count ?? 0;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const isSingleQuestionMode = !!questionId;

  useEffect(() => {
    setSelectedAnswer("");
    setShowExplanation(false);
    setAnsweredCorrectly(null);
    setIsCommentsOpen(false);
    setComments([]);
  }, [currentPage, selectedCategory, answerStatusFilter, currentQuestion, randomSeed]);

  useEffect(() => {
    setCurrentPage(0);
    setRandomSeed(0); // Reseta a seed ao mudar filtros
  }, [selectedCategory, answerStatusFilter]);

  const fetchComments = async (questionId: number) => {
    setIsCommentsLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(id, first_name, last_name, avatar_url)")
      .eq("question_id", questionId)
      .order("created_at", { ascending: false });

    if (error) toast.error("Erro ao buscar comentários", { description: error.message });
    else setComments(data || []);
    setIsCommentsLoading(false);
  };

  useEffect(() => {
    if (isCommentsOpen && currentQuestion) {
      fetchComments(currentQuestion.id);
    }
  }, [isCommentsOpen, currentQuestion]);

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;
    setShowExplanation(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnsweredCorrectly(isCorrect);

    if (profile) {
      await supabase.from('user_question_answers').insert({
        user_id: profile.id,
        question_id: currentQuestion.id,
        is_correct: isCorrect,
      });
    }
  };

  const handleNextQuestion = () => {
    if (isRandomMode) {
      // No modo aleatório, incrementamos a seed para forçar uma nova busca RPC
      setRandomSeed(prev => prev + 1);
    } else if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  async function onCommentSubmit(values: z.infer<typeof commentSchema>) {
    if (!profile || !currentQuestion) return;
    setIsSubmittingComment(true);
    const { error } = await supabase.from("comments").insert({
      question_id: currentQuestion.id,
      content: values.content,
    });
    setIsSubmittingComment(false);
    if (error) {
      toast.error("Falha ao enviar comentário", { description: "Por favor, tente novamente." });
    } else {
      toast.success("Comentário enviado!");
      form.reset();
      fetchComments(currentQuestion.id);
    }
  }

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    setIsDeletingComment(true);
    const { error } = await supabase.from("comments").delete().eq("id", commentToDelete);
    setIsDeletingComment(false);
    setIsDeleteDialogOpen(false);

    if (error) toast.error("Erro ao apagar comentário", { description: error.message });
    else {
      toast.success("Comentário apagado com sucesso.");
      setComments(prev => prev.filter(c => c.id !== commentToDelete));
    }
    setCommentToDelete(null);
  };

  const getNoQuestionsMessage = () => {
    switch (answerStatusFilter) {
      case 'unanswered': return 'Você respondeu todas as questões nesta categoria!';
      case 'correct': return 'Nenhuma questão acertada encontrada para esta categoria.';
      case 'incorrect': return 'Nenhuma questão errada encontrada. Parabéns!';
      default: return 'Nenhuma questão encontrada para a categoria selecionada.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. O comentário será permanentemente apagado.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteComment} disabled={isDeletingComment}>{isDeletingComment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Apagar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Banca de Questões</h1>
        <p className="text-muted-foreground">Afie seu raciocínio clínico. Desafie-se com questões de concurso e residência.</p>
      </div>
      {!isSingleQuestionMode && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="category-filter">Filtrar por Categoria</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
              <SelectContent>{isLoadingCategories ? <div className="p-2"><Loader2 className="h-4 w-4 animate-spin"/></div> : categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {profile && (
            <div className="space-y-2 flex-1">
              <Label htmlFor="status-filter">Filtrar por Status</Label>
              <Select value={answerStatusFilter} onValueChange={setAnswerStatusFilter}>
                <SelectTrigger id="status-filter"><SelectValue placeholder="Selecione um status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Questões</SelectItem>
                  <SelectItem value="unanswered">Não Resolvidas</SelectItem>
                  <SelectItem value="correct">Acertos</SelectItem>
                  <SelectItem value="incorrect">Erros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {isLoading ? <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="ml-4 text-muted-foreground">Buscando questão...</span></div> :
       error ? <Alert variant="destructive"><XCircle className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{(error as Error).message}</AlertDescription></Alert> :
       !currentQuestion ? <Card><CardContent className="py-12 text-center text-muted-foreground">{getNoQuestionsMessage()}</CardContent></Card> :
      (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <Badge variant="secondary">{currentQuestion.category}</Badge>
              {!isSingleQuestionMode && (
                isRandomMode ? (
                  <Badge variant="outline" className="flex items-center gap-1 bg-primary/5 text-primary border-primary/20"><Shuffle className="h-3 w-3"/> Modo Aleatório</Badge>
                ) : (
                  <CardDescription>Questão <strong>{currentPage + 1}</strong> de <strong>{totalQuestions}</strong></CardDescription>
                )
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-4">{currentQuestion.question}</h3>
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showExplanation} className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <Label key={option.id} htmlFor={`${option.id}-${currentQuestion.id}`} className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${showExplanation ? (option.id === currentQuestion.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-950 font-semibold" : (option.id === selectedAnswer ? "border-red-500 bg-red-50 dark:bg-red-950" : "border-border")) : "border-border hover:border-primary hover:bg-accent"}`}>
                    <RadioGroupItem value={option.id} id={`${option.id}-${currentQuestion.id}`} />
                    <span className="flex-1 text-foreground"><span className="font-bold">{option.id})</span> {option.text}</span>
                    {showExplanation && option.id === currentQuestion.correctAnswer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {showExplanation && option.id === selectedAnswer && option.id !== currentQuestion.correctAnswer && <XCircle className="h-5 w-5 text-red-600" />}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {showExplanation && (
              <>
                <Alert className={`border-2 ${answeredCorrectly ? "border-green-500" : "border-red-500"}`}>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle className="font-semibold">{answeredCorrectly ? "Resposta Correta!" : "Resposta Incorreta"}</AlertTitle>
                  <AlertDescription><strong>Gabarito: {currentQuestion.correctAnswer}.</strong> {currentQuestion.explanation}</AlertDescription>
                </Alert>

                <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                  <CollapsibleTrigger asChild><Button variant="outline" className="w-full"><MessageSquare className="mr-2 h-4 w-4" />Ver Comentários da Comunidade <Badge variant="secondary" className="ml-2">{comments.length}</Badge></Button></CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    {isCommentsLoading ? <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                      comments.length === 0 ? <p className="text-sm text-center text-muted-foreground">Nenhum comentário ainda. Seja o primeiro!</p> :
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                          {comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-3">
                              <Link to={`/user/${comment.profiles?.id}`} className="flex-shrink-0"><Avatar className="h-8 w-8"><AvatarImage src={comment.profiles?.avatar_url} className="object-cover" /><AvatarFallback>{`${comment.profiles?.first_name?.[0] || ''}${comment.profiles?.last_name?.[0] || ''}`}</AvatarFallback></Avatar></Link>
                              <div className="flex-1 bg-muted p-3 rounded-lg">
                                <div className="flex justify-between items-center"><Link to={`/user/${comment.profiles?.id}`} className="hover:underline"><p className="text-sm font-semibold">{`${comment.profiles?.first_name} ${comment.profiles?.last_name}`}</p></Link>
                                  <div className="flex items-center gap-2"><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}</p>
                                    {profile?.role === 'admin' && (<Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setCommentToDelete(comment.id); setIsDeleteDialogOpen(true); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>)}
                                  </div>
                                </div>
                                <p className="text-sm mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                    }
                    <Form {...form}><form onSubmit={form.handleSubmit(onCommentSubmit)} className="flex items-start gap-2"><FormField control={form.control} name="content" render={({ field }) => (<FormItem className="flex-1"><FormControl><Textarea placeholder="Adicione seu comentário..." {...field} /></FormControl><FormMessage /></FormItem>)} /><Popover><PopoverTrigger asChild><Button type="button" variant="outline" size="icon" className="flex-shrink-0"><Smile className="h-4 w-4" /></Button></PopoverTrigger><PopoverContent className="p-0 w-full"><EmojiPicker onEmojiClick={(emojiObject) => {form.setValue('content', form.getValues('content') + emojiObject.emoji);}} height={350} width="100%" /></PopoverContent></Popover><Button type="submit" disabled={isSubmittingComment} className="flex-shrink-0">{isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}</Button></form></Form>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}

            <div className="flex justify-between items-center">
              {isSingleQuestionMode ? (
                <Button variant="outline" asChild>
                  <Link to="/questions"><ChevronLeft className="h-4 w-4 mr-2" />Voltar para a Banca</Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0 || isFetching || isRandomMode}>
                  <ChevronLeft className="h-4 w-4 mr-2" />Anterior
                </Button>
              )}
              
              {!showExplanation ? (
                <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer || isFetching}>Responder</Button>
              ) : !isSingleQuestionMode ? (
                <Button onClick={handleNextQuestion} disabled={(currentPage >= totalPages - 1 && !isRandomMode) || isFetching}>
                  {isRandomMode ? "Sortear Próxima" : "Próxima Questão"} <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div></div> // Placeholder to keep alignment
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Questions;