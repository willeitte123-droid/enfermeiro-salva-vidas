import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOutletContext, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, XCircle, Loader2, Lightbulb, MessageSquare, 
  Smile, Trash2, ChevronLeft, ChevronRight, Shuffle, Filter, 
  BookOpen, Trophy, AlertCircle
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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

  const isRandomMode = !questionId && selectedCategory === "Todas" && answerStatusFilter === "all";

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['questionCategories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('questions').select('category');
      if (error) throw error;
      const uniqueCategories = [...new Set(data.map(q => q.category).filter(Boolean))];
      return ["Todas", ...uniqueCategories.sort()];
    }
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['questions', selectedCategory, answerStatusFilter, currentPage, questionId, randomSeed],
    queryFn: async () => {
      if (questionId) {
        const { data, error } = await supabase.from('questions').select('*').eq('id', questionId).single();
        if (error) throw error;
        const shuffledQuestion = data ? shuffleQuestionOptions(data as Question) : null;
        return { questions: shuffledQuestion ? [shuffledQuestion] : [], count: data ? 1 : 0 };
      }

      if (selectedCategory === "Todas" && answerStatusFilter === "all") {
        const { data, error } = await supabase.rpc('get_random_questions', { limit_count: 1 });
        if (error) throw error;
        const shuffledQuestions = (data as Question[]).map(shuffleQuestionOptions);
        return { questions: shuffledQuestions, count: -1 }; 
      }

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
    keepPreviousData: !questionId && !isRandomMode,
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
    setRandomSeed(0);
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
    <div className="max-w-5xl mx-auto pb-10">
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. O comentário será permanentemente apagado.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteComment} disabled={isDeletingComment}>{isDeletingComment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Apagar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hero Header - BLUE THEME */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 text-white shadow-xl">
         <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <BookOpen className="w-64 h-64 -mr-16 -mt-16 rotate-12" />
         </div>
         
         <div className="relative p-6 md:p-10 z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-3 backdrop-blur-sm">Modo de Estudo</Badge>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Banca de Questões</h1>
                <p className="text-blue-100 max-w-xl text-lg opacity-90">
                  Treine com milhares de questões comentadas. Afie seu raciocínio clínico e domine o conteúdo.
                </p>
              </div>
              
              {!isSingleQuestionMode && (
                 <div className="flex flex-col gap-2 min-w-[200px] bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-200">Filtros Ativos</span>
                    <div className="flex items-center gap-2">
                       <Filter className="w-4 h-4 text-cyan-200" />
                       <span className="font-semibold text-sm truncate">{selectedCategory}</span>
                    </div>
                 </div>
              )}
            </div>
         </div>
      </div>

      {/* Control Bar */}
      {!isSingleQuestionMode && (
        <div className="bg-background border rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-20 backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
             <div className="flex items-center gap-2 w-full md:w-auto">
               <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
               <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full md:w-[240px] bg-card"><SelectValue placeholder="Categoria" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {isLoadingCategories ? <div className="p-2"><Loader2 className="h-4 w-4 animate-spin"/></div> : categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>

             {profile && (
               <Select value={answerStatusFilter} onValueChange={setAnswerStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Questões</SelectItem>
                    <SelectItem value="unanswered">Não Respondidas</SelectItem>
                    <SelectItem value="correct">Meus Acertos</SelectItem>
                    <SelectItem value="incorrect">Meus Erros</SelectItem>
                  </SelectContent>
               </Select>
             )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
             {isRandomMode ? (
                <Badge variant="secondary" className="gap-1 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"><Shuffle className="w-3 h-3"/> Aleatório</Badge>
             ) : (
                <>
                  <span className="hidden md:inline">Progresso:</span>
                  <span className="font-mono font-bold text-foreground">{currentPage + 1}</span>
                  <span className="opacity-50">/</span>
                  <span className="font-mono font-bold">{totalQuestions > 0 ? totalQuestions : "-"}</span>
                </>
             )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                <div className="relative bg-background p-4 rounded-full border shadow-sm">
                   <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
             </div>
             <span className="text-muted-foreground font-medium animate-pulse">Carregando questão...</span>
          </div>
        ) : error ? (
           <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar</AlertTitle>
              <AlertDescription>{(error as Error).message}</AlertDescription>
           </Alert>
        ) : !currentQuestion ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/10 rounded-2xl border border-dashed">
             <div className="p-4 bg-muted rounded-full">
                <Trophy className="w-10 h-10 text-yellow-500 opacity-80" />
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-bold">{getNoQuestionsMessage()}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Tente mudar os filtros ou selecionar outra categoria para continuar estudando.</p>
             </div>
             <Button variant="outline" onClick={() => {setAnswerStatusFilter('all'); setSelectedCategory('Todas');}}>Limpar Filtros</Button>
          </div>
        ) : (
          <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-lg transition-all duration-300">
            <CardHeader className="bg-muted/5 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                 <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-background font-semibold text-blue-700 border-blue-200 px-3 py-1 dark:text-blue-300 dark:border-blue-800">
                       {currentQuestion.category}
                    </Badge>
                    <Badge variant="secondary" className="opacity-70">Enfermagem</Badge>
                    {isRandomMode && <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"><Shuffle className="w-3 h-3"/> Aleatório</Badge>}
                 </div>
              </div>
              <h3 className="text-lg md:text-xl font-medium leading-relaxed text-foreground/90 font-serif tracking-wide">
                 {currentQuestion.question}
              </h3>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-8">
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showExplanation} className="space-y-3">
                {currentQuestion.options.map((option) => {
                   const isSelected = option.id === selectedAnswer;
                   const isCorrect = option.id === currentQuestion.correctAnswer;
                   const showSuccess = showExplanation && isCorrect;
                   const showError = showExplanation && isSelected && !isCorrect;
                   const isNeutral = !showExplanation;

                   return (
                      <Label 
                        key={option.id} 
                        htmlFor={`${option.id}-${currentQuestion.id}`} 
                        className={cn(
                           "flex items-start space-x-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden group",
                           isNeutral && "hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:shadow-sm",
                           isSelected && isNeutral && "border-blue-500 bg-blue-50/80 dark:bg-blue-900/30 ring-1 ring-blue-500/30",
                           showSuccess && "border-green-500 bg-green-50 dark:bg-green-950/30 ring-1 ring-green-500/50",
                           showError && "border-red-500 bg-red-50 dark:bg-red-950/30 opacity-90",
                           showExplanation && !isCorrect && !isSelected && "opacity-50 grayscale"
                        )}
                      >
                        {showSuccess && <div className="absolute right-0 top-0 p-1 bg-green-500 text-white rounded-bl-lg"><CheckCircle2 className="w-4 h-4" /></div>}
                        {showError && <div className="absolute right-0 top-0 p-1 bg-red-500 text-white rounded-bl-lg"><XCircle className="w-4 h-4" /></div>}
                        
                        <RadioGroupItem value={option.id} id={`${option.id}-${currentQuestion.id}`} className="mt-1 border-blue-500 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1 space-y-1">
                           <span className={cn(
                              "font-bold mr-2 inline-block w-6", 
                              showSuccess ? "text-green-600 dark:text-green-400" : 
                              showError ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                           )}>{option.id})</span>
                           <span className={cn(
                              "text-base leading-relaxed",
                              showSuccess && "font-medium text-green-900 dark:text-green-100",
                              showError && "text-red-900 dark:text-red-100"
                           )}>{option.text}</span>
                        </div>
                      </Label>
                   );
                })}
              </RadioGroup>

              {showExplanation && (
                 <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Alert className={cn(
                       "border-l-4 shadow-sm mb-6", 
                       answeredCorrectly ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/10 border-green-200" : "border-l-red-500 bg-red-50/50 dark:bg-red-950/10 border-red-200"
                    )}>
                       <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-full mt-0.5", answeredCorrectly ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                             {answeredCorrectly ? <Trophy className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                             <AlertTitle className="text-lg font-bold flex items-center gap-2">
                                {answeredCorrectly ? <span className="text-green-700 dark:text-green-400">Excelente! Resposta Correta.</span> : <span className="text-red-700 dark:text-red-400">Resposta Incorreta.</span>}
                             </AlertTitle>
                             <div className="mt-2 text-foreground/80 leading-relaxed space-y-2">
                                <p><strong>Gabarito: Letra {currentQuestion.correctAnswer}</strong></p>
                                <Separator className="my-2 bg-foreground/10" />
                                <p className="text-sm md:text-base">{currentQuestion.explanation}</p>
                             </div>
                          </div>
                       </div>
                    </Alert>

                    <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen} className="border rounded-xl overflow-hidden bg-background shadow-sm">
                      <CollapsibleTrigger asChild>
                         <div className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors group">
                           <div className="flex items-center gap-2 font-medium text-sm">
                              <MessageSquare className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                              Comentários da Comunidade 
                              <Badge variant="secondary" className="ml-2 text-xs h-5 px-1.5 min-w-[1.25rem]">{comments.length}</Badge>
                           </div>
                           <ChevronLeft className={cn("w-4 h-4 transition-transform duration-200", isCommentsOpen ? "-rotate-90" : "rotate-0")} />
                         </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-4 bg-muted/5 space-y-6">
                           {/* Add Comment Form */}
                           <Form {...form}><form onSubmit={form.handleSubmit(onCommentSubmit)} className="flex gap-3 items-start p-3 bg-background rounded-lg border shadow-sm focus-within:ring-1 focus-within:ring-blue-500"><Avatar className="w-8 h-8 mt-1"><AvatarImage src={profile?.avatar_url} /><AvatarFallback>EU</AvatarFallback></Avatar><div className="flex-1 space-y-2"><FormField control={form.control} name="content" render={({ field }) => (<FormItem className="space-y-0"><FormControl><Textarea placeholder="Adicione uma dica ou comentário..." className="min-h-[60px] resize-none border-none shadow-none focus-visible:ring-0 p-0 text-sm" {...field} /></FormControl><FormMessage /></FormItem>)} /><div className="flex justify-between items-center pt-2 border-t border-dashed"><Popover><PopoverTrigger asChild><Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600"><Smile className="h-4 w-4" /></Button></PopoverTrigger><PopoverContent className="p-0 w-full"><EmojiPicker onEmojiClick={(emojiObject) => {form.setValue('content', form.getValues('content') + emojiObject.emoji);}} height={300} width="100%" /></PopoverContent></Popover><Button type="submit" size="sm" disabled={isSubmittingComment} className="h-7 text-xs px-4 bg-blue-600 hover:bg-blue-700 text-white">{isSubmittingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : "Publicar"}</Button></div></div></form></Form>

                           <Separator />

                           {isCommentsLoading ? <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> :
                             comments.length === 0 ? <div className="text-center py-6 text-muted-foreground text-sm italic">Seja o primeiro a comentar nesta questão!</div> :
                               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                 {comments.map(comment => (
                                   <div key={comment.id} className="flex gap-3 group">
                                     <Link to={`/user/${comment.profiles?.id}`} className="flex-shrink-0 mt-1">
                                       <Avatar className="h-8 w-8 border shadow-sm ring-2 ring-transparent group-hover:ring-blue-200 transition-all">
                                          <AvatarImage src={comment.profiles?.avatar_url} className="object-cover" />
                                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">{`${comment.profiles?.first_name?.[0] || ''}${comment.profiles?.last_name?.[0] || ''}`}</AvatarFallback>
                                       </Avatar>
                                     </Link>
                                     <div className="flex-1 space-y-1">
                                       <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                             <Link to={`/user/${comment.profiles?.id}`} className="font-semibold text-sm hover:underline hover:text-blue-600">
                                                {`${comment.profiles?.first_name} ${comment.profiles?.last_name}`}
                                             </Link>
                                             <span className="text-[10px] text-muted-foreground">• {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}</span>
                                          </div>
                                          {profile?.role === 'admin' && (
                                             <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setCommentToDelete(comment.id); setIsDeleteDialogOpen(true); }}>
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                             </Button>
                                          )}
                                       </div>
                                       <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-2.5 rounded-lg rounded-tl-none inline-block">
                                          {comment.content}
                                       </p>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                           }
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                 </div>
              )}
            </CardContent>

            <CardFooter className="bg-muted/10 p-4 border-t flex flex-col sm:flex-row gap-4 justify-between items-center sticky bottom-0 z-10 backdrop-blur-md">
               <div className="flex gap-2 w-full sm:w-auto">
                 {!isSingleQuestionMode && (
                   <Button 
                      variant="ghost" 
                      onClick={() => setCurrentPage(p => p - 1)} 
                      disabled={currentPage === 0 || isFetching || isRandomMode}
                      className="text-muted-foreground hover:text-foreground"
                   >
                     <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                   </Button>
                 )}
                 {isSingleQuestionMode && (
                     <Button variant="ghost" asChild>
                        <Link to="/questions"><ChevronLeft className="h-4 w-4 mr-2" />Voltar para o Banco</Link>
                     </Button>
                 )}
               </div>
               
               <div className="w-full sm:w-auto flex justify-end">
                 {!showExplanation ? (
                   <Button 
                     onClick={handleAnswerSubmit} 
                     disabled={!selectedAnswer || isFetching} 
                     size="lg" 
                     className="w-full sm:w-auto shadow-md font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0"
                   >
                     {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                     Responder
                   </Button>
                 ) : !isSingleQuestionMode ? (
                   <Button 
                     onClick={handleNextQuestion} 
                     disabled={(currentPage >= totalPages - 1 && !isRandomMode) || isFetching}
                     size="lg"
                     className="w-full sm:w-auto font-bold animate-pulse-subtle bg-blue-600 hover:bg-blue-700 text-white"
                   >
                     {isRandomMode ? "Sortear Próxima" : "Próxima Questão"} <ChevronRight className="h-4 w-4 ml-2" />
                   </Button>
                 ) : (
                    <div className="w-20"></div> 
                 )}
               </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Questions;