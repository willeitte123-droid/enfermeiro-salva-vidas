import { useEffect, useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  AreaChart, Area
} from "recharts";
import { 
  Trophy, Clock, Target, AlertTriangle, TrendingUp, 
  Brain, FileQuestion, ArrowRight, Loader2, Zap 
} from "lucide-react";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
      <div className="bg-background/95 backdrop-blur-sm p-3 border rounded-lg shadow-xl text-xs sm:text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MyPerformance = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Ferramenta', title: 'Análise de Desempenho', path: '/tools/performance', icon: 'PieChart' });
  }, [addActivity]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['detailedStats', profile?.id],
    queryFn: () => fetchStats(profile!.id),
    enabled: !!profile,
  });

  // Processamento de Dados
  const processedData = useMemo(() => {
    if (!stats) return null;

    // Categorias com % de acerto
    const categoryPerformance = stats.categories.map(cat => ({
      subject: cat.category,
      Aproveitamento: Math.round((cat.total_correct / cat.total_answered) * 100) || 0,
      total: cat.total_answered,
      fullMark: 100
    })).sort((a, b) => b.total - a.total).slice(0, 6); // Top 6 categorias mais estudadas para o Radar

    // Ordenar por aproveitamento para identificar pontos fortes/fracos
    const sortedByAccuracy = [...stats.categories].map(cat => ({
        ...cat,
        accuracy: Math.round((cat.total_correct / cat.total_answered) * 100) || 0
    })).sort((a, b) => b.accuracy - a.accuracy);

    const strengths = sortedByAccuracy.filter(c => c.total_answered >= 5).slice(0, 3);
    const weaknesses = sortedByAccuracy.filter(c => c.total_answered >= 5).reverse().slice(0, 3);

    // Dados para gráfico de evolução (Simulados)
    const simulationEvolution = [...stats.simulations].reverse().map(sim => ({
      date: format(new Date(sim.created_at), 'dd/MM'),
      Aproveitamento: sim.percentage,
    }));

    // Tempo total formatado
    const hours = Math.floor(stats.total_time_seconds / 3600);
    const minutes = Math.floor((stats.total_time_seconds % 3600) / 60);

    // Total de questões
    const totalQuestions = stats.categories.reduce((acc, curr) => acc + curr.total_answered, 0);
    const totalCorrect = stats.categories.reduce((acc, curr) => acc + curr.total_correct, 0);
    const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return {
      categoryPerformance,
      strengths,
      weaknesses,
      simulationEvolution,
      timeString: `${hours}h ${minutes}m`,
      totalQuestions,
      globalAccuracy
    };
  }, [stats]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!processedData || processedData.totalQuestions === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <div className="bg-primary/10 p-6 rounded-full">
          <Brain className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Sem dados suficientes ainda</h2>
        <p className="text-muted-foreground max-w-md">
          Comece a responder questões e realizar simulados para que nossa inteligência possa gerar relatórios sobre seu desempenho.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link to="/questions">Ir para Banca de Questões</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Imersivo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Trophy className="w-64 h-64 text-yellow-400" />
        </div>
        <div className="relative z-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">Painel de Performance</h1>
            <p className="text-slate-300">
              Olá, {profile?.first_name}. Aqui está a análise completa da sua jornada de estudos.
            </p>
            <div className="mt-6 flex gap-3">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10 px-3 py-1">
                Nível: {processedData.totalQuestions > 500 ? "Veterano" : processedData.totalQuestions > 100 ? "Praticante" : "Iniciante"}
              </Badge>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 bg-cyan-400/10 px-3 py-1">
                Foco: Generalista
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <Clock className="h-6 w-6 text-cyan-400 mb-2" />
            <span className="text-3xl font-black">{processedData.timeString}</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">Tempo de Estudo</span>
          </div>

          <div className="flex flex-col justify-center items-center bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <Target className="h-6 w-6 text-emerald-400 mb-2" />
            <span className="text-3xl font-black">{processedData.globalAccuracy}%</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">Precisão Global</span>
          </div>
        </div>
      </div>

      {/* Seção de Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar de Competências */}
        <Card className="lg:col-span-1 shadow-lg border-t-4 border-t-indigo-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-500" /> Mapa de Competências
            </CardTitle>
            <CardDescription>Seu desempenho nas áreas mais estudadas.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={processedData.categoryPerformance}>
                <PolarGrid strokeOpacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Você"
                  dataKey="Aproveitamento"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução nos Simulados */}
        <Card className="lg:col-span-2 shadow-lg border-t-4 border-t-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Evolução nos Simulados
            </CardTitle>
            <CardDescription>Seu histórico de aproveitamento nos últimos 10 simulados.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {processedData.simulationEvolution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData.simulationEvolution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="Aproveitamento" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <FileQuestion className="h-10 w-10 mb-2 opacity-20" />
                <p>Nenhum simulado realizado ainda.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Análise de Pontos Fortes e Fracos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pontos Fortes */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/20 dark:to-emerald-900/10 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
              <Zap className="h-5 w-5 fill-current" /> Pontos Fortes
            </CardTitle>
            <CardDescription>Assuntos que você domina (mín. 5 questões).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {processedData.strengths.length > 0 ? processedData.strengths.map((cat) => (
              <div key={cat.category} className="bg-background/60 p-3 rounded-lg flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-semibold text-sm">{cat.category}</p>
                  <p className="text-xs text-muted-foreground">{cat.total_answered} questões</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{cat.accuracy}%</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground italic p-4 text-center">Responda mais questões para descobrir seus pontos fortes.</p>
            )}
          </CardContent>
        </Card>

        {/* Pontos de Atenção */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-100/50 dark:from-red-950/20 dark:to-orange-900/10 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 fill-current" /> Onde Melhorar
            </CardTitle>
            <CardDescription>Foque nestes assuntos para subir de nível.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {processedData.weaknesses.length > 0 ? processedData.weaknesses.map((cat) => (
              <div key={cat.category} className="bg-background/60 p-3 rounded-lg flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-semibold text-sm">{cat.category}</p>
                  <p className="text-xs text-muted-foreground">{cat.total_answered} questões</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-red-600">{cat.accuracy}%</span>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full" asChild title="Estudar agora">
                    <Link to={`/questions?category=${encodeURIComponent(cat.category)}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground italic p-4 text-center">Sem pontos fracos identificados ainda. Continue praticando!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyPerformance;