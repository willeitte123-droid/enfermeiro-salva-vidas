import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Loader2, Database, AlertTriangle, FileQuestion, PieChart, Layers, GraduationCap, Brain } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface QuestionStats {
  total: number;
  flashcardsTotal: number;
  by_category: { category: string; count: number }[];
  by_banca: { banca: string; count: number }[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-md border p-3 rounded-xl shadow-xl text-xs z-50 ring-1 ring-border/50">
        <p className="font-bold text-foreground mb-1">{label}</p>
        <p className="text-primary font-mono font-bold">
          {payload[0].value} questões
        </p>
      </div>
    );
  }
  return null;
};

const QuestionsDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminQuestionStatsLocal'],
    queryFn: async () => {
      // 1. Buscar Questões (Aumentando o limite para 10.000 para pegar tudo)
      const { data: questionsData, error: qError } = await supabase
        .from('questions')
        .select('category, banca')
        .limit(10000); // IMPORTANTE: O padrão do Supabase é 1000. Aumentamos para garantir o total real.
      
      if (qError) throw qError;

      // 2. Buscar Contagem de Flashcards (Count Exact)
      const { count: flashcardsCount, error: fError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true });
        
      if (fError) throw fError;

      const questions = questionsData || [];
      const total = questions.length; // Agora deve refletir 1163+

      // Processamento local (Agrupamento por Categoria)
      const categoryMap = questions.reduce((acc, q) => {
        const cat = q.category || 'Sem Categoria';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const by_category = Object.entries(categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      // Processamento local (Agrupamento por Banca)
      const bancaMap = questions.reduce((acc, q) => {
        const banca = q.banca || 'Não Informada';
        acc[banca] = (acc[banca] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const by_banca = Object.entries(bancaMap)
        .map(([banca, count]) => ({ banca, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Top 20 bancas

      return { 
        total, 
        flashcardsTotal: flashcardsCount || 0,
        by_category, 
        by_banca 
      } as QuestionStats;
    }
  });

  // Calcula a altura necessária para o gráfico com base no número de categorias
  const chartHeight = useMemo(() => {
    if (!stats) return 400;
    // 35px por barra + margem base de 100px
    return Math.max(400, stats.by_category.length * 35 + 100);
  }, [stats]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar estatísticas</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!stats) return null;

  // Identificar categorias com poucas questões (menos de 20)
  const lowContentCategories = stats.by_category.filter(c => c.count < 20);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-blue-100 uppercase tracking-wider flex items-center gap-2">
              <Database className="h-4 w-4" /> Total Questões
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-3xl font-black">{stats.total}</div>
            <p className="text-[10px] text-blue-200 mt-1">Cadastradas no Banco</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-600 to-purple-700 text-white border-none shadow-lg">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-violet-100 uppercase tracking-wider flex items-center gap-2">
              <Brain className="h-4 w-4" /> Flashcards
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-3xl font-black">{stats.flashcardsTotal}</div>
            <p className="text-[10px] text-violet-200 mt-1">Cartas de Memorização</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4" /> Disciplinas
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-3xl font-bold text-foreground">{stats.by_category.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Categorias distintas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileQuestion className="h-4 w-4" /> Bancas
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-3xl font-bold text-foreground">{stats.by_banca.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Instituições</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de Categorias Deficitárias */}
      {lowContentCategories.length > 0 && (
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-bold text-sm">Categorias com poucas questões (<20)</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2">
            <ScrollArea className="h-24 w-full pr-4 rounded bg-background/40 border border-amber-200/50">
              <div className="flex flex-wrap gap-2 p-2">
                {lowContentCategories.map(c => (
                  <Badge key={c.category} variant="outline" className="bg-white dark:bg-black/20 text-amber-700 border-amber-300 text-xs whitespace-nowrap">
                    {c.category}: {c.count}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </AlertDescription>
        </Alert>
      )}

      {/* Gráfico de Distribuição por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><PieChart className="h-5 w-5 text-primary"/> Distribuição por Matéria</CardTitle>
            <CardDescription>Quantidade de questões reais disponíveis no banco de dados.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
                <div style={{ height: `${chartHeight}px`, minWidth: "600px" }} className="w-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={stats.by_category}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                        <XAxis type="number" hide />
                        <YAxis 
                        dataKey="category" 
                        type="category" 
                        width={220}
                        tick={{ fontSize: 11, width: 220 }} 
                        interval={0}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                        {stats.by_category.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.count < 20 ? '#ef4444' : '#3b82f6'} />
                        ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela Detalhada */}
        <Card className="shadow-md lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Detalhes por Matéria</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                {stats.by_category.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                    <span className="font-medium text-muted-foreground truncate max-w-[200px]" title={item.category}>{item.category}</span>
                    <Badge variant={item.count < 20 ? "destructive" : "secondary"} className="font-mono ml-2 shrink-0">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tabela por Banca */}
        <Card className="shadow-md lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Top Bancas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                {stats.by_banca.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                    <span className="font-medium text-muted-foreground truncate max-w-[200px]" title={item.banca}>
                      {item.banca}
                    </span>
                    <Badge variant="outline" className="font-mono">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionsDashboard;