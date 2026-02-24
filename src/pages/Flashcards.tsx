import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Brain, CheckCircle2, RotateCw, PlayCircle, GraduationCap, Clock } from "lucide-react";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { toast } from "sonner";
import { addDays } from "date-fns";

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

      // Usar upsert para criar ou atualizar
      const { error } = await supabase
        .from('user_flashcard_progress')
        .upsert({
          user_id: profile.id,
          flashcard_id: cardId,
          next_review: nextReview.toISOString(),
          interval_days: nextInterval,
          // ease_factor could be updated here for full SM-2
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
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  // MODO ESTUDO
  if (activeDeck && studyQueue.length > 0) {
    const currentCard = studyQueue[currentCardIndex];
    const progress = ((currentCardIndex) / studyQueue.length) * 100;

    return (
      <div className="flex flex-col items-center max-w-4xl mx-auto min-h-[80vh] py-6">
        <div className="w-full mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setActiveDeck(null)} className="text-muted-foreground">Encerrar Sessão</Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{currentCardIndex + 1} / {studyQueue.length}</span>
            <Progress value={progress} className="w-24 h-2" />
          </div>
        </div>

        <FlashcardItem 
          front={currentCard.front_content}
          back={currentCard.back_content}
          category={currentCard.deck_category}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />

        <div className="mt-8 w-full max-w-xl">
          {!isFlipped ? (
            <Button size="lg" className="w-full text-lg h-14" onClick={() => setIsFlipped(true)}>
              Ver Resposta
            </Button>
          ) : (
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              <div className="flex flex-col gap-1">
                <Button variant="outline" className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 h-12" onClick={() => handleRate(0)}>Errei</Button>
                <span className="text-[10px] text-center text-muted-foreground">&lt; 1 min</span>
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50 hover:text-orange-700 text-orange-600 h-12" onClick={() => handleRate(1)}>Difícil</Button>
                <span className="text-[10px] text-center text-muted-foreground">1 dia</span>
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-blue-600 h-12" onClick={() => handleRate(2)}>Bom</Button>
                <span className="text-[10px] text-center text-muted-foreground">2 dias</span>
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="outline" className="border-green-200 hover:bg-green-50 hover:text-green-700 text-green-600 h-12" onClick={() => handleRate(3)}>Fácil</Button>
                <span className="text-[10px] text-center text-muted-foreground">4 dias</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          {isFlipped ? (
            <p className="text-sm text-muted-foreground italic">
              Avalie sua resposta honestamente para agendar a próxima revisão.
            </p>
          ) : (
            <p className="text-sm font-semibold text-primary/80 animate-pulse bg-primary/5 px-4 py-2 rounded-full inline-flex items-center">
              <Brain className="w-3.5 h-3.5 mr-2" />
              Tente lembrar a resposta antes de virar.
            </p>
          )}
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Flashcards</h1>
        <p className="text-muted-foreground">Repetição espaçada para memorizar o que realmente cai na prova.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(decks).map(([category, data]) => (
          <Card key={category} className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary cursor-pointer relative overflow-hidden" onClick={() => startSession(category)}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <Brain size={80} />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <GraduationCap className="h-5 w-5 text-primary" />
                {category}
              </CardTitle>
              <CardDescription>{data.total} cartas no total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{data.due} para revisar</span>
                </div>
                {data.due === 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Em dia</Badge>
                )}
              </div>
              
              <Button className="w-full group-hover:translate-x-1 transition-transform" disabled={data.due === 0} variant={data.due > 0 ? "default" : "outline"}>
                {data.due > 0 ? (
                  <>Começar Revisão <PlayCircle className="ml-2 h-4 w-4" /></>
                ) : (
                  "Volte amanhã"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {allFlashcards.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Nenhum flashcard disponível no momento.</p>
        </div>
      )}
    </div>
  );
};

export default Flashcards;