import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from "recharts";
import { Loader2, Users, MousePointer, Clock, Map, TrendingUp, Calendar, AlertTriangle, Wrench, RefreshCw, CheckCircle2, Radio } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, parseISO, getHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

const fetchAccessData = async () => {
  const today = new Date();
  const startDate = subDays(today, 30).toISOString(); // Últimos 30 dias

  // 0. Buscar IDs dos Administradores para excluir das métricas
  const { data: adminProfiles, error: adminError } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin');

  if (adminError) console.error("Erro ao identificar admins:", adminError);

  const adminIds = adminProfiles?.map(p => p.id) || [];
  // Formata para o filtro do Supabase: (id1,id2,id3)
  const adminIdsString = adminIds.length > 0 ? `(${adminIds.join(',')})` : null;

  // 1. Logs de Acesso (Page Views)
  let logsQuery = supabase
    .from('access_logs')
    .select('created_at, path, user_id')
    .gte('created_at', startDate);

  // Filtra admins se houver algum
  if (adminIdsString) {
    logsQuery = logsQuery.not('user_id', 'in', adminIdsString);
  }

  const { data: logs, error: logsError } = await logsQuery;

  if (logsError) {
    if (logsError.code === '42P01') throw new Error("TABELAS_INEXISTENTES");
    throw logsError;
  }

  // 2. Tempo Diário
  let timeQuery = supabase
    .from('daily_activity_time')
    .select('activity_date, seconds, user_id')
    .gte('activity_date', startDate);

  // Filtra admins se houver algum
  if (adminIdsString) {
    timeQuery = timeQuery.not('user_id', 'in', adminIdsString);
  }

  const { data: dailyTime, error: timeError } = await timeQuery;

  const safeDailyTime = timeError ? [] : dailyTime;

  return { logs, dailyTime: safeDailyTime };
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
    staleTime: Infinity, // Mantemos os dados "frescos" indefinidamente, pois o Realtime fará o update
  });

  // --- CONFIGURAÇÃO REALTIME ---
  useEffect(() => {
    const channel = supabase
      .channel('analytics-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'access_logs',
        },
        () => {
          // Atualiza quando houver nova visualização de página
          queryClient.invalidateQueries({ queryKey: ['accessReport'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT ou UPDATE
          schema: 'public',
          table: 'daily_activity_time',
        },
        () => {
          // Atualiza quando o tempo de uso mudar
          queryClient.invalidateQueries({ queryKey: ['accessReport'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsRealtimeConnected(false);
        }
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
      if (data && data.error) throw new Error(data.error);
      
      toast.success("Tabelas instaladas com sucesso!", { id: toastId });
      
      setTimeout(() => {
         refetch();
         window.location.reload(); 
      }, 1500);

    } catch (err: any) {
      toast.error("Erro na instalação: " + err.message, { id: toastId });
    } finally {
      setIsInstalling(false);
    }
  };

  const stats = useMemo(() => {
    if (!data) return null;
    const { logs, dailyTime } = data;
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    // --- HOJE ---
    const logsToday = logs?.filter(l => l.created_at.startsWith(todayStr)) || [];
    const activeUsersToday = new Set(logsToday.map(l => l.user_id)).size;
    const totalViewsToday = logsToday.length;
    
    // Tempo médio hoje
    const timeToday = dailyTime?.filter(t => t.activity_date === todayStr) || [];
    const totalSecondsToday = timeToday.reduce((acc, curr) => acc + curr.seconds, 0);
    const avgTimeToday = activeUsersToday > 0 ? Math.round(totalSecondsToday / activeUsersToday / 60) : 0; 

    // --- GRÁFICO DIÁRIO (Últimos 7 dias) ---
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const displayDate = format(date, 'dd/MM');
      
      const dayLogs = logs?.filter(l => l.created_at.startsWith(dateKey)) || [];
      const dayUsers = new Set(dayLogs.map(l => l.user_id)).size;
      const dayTime = dailyTime?.filter(t => t.activity_date === dateKey).reduce((acc, c) => acc + c.seconds, 0) || 0;
      const avgMin = dayUsers > 0 ? Math.round(dayTime / dayUsers / 60) : 0;

      dailyTrend.push({
        date: displayDate,
        Usuários: dayUsers,
        Visualizações: dayLogs.length,
        'Tempo Médio (min)': avgMin
      });
    }

    // --- HORÁRIOS DE PICO ---
    const hourlyMap = new Array(24).fill(0);
    logs?.forEach(l => {
      const hour = getHours(parseISO(l.created_at));
      hourlyMap[hour]++;
    });
    const hourlyData = hourlyMap.map((count, i) => ({
      hour: `${i}h`,
      Acessos: count
    }));

    // --- MÓDULOS MAIS ACESSADOS ---
    const pathMap: Record<string, number> = {};
    logs?.forEach(l => {
      let path = l.path;
      
      // Não contabiliza acessos ao Dashboard ('/')
      if (path === '/') {
        return;
      }

      if (path.startsWith('/questions')) path = 'Questões';
      else if (path.startsWith('/simulado')) path = 'Simulado';
      else if (path.startsWith('/medications')) path = 'Medicamentos';
      else if (path.startsWith('/emergency')) path = 'Emergências';
      else if (path.startsWith('/concursos')) path = 'Concursos';
      else if (path.startsWith('/library')) path = 'Biblioteca';
      else if (path.startsWith('/video')) path = 'Vídeos';
      else if (path.startsWith('/tools')) path = 'Ferramentas';
      else if (path.startsWith('/scales')) path = 'Escalas';
      else if (path.startsWith('/user')) path = 'Perfil Público';
      else if (path.startsWith('/profile')) path = 'Meu Perfil';
      else path = 'Outros';

      pathMap[path] = (pathMap[path] || 0) + 1;
    });

    const modulesData = Object.entries(pathMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); 

    return {
      activeUsersToday,
      totalViewsToday,
      avgTimeToday,
      dailyTrend,
      hourlyData,
      modulesData
    };
  }, [data]);

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (error) {
    const isTableMissing = error.message === "TABELAS_INEXISTENTES" || (error as any).code === '42P01';

    return (
      <div className="flex flex-col gap-6 p-4">
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Configuração Necessária</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4 text-sm">
              {isTableMissing 
                ? "As tabelas de relatório de acesso ainda não foram criadas no banco de dados." 
                : `Erro ao carregar dados: ${(error as Error).message}`}
            </p>
            <div className="flex gap-3">
                <Button 
                  onClick={handleInstallAnalytics} 
                  disabled={isInstalling}
                  className="bg-red-600 hover:bg-red-700 text-white border-none shadow-sm"
                >
                  {isInstalling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wrench className="mr-2 h-4 w-4" />}
                  {isInstalling ? "Configurando..." : "Configurar Agora"}
                </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. KPIs de Hoje e Status Realtime */}
      <div className="flex justify-end items-center -mb-2">
         {isRealtimeConnected ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5 px-2">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               Ao Vivo (Excl. Admins)
            </Badge>
         ) : (
            <Badge variant="outline" className="bg-muted text-muted-foreground flex items-center gap-1.5 px-2">
               <Radio className="w-3 h-3" /> Offline
            </Badge>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Usuários Ativos (Hoje)</p>
              <h3 className="text-4xl font-black">{stats.activeUsersToday}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-lg">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-1">Acessos Totais</p>
              <h3 className="text-4xl font-black">{stats.totalViewsToday}</h3>
              <p className="text-xs text-emerald-100 mt-1">visualizações de página</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <MousePointer className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white border-none shadow-lg">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wider mb-1">Tempo Médio</p>
              <h3 className="text-4xl font-black">{stats.avgTimeToday}<span className="text-xl font-normal ml-1">min</span></h3>
              <p className="text-xs text-purple-100 mt-1">por usuário hoje</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tendência Diária */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Atividade (Últimos 7 Dias)
            </CardTitle>
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
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Usuários" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="Visualizações" stroke="#10b981" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Horários de Pico */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" /> Mapa de Calor (Horário)
            </CardTitle>
            <CardDescription>Acumulado dos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="hour" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} interval={2} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Bar dataKey="Acessos" radius={[4, 4, 0, 0]}>
                  {stats.hourlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Acessos > 50 ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* 3. Módulos Mais Acessados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-md">
           <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                 <Map className="h-5 w-5 text-purple-500" /> Distribuição de Tráfego
              </CardTitle>
           </CardHeader>
           <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={stats.modulesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.modulesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                 </PieChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md">
           <CardHeader>
              <CardTitle className="text-base">Ranking de Módulos</CardTitle>
              <CardDescription>Páginas mais visitadas nos últimos 30 dias</CardDescription>
           </CardHeader>
           <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                 <div className="p-6 pt-0">
                    {stats.modulesData.map((item, index) => (
                       <div key={index} className="flex items-center gap-4 py-3 border-b last:border-0 hover:bg-muted/30 transition-colors px-2 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-xs">
                             {index + 1}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between mb-1">
                                <span className="font-semibold text-sm">{item.name}</span>
                                <span className="font-bold text-primary">{item.value}</span>
                             </div>
                             <div className="w-full bg-muted rounded-full h-1.5">
                                <div 
                                   className="h-full rounded-full" 
                                   style={{ 
                                      width: `${(item.value / stats.modulesData[0].value) * 100}%`,
                                      backgroundColor: COLORS[index % COLORS.length] 
                                   }} 
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

    </div>
  );
};

export default AccessReport;