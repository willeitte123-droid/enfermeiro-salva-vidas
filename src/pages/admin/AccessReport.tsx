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

  // Busca inicial e polling muito rápido de fallback (5 segundos)
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['accessReport'],
    queryFn: fetchAccessData,
    refetchInterval: 5000, // Atualiza sozinho a cada 5 segundos
    refetchOnWindowFocus: true,
  });

  // Configuração do Realtime via WebSockets
  useEffect(() => {
    const channel = supabase.channel('analytics-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'access_logs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['accessReport'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_activity_time' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['accessReport'] });
        }
      )
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
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

    // MÉTRICAS DE HOJE (Últimas 24h aproximadas pelo dia atual)
    const logsToday = logs.filter(l => l.created_at.startsWith(todayStr));
    const activeUsersToday = new Set(logsToday.map(l => l.user_id)).size;
    const totalViewsToday = logsToday.length;
    
    // Cálculo do Tempo Médio
    const timeToday = dailyTime.filter(t => t.activity_date === todayStr);
    const totalSecondsToday = timeToday.reduce((acc, curr) => acc + curr.seconds, 0);
    const avgTimeToday = activeUsersToday > 0 
      ? Math.round(totalSecondsToday / activeUsersToday / 60) 
      : 0; 

    // TENDÊNCIA DIÁRIA
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

    // MAPA DE CALOR (HORÁRIO)
    const hourlyMap = new Array(24).fill(0);
    logs.forEach(l => {
      const hour = getHours(parseISO(l.created_at));
      hourlyMap[hour]++;
    });
    const hourlyData = hourlyMap.map((count, i) => ({
      hour: `${i}h`,
      Acessos: count
    }));

    // RANKING DE MÓDULOS
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
          As tabelas de analytics precisam ser instaladas para coletar dados em tempo real.
          <Button onClick={handleInstallAnalytics} disabled={isInstalling} className="mt-4 block">
            <Wrench className="mr-2 h-4 w-4" /> Instalar Agora
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Realtime Status Indicator */}
      <div className="flex justify-between items-center bg-card p-3 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
             <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
             Atualizar Agora
          </Button>
          <span className="text-xs text-muted-foreground">Atualizando automaticamente a cada 5s</span>
        </div>
        {isRealtimeConnected ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5 py-1 px-3 shadow-sm animate-pulse-subtle">
            <Radio className="h-3 w-3" /> Conexão Realtime: ON
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground gap-1.5 py-1 px-3">
            <Loader2 className="h-3 w-3 animate-spin" /> Conectando...
          </Badge>
        )}
      </div>

      {/* KPIs de Hoje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users className="w-24 h-24" /></div>
          <CardContent className="p-6 relative z-10">
            <p className="text-blue-100 text-sm font-medium uppercase mb-1 flex items-center gap-2">
              Usuários Ativos (Hoje)
            </p>
            <h3 className="text-4xl font-black">{stats.activeUsersToday}</h3>
            <p className="text-xs text-blue-200 mt-2 font-medium">Logados nas últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><MousePointer className="w-24 h-24" /></div>
          <CardContent className="p-6 relative z-10">
            <p className="text-emerald-100 text-sm font-medium uppercase mb-1 flex items-center gap-2">
              Visualizações (Hoje)
            </p>
            <h3 className="text-4xl font-black">{stats.totalViewsToday}</h3>
            <p className="text-xs text-emerald-100 mt-2 font-medium">Total de cliques e navegações</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Clock className="w-24 h-24" /></div>
          <CardContent className="p-6 relative z-10">
            <p className="text-purple-100 text-sm font-medium uppercase mb-1 flex items-center gap-2">
              Tempo Médio (Hoje)
            </p>
            <h3 className="text-4xl font-black">{stats.avgTimeToday}min</h3>
            <p className="text-xs text-purple-100 mt-2 font-medium">De atividade por usuário</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tendência */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Atividade nos Últimos 7 Dias
            </CardTitle>
            <CardDescription>Usuários ativos vs Visualizações totais.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyTrend}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Usuários" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                <Area type="monotone" dataKey="Visualizações" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mapa de Calor Horário */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" /> Horários de Pico
            </CardTitle>
            <CardDescription>Acessos distribuídos por hora do dia (Últimos 30 dias).</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyData}>
                <XAxis dataKey="hour" fontSize={10} tickLine={false} axisLine={false} interval={2} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="Acessos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ranking de Módulos Mais Visitados */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Map className="h-4 w-4 text-emerald-500" /> Módulos Mais Utilizados
          </CardTitle>
          <CardDescription>Destino dos usuários após o Dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] p-6">
            <div className="space-y-6">
              {stats.modulesData.map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <span className="w-8 font-bold text-muted-foreground text-xs group-hover:text-primary transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-foreground/80">{item.name}</span>
                      <span className="font-bold text-primary">{item.value.toLocaleString()} views</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out" 
                        style={{ width: `${(item.value / stats.modulesData[0].value) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessReport;