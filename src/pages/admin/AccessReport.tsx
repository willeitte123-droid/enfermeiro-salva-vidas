import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from "recharts";
import { Loader2, Users, MousePointer, Clock, Map, TrendingUp, Calendar, AlertTriangle, Wrench, RefreshCw, Radio } from "lucide-react";
import { format, subDays, parseISO, getHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6', '#f97316', '#d946ef', '#84cc16'];

const fetchAccessData = async () => {
  const startDate = subDays(new Date(), 30).toISOString();

  // 1. Logs de Acesso (Page Views)
  const { data: logs, error: logsError } = await supabase
    .from('access_logs')
    .select('created_at, path, user_id')
    .gte('created_at', startDate);

  if (logsError) {
    if (logsError.code === '42P01') throw new Error("TABELAS_INEXISTENTES");
    throw logsError;
  }

  // 2. Tempo Diário
  const { data: dailyTime, error: timeError } = await supabase
    .from('daily_activity_time')
    .select('activity_date, seconds, user_id')
    .gte('activity_date', format(subDays(new Date(), 30), 'yyyy-MM-dd'));

  return { logs: logs || [], dailyTime: dailyTime || [] };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-md border p-3 rounded-xl shadow-xl text-xs z-50 ring-1 ring-border/50">
        <p className="font-bold text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-bold font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AccessReport = () => {
  const queryClient = useQueryClient();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['accessReport'],
    queryFn: fetchAccessData,
    refetchInterval: 30000, // Polling a cada 30s como fallback
  });

  useEffect(() => {
    const channel = supabase.channel('analytics-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'access_logs' }, () => {
        queryClient.invalidateQueries({ queryKey: ['accessReport'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_activity_time' }, () => {
        queryClient.invalidateQueries({ queryKey: ['accessReport'] });
      })
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const handleInstallAnalytics = async () => {
    setIsInstalling(true);
    const toastId = toast.loading("Configurando tabelas de Analytics...");
    try {
      const { data, error } = await supabase.functions.invoke('install-schema');
      if (error) throw new Error(error.message);
      toast.success("Tabelas instaladas!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setIsInstalling(false);
    }
  };

  const stats = useMemo(() => {
    if (!data) return null;
    const { logs, dailyTime } = data;
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    // HOJE
    const logsToday = logs.filter(l => l.created_at.startsWith(todayStr));
    const activeUsersToday = new Set(logsToday.map(l => l.user_id)).size;
    const totalViewsToday = logsToday.length;
    
    const timeToday = dailyTime.filter(t => t.activity_date === todayStr);
    const totalSecondsToday = timeToday.reduce((acc, curr) => acc + curr.seconds, 0);
    const avgTimeToday = activeUsersToday > 0 ? Math.round(totalSecondsToday / activeUsersToday / 60) : 0; 

    // TENDÊNCIA
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayLogs = logs.filter(l => l.created_at.startsWith(dateKey));
      const dayUsers = new Set(dayLogs.map(l => l.user_id)).size;
      const dayTime = dailyTime.filter(t => t.activity_date === dateKey).reduce((acc, c) => acc + c.seconds, 0);
      dailyTrend.push({
        date: format(date, 'dd/MM'),
        Usuários: dayUsers,
        Visualizações: dayLogs.length,
        'Tempo Médio (min)': dayUsers > 0 ? Math.round(dayTime / dayUsers / 60) : 0
      });
    }

    // PICOS
    const hourlyMap = new Array(24).fill(0);
    logs.forEach(l => {
      const hour = getHours(parseISO(l.created_at));
      hourlyMap[hour]++;
    });
    const hourlyData = hourlyMap.map((count, i) => ({ hour: `${i}h`, Acessos: count }));

    // MÓDULOS
    const pathMap: Record<string, number> = {};
    logs.forEach(l => {
      if (l.path === '/') return;
      let name = l.path.split('?')[0].replace(/\/$/, '');
      if (name.startsWith('/questions')) name = 'Questões';
      else if (name.startsWith('/simulado')) name = 'Simulado';
      else if (name.startsWith('/medications')) name = 'Medicamentos';
      else if (name.startsWith('/emergency')) name = 'Emergências';
      else if (name.startsWith('/concursos')) name = 'Concursos';
      else if (name.startsWith('/library')) name = 'Biblioteca';
      else if (name.startsWith('/video-library')) name = 'Vídeos'; 
      else if (name.startsWith('/study-tracks')) name = 'Trilhas';
      else if (name.startsWith('/flashcards')) name = 'Flashcards';
      else if (name.startsWith('/review-area')) name = 'Revisão';
      else if (name.startsWith('/anatomy')) name = 'Anatomia';
      else if (name.startsWith('/semiology')) name = 'Semiologia';
      else if (name.startsWith('/ecg')) name = 'Guia ECG';
      else if (name.startsWith('/calculator')) name = 'Calculadoras';
      else if (name.startsWith('/favorites')) name = 'Favoritos';
      else if (name.startsWith('/ranking')) name = 'Ranking';
      else name = 'Outros';

      pathMap[name] = (pathMap[name] || 0) + 1;
    });

    const modulesData = Object.entries(pathMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15); 

    return { activeUsersToday, totalViewsToday, avgTimeToday, dailyTrend, hourlyData, modulesData };
  }, [data]);

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Configuração Pendente</AlertTitle>
        <AlertDescription className="mt-2">
          As tabelas de analytics precisam ser instaladas.
          <Button onClick={handleInstallAnalytics} disabled={isInstalling} className="mt-4 block"><Wrench className="mr-2 h-4 w-4" /> Instalar Agora</Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-end">{isRealtimeConnected ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Realtime Ativo</Badge> : <Badge variant="outline">Offline</Badge>}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg"><CardContent className="p-6">
          <p className="text-blue-100 text-sm font-medium uppercase mb-1">Usuários Ativos (Hoje)</p>
          <h3 className="text-4xl font-black">{stats.activeUsersToday}</h3>
        </CardContent></Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"><CardContent className="p-6">
          <p className="text-emerald-100 text-sm font-medium uppercase mb-1">Visualizações (Hoje)</p>
          <h3 className="text-4xl font-black">{stats.totalViewsToday}</h3>
        </CardContent></Card>
        <Card className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg"><CardContent className="p-6">
          <p className="text-purple-100 text-sm font-medium uppercase mb-1">Tempo Médio (Hoje)</p>
          <h3 className="text-4xl font-black">{stats.avgTimeToday}min</h3>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-base">Atividade (7 Dias)</CardTitle></CardHeader><CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={stats.dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Usuários" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} />
            <Area type="monotone" dataKey="Visualizações" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart></ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Mapa de Calor (Horário)</CardTitle></CardHeader><CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={stats.hourlyData}>
            <XAxis dataKey="hour" fontSize={10} interval={2} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Acessos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart></ResponsiveContainer>
        </CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle className="text-base">Ranking de Módulos</CardTitle></CardHeader><CardContent className="p-0">
        <ScrollArea className="h-[300px] p-6">{stats.modulesData.map((item, index) => (
          <div key={index} className="flex items-center gap-4 py-3 border-b last:border-0 hover:bg-muted/30 px-2 rounded-lg">
            <span className="w-8 font-bold text-muted-foreground text-xs">{index + 1}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1"><span className="font-semibold text-sm">{item.name}</span><span className="font-bold text-primary">{item.value}</span></div>
              <div className="w-full bg-muted rounded-full h-1.5"><div className="h-full bg-primary rounded-full" style={{ width: `${(item.value / stats.modulesData[0].value) * 100}%` }} /></div>
            </div>
          </div>
        ))}</ScrollArea>
      </CardContent></Card>
    </div>
  );
};

export default AccessReport;