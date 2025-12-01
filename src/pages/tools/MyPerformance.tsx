import { useEffect, useMemo, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  Trophy, Clock, Target, AlertTriangle, TrendingUp, 
  Brain, FileQuestion, ArrowRight, Loader2, Zap, 
  Calendar, CheckCircle2, ListFilter
} from "lucide-react";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  first_name: string;
}

interface CategoryStat {
  category: string;
  total_answered: number;
  total_correct: number;
}

interface SimulationStat {
  created_at: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds: number;
}

interface DetailedStats {
  categories: CategoryStat[];
  simulations: SimulationStat[];
  total_time_seconds: number;
}

const fetchStats = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_detailed_performance_stats', { p_user_id: userId });
  if (error) throw error;
  return data as DetailedStats;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-md p-3 border rounded-xl shadow-xl text-xs sm:text-sm ring-1 ring-border/50">
        <p className="font-bold mb-1.5 text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-bold font-mono">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MyPerformance = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    addActivity({ type: 'Ferramenta', title: 'Análise de Desempenho', path: '/tools/performance', icon: 'PieChart' });
  }, [addActivity]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['detailedStats', profile?.id],
    queryFn: () => fetchStats(profile!.id),
    enabled: !!profile,
  });

  const processedData = useMemo(() => {
    if (!stats) return null;

    // Processar e ordenar categorias gerais
    const allCategories = [...stats.categories].map(cat => ({
        ...cat,
        accuracy: Math.round((cat.total_correct / cat.total_answered) * 100) || 0,
        incorrect: cat.total_answered - cat.total_correct
    })).sort((a, b) => b.total_answered - a.total_answered);

    // Filtrar categorias com pelo menos 1 resposta
    const validCategories = allCategories.filter(c => c.total_answered >= 1);

    // 1. Determinar Pontos Fortes: >= 60% de acerto
    const strengths = validCategories
        .filter(c => c.accuracy >= 60)
        .sort((a, b) => b.accuracy - a.accuracy)
        .slice(0, 3);

    const strengthNames = new Set(strengths.map(s => s.category));

    // 2. Determinar Pontos de Atenção: O que não é ponto forte, ordenado pelo menor acerto
    const weaknesses = validCategories
        .filter(c => !strengthNames.has(c.category))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 3);

    // Categorias para Radar (Top 6 por volume)
    const categoryPerformance = stats.categories.map(cat => ({
      subject: cat.category,
      Aproveitamento: Math.round((cat.total_correct / cat.total_answered) * 100) || 0,
      total: cat.total_answered,
      fullMark: 100
    })).sort((a, b) => b.total - a.total).slice(0, 6);

    // Evolução Simulados
    const simulationEvolution = [...stats.simulations].reverse().map(sim => ({
      date: format(new Date(sim.created_at), 'dd/MM'),
      Aproveitamento: sim.percentage,
      Score: sim.score
    }));

    // Totais
    const hours = Math.floor(stats.total_time_seconds / 3600);
    const minutes = Math.floor((stats.total_time_seconds % 3600) / 60);
    const totalQuestions = stats.categories.reduce((acc, curr) => acc + curr.total_answered, 0);
    const totalCorrect = stats.categories.reduce((acc, curr) => acc + curr.total_correct, 0);
    const totalIncorrect = totalQuestions - totalCorrect;
    const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Dados para Pie Chart
    const pieData = [
      { name: 'Acertos', value: totalCorrect, color: '#10b981' }, // emerald-500
      { name: 'Erros', value: totalIncorrect, color: '#ef4444' }, // red-500
    ];

    return {
      categoryPerformance,
      allCategories,
      strengths,
      weaknesses,
      simulationEvolution,
      timeString: `${hours}h ${minutes}m`,
      totalQuestions,
      globalAccuracy,
      pieData,
      simulations: stats.simulations
    };
  }, [stats]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!processedData || processedData.totalQuestions === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-primary/10 p-8 rounded-full ring-8 ring-primary/5">
          <Brain className="h-20 w-20 text-primary" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-3xl font-bold tracking-tight">Comece sua Jornada</h2>
          <p className="text-muted-foreground">
            Ainda não temos dados suficientes para gerar sua análise. Responda questões e simulados para desbloquear insights poderosos.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
          <Link to="/questions">Ir para Banca de Questões</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Header Imersivo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl ring-1 ring-white/10">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 p-10 opacity-5 mix-blend-overlay">
          <Trophy className="w-80 h-80" />
        </div>
        <div className="absolute -left-20 -bottom-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute right-20 -top-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 grid gap-8 lg:grid-cols-3 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm ring-1 ring-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Análise em Tempo Real
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Olá, {profile?.first_name}</h1>
              <p className="text-slate-300 max-w-xl text-lg leading-relaxed">
                Você já resolveu <strong className="text-white">{processedData.totalQuestions} questões</strong> com um aproveitamento global de <strong className="text-emerald-400">{processedData.globalAccuracy}%</strong>.
                {processedData.globalAccuracy >= 80 ? " Excelente desempenho!" : " Continue praticando para evoluir."}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 pr-6 border border-white/10">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tempo Total</p>
                  <p className="text-xl font-bold">{processedData.timeString}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 pr-6 border border-white/10">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300"><FileQuestion className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Simulados</p>
                  <p className="text-xl font-bold">{processedData.simulations.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Pizza no Header */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {processedData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black">{processedData.globalAccuracy}%</span>
                <span className="text-xs text-slate-400 font-medium">Acertos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-11 p-1 bg-muted/50 rounded-full">
            <TabsTrigger value="overview" className="rounded-full text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">Painel Completo</TabsTrigger>
            <TabsTrigger value="history" className="rounded-full text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">Histórico de Simulados</TabsTrigger>
          </TabsList>
        </div>

        {/* ABA: VISÃO GERAL (PAINEL COMPLETO) */}
        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. Evolução nos Simulados */}
          <Card className="shadow-lg border-t-4 border-t-emerald-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-500" /> Evolução nos Simulados</CardTitle>
              <CardDescription>Acompanhe seu progresso ao longo do tempo.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {processedData.simulationEvolution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={processedData.simulationEvolution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="Aproveitamento" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)"
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                  <FileQuestion className="h-10 w-10 mb-2 opacity-20" />
                  <p>Realize simulados para ver o gráfico.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Pontos Fortes e Fracos */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20 border-green-200 dark:border-green-800/50">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2 text-base">
                  <Zap className="h-5 w-5 fill-current" /> Pontos Fortes (≥60%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {processedData.strengths.length > 0 ? processedData.strengths.map(cat => (
                  <div key={cat.category} className="flex justify-between items-center bg-background/50 p-2 rounded border border-green-100 dark:border-green-900/50">
                    <span className="text-sm font-medium truncate max-w-[70%]">{cat.category}</span>
                    <Badge className="bg-green-500 text-white hover:bg-green-600">{cat.accuracy}%</Badge>
                  </div>
                )) : <p className="text-sm text-muted-foreground italic">Nenhuma disciplina com acerto ≥ 60% ainda.</p>}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/20 border-red-200 dark:border-red-800/50">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 fill-current" /> Pontos de Atenção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {processedData.weaknesses.length > 0 ? processedData.weaknesses.map(cat => (
                  <div key={cat.category} className="flex justify-between items-center bg-background/50 p-2 rounded border border-red-100 dark:border-red-900/50">
                    <span className="text-sm font-medium truncate max-w-[70%]">{cat.category}</span>
                    <Badge variant="destructive">{cat.accuracy}%</Badge>
                  </div>
                )) : <p className="text-sm text-muted-foreground italic">Continue praticando para identificar dificuldades.</p>}
              </CardContent>
            </Card>
          </div>

          {/* 3. Radar de Competências */}
          <div className="w-full">
            <Card className="shadow-lg border-t-4 border-t-indigo-500 max-w-3xl mx-auto overflow-hidden">
              <CardHeader className="bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20">
                <CardTitle className="text-xl flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                  <Brain className="h-6 w-6" /> Mapa de Competências
                </CardTitle>
                <CardDescription>Visualização radial do seu equilíbrio entre as disciplinas.</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center p-0 sm:p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="75%" 
                    data={processedData.categoryPerformance}
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                  >
                    <defs>
                      <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6}/>
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <PolarGrid stroke="currentColor" className="text-muted-foreground/20" strokeDasharray="4 4" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={({ payload, x, y, textAnchor, stroke, radius }) => (
                        <text
                          x={x}
                          y={y}
                          textAnchor={textAnchor}
                          fill="currentColor"
                          className="text-[10px] sm:text-xs font-bold fill-muted-foreground uppercase tracking-wide"
                        >
                          {payload.value.length > 18 ? `${payload.value.substring(0, 15)}...` : payload.value}
                        </text>
                      )}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Você"
                      dataKey="Aproveitamento"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#radarGradient)"
                      fillOpacity={1}
                      isAnimationActive={true}
                      dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "var(--background)" }}
                      activeDot={{ r: 6, fill: "#4f46e5", stroke: "var(--background)", strokeWidth: 2 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* 4. Detalhamento Completo por Disciplina */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListFilter className="h-5 w-5 text-primary"/> Detalhamento Completo</CardTitle>
              <CardDescription>Desempenho detalhado em todas as matérias estudadas.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {processedData.allCategories.map((cat) => (
                    <div key={cat.category} className="space-y-2">
                      <div className="flex justify-between items-end text-sm">
                        <span className="font-semibold text-foreground/90">{cat.category}</span>
                        <div className="text-right">
                          <span className={cn("font-bold", cat.accuracy >= 70 ? "text-green-500" : cat.accuracy >= 40 ? "text-yellow-500" : "text-red-500")}>
                            {cat.accuracy}%
                          </span>
                          <span className="text-muted-foreground text-xs ml-1">({cat.total_correct}/{cat.total_answered})</span>
                        </div>
                      </div>
                      <Progress 
                        value={cat.accuracy} 
                        className="h-2.5" 
                        indicatorClassName={cn(cat.accuracy >= 70 ? "bg-green-500" : cat.accuracy >= 40 ? "bg-yellow-500" : "bg-red-500")}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

        </TabsContent>

        {/* ABA: HISTÓRICO */}
        <TabsContent value="history" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary"/> Histórico de Simulados</CardTitle>
            </CardHeader>
            <CardContent>
              {processedData.simulations.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {[...processedData.simulations].reverse().map((sim, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-full", sim.percentage >= 70 ? "bg-green-100 text-green-700" : sim.percentage >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700")}>
                            <Target className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">Simulado #{processedData.simulations.length - i}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(sim.created_at), "dd 'de' MMMM, HH:mm", { locale: ptBR })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{sim.percentage}%</p>
                          <p className="text-xs text-muted-foreground">{sim.score}/{sim.total_questions} acertos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12 text-muted-foreground">Nenhum simulado registrado.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyPerformance;