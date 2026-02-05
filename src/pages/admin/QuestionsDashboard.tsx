import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Loader2, Database, AlertTriangle, FileQuestion, PieChart, Layers } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface StatItem {
  category?: string;
  banca?: string;
  count: number;
}

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
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminQuestionStats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_question_stats');
      if (error) throw error;
      return data as QuestionStats;
    }
  });

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
            <div className="flex flex-wrap gap-2 mt-2">
              {lowContentCategories.map(c => (
                <Badge key={c.category} variant="outline" className="bg-white dark:bg-black/20 text-amber-700 border-amber-300">
                  {c.category}: {c.count}
                </Badge>
              ))}
            </div>
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
          <CardContent className="h-[400px]">
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
                  width={180} 
                  tick={{ fontSize: 11 }} 
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
                    <span className="font-medium text-muted-foreground">{item.category}</span>
                    <Badge variant={item.count < 20 ? "destructive" : "secondary"} className="font-mono">
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