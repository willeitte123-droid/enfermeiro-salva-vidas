import { useState, useMemo, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar, Clock, Plus, Trash2, CheckCircle2, Play, Pause, RotateCcw,
  BookOpen, FileQuestion, BrainCircuit, Sparkles, RefreshCw, Trophy,
  ArrowRight, Flame, Layers, Check, Zap, Target, Edit2, X,
  CalendarDays, RotateCw, Loader2, AlignLeft
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
  first_name?: string;
}

interface StudyBlock {
  id: string;
  user_id: string;
  category_name: string;
  duration_minutes: number;
  color: string;
  order_index: number;
  day_of_week: number | null;
  is_completed: boolean;
}

interface WeeklyEvent {
  id: string;
  user_id: string;
  day_of_week: number;
  content: string;
  start_time?: string;
  category_name?: string;
  color?: string;
}

const CATEGORIES = [
  "Legislação do SUS",
  "Urgência e Emergência",
  "Fundamentos de Enfermagem",
  "Saúde Pública e Imunização",
  "Saúde da Mulher",
  "Saúde da Criança",
  "Saúde do Adulto",
  "Saúde Mental",
  "Administração em Enfermagem",
  "Biossegurança e Controle de Infecção",
  "Centro Cirúrgico e CME",
  "Ética e Legislação Profissional",
  "Farmacologia e Cálculos",
  "Terapia Intensiva (UTI)",
  "Língua Portuguesa",
  "Raciocínio Lógico / Matemática",
  "Outra Matéria"
];

const COLOR_OPTIONS = [
  { name: "Azul", value: "blue", bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", cardBg: "bg-blue-50 dark:bg-blue-950/20" },
  { name: "Verde", value: "emerald", bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500", cardBg: "bg-emerald-50 dark:bg-emerald-950/20" },
  { name: "Roxo", value: "purple", bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500", cardBg: "bg-purple-50 dark:bg-purple-950/20" },
  { name: "Laranja", value: "orange", bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500", cardBg: "bg-orange-50 dark:bg-orange-950/20" },
  { name: "Rosa", value: "rose", bg: "bg-rose-500", text: "text-rose-500", border: "border-rose-500", cardBg: "bg-rose-50 dark:bg-rose-950/20" },
  { name: "Ciano", value: "cyan", bg: "bg-cyan-500", text: "text-cyan-500", border: "border-cyan-500", cardBg: "bg-cyan-50 dark:bg-cyan-950/20" },
];

const DAYS_OF_WEEK = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function Planner() {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Ferramenta', title: 'Meu Cronograma', path: '/planner', icon: 'Calendar' });
  }, [addActivity]);

  const [activeTab, setActiveTab] = useState("cycle");
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);

  // Estados Formulário de Bloco (Ciclo)
  const [blockCategory, setBlockCategory] = useState("Legislação do SUS");
  const [blockDuration, setBlockDuration] = useState("60");
  const [blockColor, setBlockColor] = useState("blue");

  // MODAL SEMANAL
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [editingWeeklyEvent, setEditingWeeklyEvent] = useState<WeeklyEvent | null>(null);
  const [weeklyDay, setWeeklyDay] = useState<number>(0);
  const [weeklyTime, setWeeklyTime] = useState("08:00");
  const [weeklyCategory, setWeeklyCategory] = useState("Legislação do SUS");
  const [weeklyColor, setWeeklyColor] = useState("blue");
  const [weeklyContent, setWeeklyContent] = useState("");

  // Timer Pomodoro / Sessão de Estudo
  const [activePomodoroBlock, setActivePomodoroBlock] = useState<{category_name: string; duration_minutes: number} | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");

  // Fetch Nível e XP (Simulação visual de progresso diário)
  const { data: dailyProgress = {} } = useQuery({
    queryKey: ['dailyProgress', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from('user_question_answers')
        .select('question_id, questions!inner(category)')
        .eq('user_id', profile.id)
        .gte('created_at', today.toISOString());
      
      const counts: Record<string, number> = {};
      data?.forEach((row: any) => {
        const cat = Array.isArray(row.questions) ? row.questions[0]?.category : row.questions?.category;
        if (cat) counts[cat] = (counts[cat] || 0) + 1;
      });
      return counts;
    },
    enabled: !!profile?.id,
  });

  // 1. Fetch Blocos do Ciclo
  const { data: cycleBlocks = [], isLoading: isLoadingBlocks } = useQuery<StudyBlock[]>({
    queryKey: ['userStudyBlocks', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('user_study_blocks')
        .select('*')
        .eq('user_id', profile.id)
        .is('day_of_week', null)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as StudyBlock[];
    },
    enabled: !!profile?.id,
  });

  // 2. Fetch Eventos Semanais
  const { data: weeklyEvents = [] } = useQuery<WeeklyEvent[]>({
    queryKey: ['userWeeklyEvents', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('user_weekly_events')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: true });
      if (error && error.code !== '42P01') throw error; // Ignora erro se tabela não existir
      return data as WeeklyEvent[] || [];
    },
    enabled: !!profile?.id,
  });

  // MUTAÇÕES DO CICLO
  const addCycleBlockMutation = useMutation({
    mutationFn: async () => {
      if (!profile?.id) return;
      const orderIndex = cycleBlocks.length;
      const { error } = await supabase.from('user_study_blocks').insert({
        user_id: profile.id,
        category_name: blockCategory,
        duration_minutes: parseInt(blockDuration) || 60,
        color: blockColor,
        order_index: orderIndex,
        day_of_week: null,
        is_completed: false
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Matéria adicionada ao ciclo!");
      queryClient.invalidateQueries({ queryKey: ['userStudyBlocks', profile?.id] });
      setIsAddBlockOpen(false);
    }
  });

  const toggleBlockMutation = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      const { error } = await supabase.from('user_study_blocks').update({ is_completed }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userStudyBlocks', profile?.id] })
  });

  const deleteBlockMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_study_blocks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bloco removido!");
      queryClient.invalidateQueries({ queryKey: ['userStudyBlocks', profile?.id] });
    }
  });

  const resetCycleMutation = useMutation({
    mutationFn: async () => {
      if (!profile?.id) return;
      const { error } = await supabase
        .from('user_study_blocks')
        .update({ is_completed: false })
        .eq('user_id', profile.id)
        .is('day_of_week', null);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ciclo renovado! Você pode recomeçar a roda de estudos.");
      queryClient.invalidateQueries({ queryKey: ['userStudyBlocks', profile?.id] });
    }
  });

  // MUTAÇÕES DA GRADE SEMANAL
  const addWeeklyEventMutation = useMutation({
    mutationFn: async (data: Omit<WeeklyEvent, 'id' | 'user_id'>) => {
      if (!profile?.id) return;
      const { error } = await supabase.from('user_weekly_events').insert({
        user_id: profile.id,
        ...data
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agendamento salvo!");
      queryClient.invalidateQueries({ queryKey: ['userWeeklyEvents', profile?.id] });
      setIsWeeklyModalOpen(false);
    }
  });

  const updateWeeklyEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WeeklyEvent> }) => {
      const { error } = await supabase.from('user_weekly_events').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agendamento atualizado!");
      queryClient.invalidateQueries({ queryKey: ['userWeeklyEvents', profile?.id] });
      setIsWeeklyModalOpen(false);
    }
  });

  const deleteWeeklyEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_weekly_events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userWeeklyEvents', profile?.id] })
  });

  const saveSessionMutation = useMutation({
    mutationFn: async ({ category, seconds }: { category: string; seconds: number }) => {
      if (!profile?.id || seconds <= 0) return;
      await supabase.rpc('increment_user_activity', { seconds_to_add: seconds });
    }
  });

  // Handlers Semanais
  const openWeeklyModal = (dayIndex: number, event?: WeeklyEvent) => {
    if (event) {
      setEditingWeeklyEvent(event);
      setWeeklyDay(event.day_of_week);
      setWeeklyTime(event.start_time || "08:00");
      setWeeklyCategory(event.category_name || "Outra Matéria");
      setWeeklyColor(event.color || "blue");
      setWeeklyContent(event.content || "");
    } else {
      setEditingWeeklyEvent(null);
      setWeeklyDay(dayIndex);
      setWeeklyTime("08:00");
      setWeeklyCategory("Legislação do SUS");
      setWeeklyColor("blue");
      setWeeklyContent("");
    }
    setIsWeeklyModalOpen(true);
  };

  const handleSaveWeeklyEvent = () => {
    const payload = {
      day_of_week: weeklyDay,
      start_time: weeklyTime,
      category_name: weeklyCategory,
      color: weeklyColor,
      content: weeklyContent
    };

    if (editingWeeklyEvent) {
      updateWeeklyEventMutation.mutate({ id: editingWeeklyEvent.id, data: payload });
    } else {
      addWeeklyEventMutation.mutate(payload);
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (pomodoroMode === "focus") {
        toast.success("Sessão de Foco Concluída!", { description: "Hora de uma pausa rápida de 5 minutos." });
        if (activePomodoroBlock) {
          saveSessionMutation.mutate({ category: activePomodoroBlock.category_name, seconds: activePomodoroBlock.duration_minutes * 60 });
        }
        setPomodoroMode("break");
        setTimerSeconds(5 * 60);
      } else {
        toast.info("Pausa terminada!", { description: "Pronto para o próximo bloco de estudos?" });
        setPomodoroMode("focus");
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, pomodoroMode, activePomodoroBlock]);

  const completedCycleCount = useMemo(() => cycleBlocks.filter(b => b.is_completed).length, [cycleBlocks]);
  const cycleProgress = cycleBlocks.length > 0 ? Math.round((completedCycleCount / cycleBlocks.length) * 100) : 0;
  const totalCycleMinutes = useMemo(() => cycleBlocks.reduce((acc, b) => acc + b.duration_minutes, 0), [cycleBlocks]);

  const handleStartBlockStudy = (category: string, duration_minutes: number) => {
    setActivePomodoroBlock({ category_name: category, duration_minutes });
    setPomodoroMode("focus");
    setTimerSeconds(Math.min(duration_minutes * 60, 25 * 60)); // 25m Pomodoro ou tempo total
    setIsTimerRunning(true);
    setActiveTab("timer");
    toast.info(`Iniciando foco: ${category}`);
  };

  const getColorConfig = (colorVal: string) => {
    return COLOR_OPTIONS.find(c => c.value === colorVal) || COLOR_OPTIONS[0];
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER PRINCIPAL */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold uppercase tracking-wider text-blue-300">
              <Sparkles className="h-3 w-3" /> Produtividade Diária
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Meu Cronograma & Ciclos</h1>
            <p className="text-blue-100/80 max-w-xl text-xs sm:text-base leading-relaxed">
              Monte seu ciclo dinâmico para não se atrasar, e use a agenda livre da semana para compromissos rápidos.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              onClick={() => setIsAddBlockOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Matéria (Ciclo)
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        {profile && (
          <div className="absolute top-4 right-4 z-20 hidden sm:block">
            <FavoriteButton
              userId={profile.id}
              itemId="/planner"
              itemType="Ferramenta"
              itemTitle="Meu Cronograma"
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-xl grid-cols-3 h-10 sm:h-12 bg-muted/50 p-1 rounded-full">
            <TabsTrigger value="cycle" className="rounded-full text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all px-1">
              <RotateCw className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Ciclo Ativo
            </TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-full text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all px-1">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Agenda Semanal
            </TabsTrigger>
            <TabsTrigger value="timer" className="rounded-full text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all relative px-1">
              <Clock className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Foco (Timer)
              {isTimerRunning && <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- TAB 1: CICLO DE ESTUDOS --- */}
        <TabsContent value="cycle" className="space-y-6 animate-in fade-in duration-300">
          <Card className="border-t-4 border-t-primary shadow-sm bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" /> Progresso da Roda de Estudos
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {completedCycleCount} de {cycleBlocks.length} blocos concluídos ({totalCycleMinutes} min no total)
                  </CardDescription>
                </div>

                {cycleBlocks.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => resetCycleMutation.mutate()}
                    disabled={resetCycleMutation.isPending}
                    className="text-xs font-semibold hover:bg-primary/10 hover:text-primary"
                  >
                    <RotateCw className={cn("mr-1.5 h-3.5 w-3.5", resetCycleMutation.isPending && "animate-spin")} />
                    Reiniciar Roda
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={cycleProgress} className="h-3 bg-muted" />
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>0%</span>
                <span className="text-primary font-extrabold">{cycleProgress}% Concluído</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>

          {cycleBlocks.length === 0 ? (
            <Card className="border-dashed border-2 py-12 text-center bg-muted/20">
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-full w-fit mx-auto"><Layers className="h-8 w-8 text-muted-foreground opacity-50" /></div>
                <div>
                  <h3 className="text-lg font-bold">Nenhuma matéria no ciclo</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                    Adicione disciplinas para criar sua roda de estudos. O modelo de ciclo garante que você avance sem se atrasar se perder um dia.
                  </p>
                </div>
                <Button onClick={() => setIsAddBlockOpen(true)} className="bg-primary">
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Primeira Matéria
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cycleBlocks.map((block, idx) => {
                const colorCfg = getColorConfig(block.color);
                return (
                  <Card 
                    key={block.id} 
                    className={cn(
                      "group relative transition-all duration-300 border-2 overflow-hidden flex flex-col justify-between",
                      block.is_completed ? "bg-muted/40 border-slate-300 opacity-75" : colorCfg.cardBg,
                      colorCfg.border
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", colorCfg.text, "border-current")}>
                          Bloco {idx + 1}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteBlockMutation.mutate(block.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <CardTitle className={cn("text-lg font-bold leading-tight mt-1", block.is_completed && "line-through text-muted-foreground")}>
                        {block.category_name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pb-3 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>Tempo estimado: <strong>{block.duration_minutes} min</strong></span>
                      </div>
                      <div className="pt-2 border-t border-border/40 grid grid-cols-3 gap-1">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold gap-1 px-1 hover:bg-primary/10 hover:text-primary" onClick={() => navigate(`/questions?category=${encodeURIComponent(block.category_name)}`)}>
                          <FileQuestion className="h-3 w-3 text-blue-500" /> Questões
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold gap-1 px-1 hover:bg-primary/10 hover:text-primary" onClick={() => navigate('/flashcards')}>
                          <BrainCircuit className="h-3 w-3 text-purple-500" /> Revisar
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold gap-1 px-1 hover:bg-primary/10 hover:text-primary" onClick={() => navigate('/concurseiro')}>
                          <BookOpen className="h-3 w-3 text-emerald-500" /> PDFs
                        </Button>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 flex gap-2">
                      <Button
                        variant={block.is_completed ? "outline" : "default"}
                        size="sm"
                        className={cn("flex-1 text-xs font-bold", !block.is_completed && "bg-primary text-primary-foreground")}
                        onClick={() => handleStartBlockStudy(block.category_name, block.duration_minutes)}
                      >
                        <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                        {block.is_completed ? "Reestudar" : "Foco"}
                      </Button>
                      <Button
                        variant={block.is_completed ? "default" : "outline"}
                        size="sm"
                        className={cn("text-xs font-bold shrink-0", block.is_completed && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                        onClick={() => toggleBlockMutation.mutate({ id: block.id, is_completed: !block.is_completed })}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* --- TAB 2: AGENDA SEMANAL LIVRE --- */}
        <TabsContent value="weekly" className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Agenda da Semana
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">Clique em um item para editar. Use "Enter" para adicionar novos.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((dayName, dayIndex) => {
              const dayEvents = weeklyEvents.filter(e => e.day_of_week === dayIndex);

              return (
                <Card key={dayName} className="bg-card/30 flex flex-col min-h-[300px] border-border/60 shadow-sm overflow-hidden">
                  <CardHeader className="p-3 border-b bg-muted/40 text-center">
                    <CardTitle className="text-sm font-bold text-foreground">{dayName}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 flex-1 flex flex-col gap-2 bg-gradient-to-b from-background to-muted/20">
                    {dayEvents.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-center p-2 text-muted-foreground text-xs italic">
                        Livre
                      </div>
                    ) : (
                      dayEvents.map(event => {
                        const colorCfg = getColorConfig(event.color || 'blue');
                        return (
                          <div
                            key={event.id}
                            onClick={() => openWeeklyModal(dayIndex, event)}
                            className={cn(
                              "p-2.5 rounded-lg border flex flex-col gap-1.5 relative group cursor-pointer transition-transform hover:scale-[1.02] shadow-sm",
                              colorCfg.cardBg, colorCfg.border
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div className={cn("flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase opacity-80", colorCfg.text)}>
                                <Clock className="w-3 h-3" /> {event.start_time || "00:00"}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1.5 right-1.5 h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive p-0 hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation(); // Evita abrir o modal de edição ao clicar em apagar
                                  deleteWeeklyEventMutation.mutate(event.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <span className="font-bold text-sm leading-tight text-foreground">{event.category_name}</span>
                            
                            {event.content && (
                              <div className="flex items-start gap-1.5 mt-1 opacity-70">
                                <AlignLeft className="w-3 h-3 shrink-0 mt-0.5" />
                                <span className="text-[10px] line-clamp-2 italic">{event.content}</span>
                              </div>
                            )}

                            {/* Botão rápido para ir para o timer com essa matéria */}
                            <div className="mt-2 pt-2 border-t border-current/10 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full h-6 text-[10px] hover:bg-background/50"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartBlockStudy(event.category_name, 60);
                                  }}
                               >
                                  <Play className="w-3 h-3 mr-1" /> Estudar Agora
                               </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                  <CardFooter className="p-2 border-t bg-muted/10 relative z-50">
                     <div
                       className="w-full h-8 text-xs border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/50 bg-background rounded-md flex items-center justify-center transition-colors cursor-pointer select-none"
                       onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         openWeeklyModal(dayIndex);
                       }}
                     >
                       <Plus className="w-3.5 h-3.5 mr-1 pointer-events-none" /> <span className="pointer-events-none">Agendar</span>
                     </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* --- TAB 3: TIMER POMODORO --- */}
        <TabsContent value="timer" className="space-y-6 animate-in fade-in duration-300">
          <Card className="max-w-2xl mx-auto border-2 shadow-xl bg-card/90">
            <CardHeader className="text-center pb-2">
              <Badge variant="outline" className="w-fit mx-auto mb-2 text-xs uppercase tracking-wider font-bold">
                {pomodoroMode === "focus" ? "🔥 Modo Foco Total" : "☕ Pausa Agradável"}
              </Badge>
              <CardTitle className="text-2xl font-bold">
                {activePomodoroBlock ? activePomodoroBlock.category_name : "Sessão Livre"}
              </CardTitle>
              <CardDescription>
                {pomodoroMode === "focus" ? "Concentre-se totalmente nesta matéria até o timer finalizar." : "Aproveite para relaxar, beber água e esticar as pernas."}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
              <div className="relative flex items-center justify-center w-64 h-64 rounded-full border-8 border-primary/20 bg-muted/20 shadow-inner">
                <div className="text-center space-y-1">
                  <span className="text-6xl font-black font-mono tracking-tighter text-primary">
                    {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
                    {(timerSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold block">
                    {pomodoroMode === "focus" ? "Minutos de Foco" : "Pausa"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-xs">
                <Button 
                  size="lg" 
                  onClick={() => setIsTimerRunning(!isTimerRunning)} 
                  className={cn("flex-1 font-bold h-12 text-base shadow-lg", isTimerRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-primary")}
                >
                  {isTimerRunning ? <><Pause className="mr-2 h-5 w-5" /> Pausar</> : <><Play className="mr-2 h-5 w-5" /> Iniciar</>}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(pomodoroMode === "focus" ? (activePomodoroBlock ? activePomodoroBlock.duration_minutes * 60 : 25 * 60) : 5 * 60);
                  }}
                  className="h-12 w-12 p-0 shrink-0"
                  title="Reiniciar Timer"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {activePomodoroBlock && (
                <div className="w-full pt-4 border-t border-border/50 text-center space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Atalhos da Matéria</p>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/questions?category=${encodeURIComponent(activePomodoroBlock.category_name)}`)} className="text-xs gap-1.5">
                      <FileQuestion className="h-3.5 w-3.5 text-blue-500" /> Questões
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate('/concurseiro')} className="text-xs gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-500" /> PDFs
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG: ADICIONAR NOVO BLOCO AO CICLO */}
      <Dialog open={isAddBlockOpen} onOpenChange={setIsAddBlockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Adicionar ao Ciclo
            </DialogTitle>
            <DialogDescription>
              Escolha a disciplina e o tempo que deseja dedicar a este bloco no seu ciclo de estudos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Disciplina / Matéria</Label>
              <Select value={blockCategory} onValueChange={setBlockCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-[250px]">
                  {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duração Estimada (Minutos)</Label>
              <Select value={blockDuration} onValueChange={setBlockDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos (Rápido)</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">60 minutos (1 Hora)</SelectItem>
                  <SelectItem value="90">90 minutos (1h 30m)</SelectItem>
                  <SelectItem value="120">120 minutos (2 Horas)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cor de Destaque</Label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setBlockColor(c.value)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform",
                      c.bg,
                      blockColor === c.value ? "scale-110 ring-2 ring-offset-2 ring-primary" : "opacity-70 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBlockOpen(false)}>Cancelar</Button>
            <Button onClick={() => addCycleBlockMutation.mutate()} disabled={addCycleBlockMutation.isPending} className="bg-primary">
              {addCycleBlockMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Bloco"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}