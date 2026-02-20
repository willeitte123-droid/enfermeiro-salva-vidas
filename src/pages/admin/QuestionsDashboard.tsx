import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Loader2, Database, AlertTriangle, FileQuestion, PieChart, Layers, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuestionStats {
  total: number;
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
  const [isInstallingPack, setIsInstallingPack] = useState(false);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminQuestionStatsLocal'],
    queryFn: async () => {
      let allQuestions: any[] = [];
      let from = 0;
      const step = 1000;
      let hasMore = true;

      // Loop para buscar todas as questões em lotes de 1000
      while (hasMore) {
        const { data, error } = await supabase
          .from('questions')
          .select('category, banca')
          .range(from, from + step - 1);
        
        if (error) throw error;

        if (data && data.length > 0) {
          allQuestions = [...allQuestions, ...data];
          if (data.length < step) {
            hasMore = false; // Se veio menos que o limite, acabou
          } else {
            from += step; // Próxima página
          }
        } else {
          hasMore = false;
        }
      }

      const total = allQuestions.length;

      // Processamento local (Agrupamento por Categoria)
      const categoryMap = allQuestions.reduce((acc, q) => {
        const cat = q.category || 'Sem Categoria';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const by_category = Object.entries(categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      // Processamento local (Agrupamento por Banca)
      const bancaMap = allQuestions.reduce((acc, q) => {
        const banca = q.banca || 'Não Informada';
        acc[banca] = (acc[banca] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const by_banca = Object.entries(bancaMap)
        .map(([banca, count]) => ({ banca, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Top 20 bancas

      return { total, by_category, by_banca } as QuestionStats;
    }
  });

  const handleInstallFlashcards = async () => {
    setIsInstallingPack(true);
    const toastId = toast.loading("Instalando pacote de Flashcards...");
    try {
      const { data, error } = await supabase.functions.invoke('seed-flashcards');
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast.success(data.message, { id: toastId });
    } catch (err: any) {
      toast.error("Erro ao instalar: " + err.message, { id: toastId });
    } finally {
      setIsInstallingPack(false);
    }
  };

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
      
      {/* Header Actions */}
      <div className="flex justify-end">
          <Button 
              onClick={handleInstallFlashcards} 
              disabled={isInstallingPack}
              variant="outline" 
              size="sm"
              className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
          >
              {isInstallingPack ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Instalar Flashcards
          </Button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100 uppercase tracking-wider flex items-center gap-2">
              <Database className="h-4 w-4" /> Total no Banco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{stats.total}</div>
            <p className="text-xs text-blue-200 mt-1">Questões cadastradas no Supabase</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4" /> Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{stats.by_category.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Disciplinas distintas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileQuestion className="h-4 w-4" /> Bancas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{stats.by_banca.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Instituições organizadoras</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de Categorias Deficitárias */}
      {lowContentCategories.length > 0 && (
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-bold">Atenção: Categorias com poucas questões</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
            As seguintes matérias têm menos de 20 questões e precisam de reforço urgente:
            <ScrollArea className="h-32 w-full mt-2 pr-4 rounded bg-background/40 border border-amber-200/50">
              <div className="flex flex-wrap gap-2 p-2">
                {lowContentCategories.map(c => (
                  <Badge key={c.category} variant="outline" className="bg-white dark:bg-black/20 text-amber-700 border-amber-300 whitespace-nowrap">
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
            <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5 text-primary"/> Distribuição por Matéria</CardTitle>
            <CardDescription>Quantidade de questões disponíveis por disciplina.</CardDescription>
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
                    <span className="font-medium text-muted-foreground truncate max-w-[250px]" title={item.category}>{item.category}</span>
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