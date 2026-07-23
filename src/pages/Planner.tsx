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
  ArrowRight, Flame, Layers, Check, Zap, Target, PieChart, ShieldAlert,
  CalendarDays, RotateCw, Loader2
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
  day_of_week: number | null; // null = ciclo, 0-6 = seg-dom
  is_completed: boolean;
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
  const [targetType, setTargetType] = useState<"cycle" | "weekly">("cycle");
  const [selectedDay, setSelectedDay] = useState<number>(0);

  // Formulário de Bloco
  const [blockCategory, setBlockCategory] = useState("Legislação do SUS");
  const [blockDuration, setBlockDuration] = useState("60");
  const [blockColor, setBlockColor] = useState("blue");

  // Timer Pomodoro / Sessão de Estudo
  const [activePomodoroBlock, setActivePomodoroBlock] = useState<StudyBlock | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");

  // Fetch Blocos do Usuário
  const { data: blocks = [], isLoading: isLoadingBlocks } = useQuery<StudyBlock[]>({
    queryKey: ['userStudyBlocks', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('user_study_blocks')
        .select('*')
        .eq('user_id', profile.id)
        .order('order_index', { ascending: true });

      if (error) {
        console.error("Erro ao buscar blocos:", error);
        return [];
      }
      return data as StudyBlock[];
    },
    enabled: !!profile?.id,
  });

  // Mutação: Adicionar Bloco
  const addBlockMutation = useMutation({
    mutationFn: async () => {
      if (!profile?.id) return;
      const orderIndex = blocks.length;
      const { error } = await supabase.from('user_study_blocks').insert({
        user_id: profile.id,
        category_name: blockCategory,
        duration_minutes: parseInt(blockDuration) || 60,
        color: blockColor,
        order_index: orderIndex,
        day_of_week: targetType === 'weekly' ? selectedDay : null,
        is_completed: false
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Matéria adicionada ao cronograma!");
      queryClient.invalidateQueries({ queryKey: ['userStudyBlocks', profile?.id] });
      setIsAddBlockOpen(false);
    },
    onError: (err: any) => toast.error("Erro ao adicionar: " + err.message)
  });

  // Mutação: Toggle Concluído
  const toggleBlockMutation = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      const { error } = await supabase.from('user_study_blocks').update({ is_completed }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStudyBlocks', profile?.id] });
    }
  });

  // Mutação: Deletar Bloco
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

  // Mutação: Resetar Todo o Ciclo (Reiniciar Roda)
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

  // Mutação: Salvar Sessão de Estudo no Banco
  const saveSessionMutation = useMutation({
    mutationFn: async ({ category, seconds }: { category: string; seconds: number }) => {
      if (!profile?.id || seconds <= 0) return;
      const { error } = await supabase.from('user_study_sessions').insert({
        user_id: profile.id,
        category_name: category,
        duration_seconds: seconds
      });
      if (error) console.error("Erro ao salvar sessão:", error);
      
      // Atualiza também a tabela de tempo diário global da plataforma
      await supabase.rpc('increment_user_activity', { seconds_to_add: seconds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyStudyTime', profile?.id] });
      queryClient.invalidateQueries({ queryKey: ['userStudySessions', profile?.id] });
    }
  });

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

  // Filtros de Blocos
  const cycleBlocks = useMemo(() => blocks.filter(b => b.day_of_week === null), [blocks]);
  
  const completedCycleCount = useMemo(() => cycleBlocks.filter(b => b.is_completed).length, [cycleBlocks]);
  const cycleProgress = cycleBlocks.length > 0 ? Math.round((completedCycleCount / cycleBlocks.length) * 100) : 0;

  const totalCycleMinutes = useMemo(() => cycleBlocks.reduce((acc, b) => acc + b.duration_minutes, 0), [cycleBlocks]);

  const handleStartBlockStudy = (block: StudyBlock) => {
    setActivePomodoroBlock(block);
    setPomodoroMode("focus");
    setTimerSeconds(Math.min(block.duration_minutes * 60, 25 * 60)); // 25m Pomodoro ou tempo total
    setIsTimerRunning(true);
    setActiveTab("timer");
    toast.info(`Iniciando foco: ${block.category_name}`);
  };

  const getColorConfig = (colorVal: string) => {
    return COLOR_OPTIONS.find(c => c.value === colorVal) || COLOR_OPTIONS[0];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER PRINCIPAL */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold uppercase tracking-wider text-blue-300">
              <Sparkles className="h-3 w-3" /> Metodologia Ativa de Estudo
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Meu Cronograma & Ciclos</h1>
            <p className="text-blue-100/80 max-w-xl text-xs sm:text-base leading-relaxed">
              Monte seu ciclo dinâmico ou grade semanal. Estude sem culpa de atrasos e integre diretamente com o acervo da plataforma.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              onClick={() => { setTargetType('cycle'); setIsAddBlockOpen(true); }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Matéria
            </Button>
          </div>
        </div>

        {/* Background FX */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
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

      {/* TABS PRINCIPAIS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-xl grid-cols-3 h-10 sm:h-12 bg-muted/50 p-1 rounded-full">
            <TabsTrigger value="cycle" className="rounded-full text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all px-1">
              <RotateCw className="mr-2 h-4 w-4" /> Ciclo Ativo
            </TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-full text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all px-1">
              <CalendarDays className="mr-2 h-4 w-4" /> Semanal
            </TabsTrigger>
            <TabsTrigger value="timer" className="rounded-full text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all relative">
              <Clock className="mr-2 h-4 w-4" /> Foco (Pomodoro)
              {isTimerRunning && <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- TAB 1: CICLO DE ESTUDOS --- */}
        <TabsContent value="cycle" className="space-y-6 animate-in fade-in duration-300">
          
          {/* Card de Progresso do Ciclo */}
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

          {/* Lista de Blocos do Ciclo */}
          {cycleBlocks.length === 0 ? (
            <Card className="border-dashed border-2 py-12 text-center bg-muted/20">
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                  <Layers className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Nenhuma matéria no ciclo</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                    Adicione disciplinas para criar sua roda de estudos. O modelo de ciclo garante que você avance sem se atrasar se perder um dia.
                  </p>
                </div>
                <Button onClick={() => { setTargetType('cycle'); setIsAddBlockOpen(true); }} className="bg-primary">
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
                        <span>Tempo estimado: <strong>{block.duration_minutes} minutos</strong></span>
                      </div>

                      {/* Integrações Rápidas da Plataforma */}
                      <div className="pt-2 border-t border-border/40 grid grid-cols-3 gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold gap-1 px-1 hover:bg-primary/10 hover:text-primary"
                          title="Responder Questões desta Matéria"
                          onClick={() => navigate(`/questions?category=${encodeURIComponent(block.category_name)}`)}
                        >
                          <FileQuestion className="h-3 w-3 text-blue-500" /> Questões
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold gap-1 px-1 hover:bg-primary/10 hover:text-primary"
                          title="Revisar Flashcards"
                          onClick={() => navigate('/flashcards')}
                        >
                          <BrainCircuit className="h-3 w-3 text-purple-500" /> Flashcards
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold gap-1 px-1 hover:bg-primary/10 hover:text-primary"
                          title="Ler PDF"
                          onClick={() => navigate('/concurseiro')}
                        >
                          <BookOpen className="h-3 w-3 text-emerald-500" /> PDFs
                        </Button>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 flex gap-2">
                      <Button
                        variant={block.is_completed ? "outline" : "default"}
                        size="sm"
                        className={cn("flex-1 text-xs font-bold", !block.is_completed && "bg-primary text-primary-foreground")}
                        onClick={() => handleStartBlockStudy(block)}
                      >
                        <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                        {block.is_completed ? "Reestudar" : "Iniciar Foco"}
                      </Button>

                      <Button
                        variant={block.is_completed ? "default" : "outline"}
                        size="sm"
                        className={cn("text-xs font-bold shrink-0", block.is_completed && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                        onClick={() => toggleBlockMutation.mutate({ id: block.id, is_completed: !block.is_completed })}
                        title={block.is_completed ? "Marcar como pendente" : "Marcar como concluído"}
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

        {/* --- TAB 2: CRONOGRAMA SEMANAL --- */}
        <TabsContent value="weekly" className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Grade Semanal Fixa
            </h2>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => { setTargetType('weekly'); setIsAddBlockOpen(true); }}
              className="text-xs font-semibold"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Adicionar na Semana
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((dayName, dayIndex) => {
              const dayBlocks = blocks.filter(b => b.day_of_week === dayIndex);

              return (
                <Card key={dayName} className="bg-card/50 flex flex-col min-h-[220px]">
                  <CardHeader className="p-3 border-b bg-muted/30 text-center">
                    <CardTitle className="text-sm font-bold">{dayName}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 flex-1 flex flex-col gap-2">
                    {dayBlocks.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-center p-2 text-muted-foreground text-xs italic">
                        Livre / Descanso
                      </div>
                    ) : (
                      dayBlocks.map(block => {
                        const colorCfg = getColorConfig(block.color);
                        return (
                          <div 
                            key={block.id} 
                            className={cn(
                              "p-2 rounded-lg border text-xs flex flex-col gap-1 relative group",
                              colorCfg.cardBg, colorCfg.border
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold truncate text-foreground">{block.category_name}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 opacity-0 group-hover:opacity-100 text-destructive p-0"
                                onClick={() => deleteBlockMutation.mutate(block.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-semibold">{block.duration_minutes} min</span>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
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
                {activePomodoroBlock ? activePomodoroBlock.category_name : "Sessão de Estudos Geral"}
              </CardTitle>
              <CardDescription>
                {pomodoroMode === "focus" ? "Concentre-se totalmente nesta matéria até o timer finalizar." : "Aproveite para relaxar, beber água e esticar as pernas."}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
              
              {/* DISPLAY DO TIMER */}
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

              {/* CONTROLES */}
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
                    setTimerSeconds(pomodoroMode === "focus" ? 25 * 60 : 5 * 60);
                  }}
                  className="h-12 w-12 p-0 shrink-0"
                  title="Reiniciar Timer"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {/* ATALHOS RÁPIDOS DA MATÉRIA ATIVA */}
              {activePomodoroBlock && (
                <div className="w-full pt-4 border-t border-border/50 text-center space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Atalhos da Matéria</p>
                  <div className="flex justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/questions?category=${encodeURIComponent(activePomodoroBlock.category_name)}`)}
                      className="text-xs gap-1.5"
                    >
                      <FileQuestion className="h-3.5 w-3.5 text-blue-500" /> Responder Questões
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate('/concurseiro')}
                      className="text-xs gap-1.5"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-emerald-500" /> Abrir PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG: ADICIONAR NOVO BLOCO */}
      <Dialog open={isAddBlockOpen} onOpenChange={setIsAddBlockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {targetType === 'cycle' ? "Adicionar ao Ciclo" : "Agendar na Semana"}
            </DialogTitle>
            <DialogDescription>
              Escolha a disciplina e o tempo que deseja dedicar a este bloco.
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

            {targetType === 'weekly' && (
              <div className="space-y-2">
                <Label>Dia da Semana</Label>
                <Select value={selectedDay.toString()} onValueChange={v => setSelectedDay(parseInt(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day, i) => <SelectItem key={i} value={i.toString()}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

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
            <Button onClick={() => addBlockMutation.mutate()} disabled={addBlockMutation.isPending} className="bg-primary">
              {addBlockMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Bloco"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}