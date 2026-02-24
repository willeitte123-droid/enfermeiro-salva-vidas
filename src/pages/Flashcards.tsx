import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Brain, CheckCircle2, RotateCw, PlayCircle, GraduationCap, Clock, ArrowRight, Layers, X, Trophy } from "lucide-react";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { cn } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

interface Flashcard {
  id: string;
  deck_category: string;
  front_content: string;
  back_content: string;
}

interface UserProgress {
  flashcard_id: string;
  next_review: string;
  interval_days: number;
  ease_factor: number;
}

const Flashcards = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const { addActivity } = useActivityTracker();

  const [activeDeck, setActiveDeck] = useState<string | null>(null);
  const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 });

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Flashcards', path: '/flashcards', icon: 'Brain' });
  }, [addActivity]);

  // Buscar todos os flashcards e o progresso do usuário
  const { data: allFlashcards = [], isLoading: isLoadingCards } = useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      const { data, error } = await supabase.from('flashcards').select('*');
      if (error) throw error;
      return data as Flashcard[];
    }
  });

  const { data: userProgress = [], isLoading: isLoadingProgress } = useQuery({
    queryKey: ['flashcardProgress', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('user_id', profile.id);
      if (error) throw error;
      return data as UserProgress[];
    },
    enabled: !!profile
  });

  // Agrupar decks e contar cartas disponíveis para revisão
  const decks = allFlashcards.reduce((acc, card) => {
    if (!acc[card.deck_category]) {
      acc[card.deck_category] = { total: 0, due: 0, cards: [] };
    }
    acc[card.deck_category].total++;
    acc[card.deck_category].cards.push(card);

    const progress = userProgress.find(p => p.flashcard_id === card.id);
    const isDue = !progress || new Date(progress.next_review) <= new Date();
    
    if (isDue) acc[card.deck_category].due++;
    
    return acc;
  }, {} as Record<string, { total: number; due: number; cards: Flashcard[] }>);

  // Iniciar sessão de estudo
  const startSession = (category: string) => {
    const deckCards = decks[category].cards;
    const dueCards = deckCards.filter(card => {
        const progress = userProgress.find(p => p.flashcard_id === card.id);
        return !progress || new Date(progress.next_review) <= new Date();
    });

    if (dueCards.length === 0) {
        toast.info("Você já revisou todos os cards deste baralho por hoje!");
        return;
    }

    setStudyQueue(dueCards);
    setActiveDeck(category);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionStats({ reviewed: 0, correct: 0 });
  };

  // Mutação para salvar progresso
  const updateProgressMutation = useMutation({
    mutationFn: async ({ cardId, quality }: { cardId: string, quality: number }) => {
      if (!profile) return;

      const currentProgress = userProgress.find(p => p.flashcard_id === cardId);
      
      // Algoritmo Simplificado de Repetição Espaçada
      // quality: 0 (Again), 1 (Hard), 2 (Good), 3 (Easy)
      
      let nextInterval = 1;
      let nextReview = new Date();

      if (quality === 0) { // Again
        nextInterval = 0; // Review today/tomorrow (reset)
      } else if (quality === 1) { // Hard
        nextInterval = 1;
      } else if (quality === 2) { // Good
        nextInterval = currentProgress ? Math.max(2, Math.ceil(currentProgress.interval_days * 1.5)) : 2;
      } else { // Easy
        nextInterval = currentProgress ? Math.max(4, Math.ceil(currentProgress.interval_days * 2.5)) : 4;
      }

      nextReview = addDays(new Date(), nextInterval);

      const { error } = await supabase
        .from('user_flashcard_progress')
        .upsert({
          user_id: profile.id,
          flashcard_id: cardId,
          next_review: nextReview.toISOString(),
          interval_days: nextInterval,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcardProgress'] });
    }
  });

  const handleRate = (quality: number) => {
    const currentCard = studyQueue[currentCardIndex];
    updateProgressMutation.mutate({ cardId: currentCard.id, quality });

    setSessionStats(prev => ({
        reviewed: prev.reviewed + 1,
        correct: quality > 1 ? prev.correct + 1 : prev.correct
    }));

    if (currentCardIndex < studyQueue.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 150); // Small delay for UX
    } else {
      // End of session
      toast.success("Sessão finalizada! Ótimo trabalho.");
      setActiveDeck(null);
    }
  };

  if (isLoadingCards || isLoadingProgress) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  // --- MODO ESTUDO ---
  if (activeDeck && studyQueue.length > 0) {
    const currentCard = studyQueue[currentCardIndex];
    const progress = ((currentCardIndex) / studyQueue.length) * 100;

    return (
      <div className="flex flex-col items-center max-w-5xl mx-auto min-h-[90vh] py-4 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Bar Navigation */}
        <div className="w-full flex items-center justify-between mb-8 px-4 sm:px-0">
          <Button variant="ghost" onClick={() => setActiveDeck(null)} className="text-muted-foreground hover:text-foreground -ml-4">
            <X className="w-5 h-5 mr-2" /> Encerrar Sessão
          </Button>
          <div className="flex items-center gap-3 bg-muted/30 px-4 py-1.5 rounded-full border">
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progresso</span>
             <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
             </div>
             <span className="text-xs font-mono font-medium text-foreground">{currentCardIndex + 1}/{studyQueue.length}</span>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col justify-center max-w-3xl">
            <FlashcardItem 
            front={currentCard.front_content}
            back={currentCard.back_content}
            category={currentCard.deck_category}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            />
        </div>

        <div className="mt-8 w-full max-w-3xl px-4 sm:px-0">
          {!isFlipped ? (
            <Button size="lg" className="w-full h-16 text-lg font-bold shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-all rounded-2xl" onClick={() => setIsFlipped(true)}>
              Mostrar Resposta
            </Button>
          ) : (
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              <div className="flex flex-col gap-1 group">
                <Button variant="outline" className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 dark:border-red-900/50 dark:hover:bg-red-900/20 h-14 rounded-xl shadow-sm transition-all group-hover:-translate-y-1" onClick={() => handleRate(0)}>
                   <span className="font-bold">Errei</span>
                </Button>
                <span className="text-[10px] text-center text-muted-foreground font-medium opacity-70 group-hover:opacity-100">< 1 min</span>
              </div>
              <div className="flex flex-col gap-1 group">
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50 hover:text-orange-700 text-orange-600 dark:border-orange-900/50 dark:hover:bg-orange-900/20 h-14 rounded-xl shadow-sm transition-all group-hover:-translate-y-1" onClick={() => handleRate(1)}>
                   <span className="font-bold">Difícil</span>
                </Button>
                <span className="text-[10px] text-center text-muted-foreground font-medium opacity-70 group-hover:opacity-100">1 dia</span>
              </div>
              <div className="flex flex-col gap-1 group">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-blue-600 dark:border-blue-900/50 dark:hover:bg-blue-900/20 h-14 rounded-xl shadow-sm transition-all group-hover:-translate-y-1" onClick={() => handleRate(2)}>
                   <span className="font-bold">Bom</span>
                </Button>
                <span className="text-[10px] text-center text-muted-foreground font-medium opacity-70 group-hover:opacity-100">2 dias</span>
              </div>
              <div className="flex flex-col gap-1 group">
                <Button variant="outline" className="border-green-200 hover:bg-green-50 hover:text-green-700 text-green-600 dark:border-green-900/50 dark:hover:bg-green-900/20 h-14 rounded-xl shadow-sm transition-all group-hover:-translate-y-1" onClick={() => handleRate(3)}>
                   <span className="font-bold">Fácil</span>
                </Button>
                <span className="text-[10px] text-center text-muted-foreground font-medium opacity-70 group-hover:opacity-100">4 dias</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center h-6">
          {!isFlipped && (
            <p className="text-xs sm:text-sm font-medium text-muted-foreground/80 animate-fade-in flex items-center justify-center gap-2">
              <Brain className="w-3.5 h-3.5" />
              Tente relembrar antes de virar a carta
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- DASHBOARD (Lobby) ---
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* Immersive Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 sm:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-indigo-200">
              <RotateCw className="h-3 w-3" /> Repetição Espaçada
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Flashcards <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">Inteligentes</span>
            </h1>
            <p className="text-indigo-100/80 text-sm sm:text-lg leading-relaxed">
              O algoritmo seleciona o que você está prestes a esquecer. Estude menos, memorize mais.
            </p>
          </div>
          
          <div className="hidden md:block">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm rotate-6 hover:rotate-0 transition-transform duration-500">
               <Layers className="w-16 h-16 text-white/20" />
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        
        {profile && (
            <div className="absolute top-4 right-4 z-20">
                <FavoriteButton 
                    userId={profile.id} 
                    itemId="/flashcards" 
                    itemType="Estudo" 
                    itemTitle="Flashcards"
                    className="text-white hover:text-yellow-300"
                />
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(decks).map(([category, data]) => {
            const hasDueCards = data.due > 0;
            return (
                <div 
                    key={category} 
                    className={cn(
                        "group relative rounded-2xl border transition-all duration-300 overflow-hidden bg-card hover:-translate-y-1",
                        hasDueCards 
                            ? "hover:shadow-xl hover:shadow-primary/10 border-t-4 border-t-primary" 
                            : "hover:shadow-md border-t-4 border-t-green-500 opacity-80 hover:opacity-100"
                    )}
                >
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn(
                                "p-3 rounded-xl transition-colors",
                                hasDueCards ? "bg-primary/10 text-primary" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            )}>
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            {hasDueCards ? (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 border-0">
                                    <Clock className="w-3 h-3 mr-1" /> {data.due} para revisar
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 border-0">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Em dia
                                </Badge>
                            )}
                        </div>

                        <div className="mb-6 flex-1">
                            <h3 className="font-bold text-lg mb-1 line-clamp-1" title={category}>{category}</h3>
                            <p className="text-sm text-muted-foreground">{data.total} cartas no baralho</p>
                        </div>

                        <div className="mt-auto">
                            {hasDueCards ? (
                                <Button className="w-full font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all" onClick={() => startSession(category)}>
                                    <PlayCircle className="mr-2 h-4 w-4" /> Revisar Agora
                                </Button>
                            ) : (
                                <Button variant="outline" className="w-full text-muted-foreground" disabled>
                                    Volte amanhã
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )
        })}
      </div>

      {allFlashcards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed text-center">
           <div className="p-4 bg-muted rounded-full mb-4 opacity-50">
              <Brain className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-bold text-foreground">Sua coleção está vazia</h3>
           <p className="text-muted-foreground mt-2 max-w-md">Parece que ainda não há flashcards disponíveis ou carregados no sistema.</p>
        </div>
      )}
    </div>
  );
};

export default Flashcards;