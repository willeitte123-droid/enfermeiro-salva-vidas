import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Tooltip as RechartsTooltip 
} from "recharts";
import { Users, CheckCircle2, Activity, Calendar, MapPin, Brain, DollarSign, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { subDays, format, parseISO, getHours } from "date-fns";
import { Loader2 } from "lucide-react";

// --- CORES PARA GRÁFICOS ---
const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#64748b'];

// --- VALORES DOS PLANOS (Configure aqui os preços reais) ---
const PLAN_PRICES: Record<string, number> = {
  'premium': 197.00,
  'pro': 97.00,
  'essencial': 67.00,
  'free': 0.00
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded-md shadow-xl text-xs z-50">
        <p className="font-bold text-slate-200 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color || entry.fill }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- FUNÇÃO DE BUSCA DE DADOS ---
const fetchDashboardData = async () => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30).toISOString();

  // 1. Perfis (Planos, Status, Localização)
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, plan, status, location');

  if (profilesError) {
    console.error("Erro ao buscar perfis:", profilesError);
    throw profilesError;
  }

  // 2. Atividade Recente (Questões)
  const { data: recentAnswers, error: answersError } = await supabase
    .from('user_question_answers')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo)
    .limit(5000);

  if (answersError) console.error("Erro ao buscar respostas:", answersError);

  // 3. Atividade Recente (Simulados)
  const { data: recentSimulations, error: simulationsError } = await supabase
    .from('user_simulations')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo)
    .limit(1000);

  if (simulationsError) console.error("Erro ao buscar simulados:", simulationsError);

  // 4. Totais Gerais
  const { count: totalQuestions } = await supabase
    .from('user_question_answers')
    .select('*', { count: 'exact', head: true });

  const { count: totalSimulations } = await supabase
    .from('user_simulations')
    .select('*', { count: 'exact', head: true });

  return {
    profiles: profiles || [],
    recentAnswers: recentAnswers || [],
    recentSimulations: recentSimulations || [],
    totalQuestions: totalQuestions || 0,
    totalSimulations: totalSimulations || 0
  };
};

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboardStatsReal'],
    queryFn: fetchDashboardData,
    refetchInterval: 60000,
    retry: 1
  });

  // --- PROCESSAMENTO DOS DADOS ---
  const stats = useMemo(() => {
    if (!data) return null;

    const { profiles, recentAnswers, recentSimulations } = data;

    // 1. KPIs de Usuários e Receita
    const totalUsers = profiles.length;
    const activeUsers = profiles.filter(p => p.status === 'active' || p.status === 'active ').length; 
    
    // Cálculo de Receita (MRR Estimado / Valor total de contratos ativos)
    let totalRevenue = 0;
    
    // Estrutura para armazenar valor e quantidade
    const revenueStats = {
      premium: { value: 0, count: 0 },
      pro: { value: 0, count: 0 },
      essencial: { value: 0, count: 0 },
      outros: { value: 0, count: 0 }
    };
    
    profiles.forEach(p => {
      // Verifica se o status é ativo
      const isActive = p.status && p.status.trim().toLowerCase() === 'active';
      
      if (isActive && p.plan) {
        const planKey = p.plan.toLowerCase().trim();
        let price = 0;
        let category: keyof typeof revenueStats = 'outros';

        // Lógica de Categorização Robusta
        if (planKey.includes('premium')) {
          category = 'premium';
          price = PLAN_PRICES.premium;
        } else if (planKey.includes('pro')) {
          category = 'pro';
          price = PLAN_PRICES.pro;
        } else if (planKey.includes('essencial')) {
          category = 'essencial';
          price = PLAN_PRICES.essencial;
        }

        if (price > 0) {
            totalRevenue += price;
            revenueStats[category].value += price;
            revenueStats[category].count += 1;
        }
      }
    });

    // 2. Distribuição de Planos (Pie Chart)
    const planCounts: Record<string, number> = {};
    profiles.forEach(p => {
      const plan = p.plan || 'Sem Plano';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
    });
    
    const planDistribution = Object.entries(planCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 3. Status dos Planos (Tabela)
    const planStatsMap: Record<string, { active: number, pend: number, susp: number, bloq: number }> = {};
    profiles.forEach(p => {
      const plan = p.plan || 'Sem Plano';
      if (!planStatsMap[plan]) planStatsMap[plan] = { active: 0, pend: 0, susp: 0, bloq: 0 };
      
      const status = (p.status || '').trim().toLowerCase();
      
      if (status === 'active') planStatsMap[plan].active++;
      else if (status === 'pending') planStatsMap[plan].pend++;
      else if (status === 'suspended') planStatsMap[plan].susp++;
      else if (status === 'inactive') planStatsMap[plan].bloq++;
    });

    const planStatsTable = Object.entries(planStatsMap).map(([name, counts]) => ({
      name, ...counts
    }));

    // 4. Uso Diário
    const dailyUsageMap: Record<string, { questions: number, simulations: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const dateKey = format(subDays(new Date(), i), 'dd/MM');
      dailyUsageMap[dateKey] = { questions: 0, simulations: 0 };
    }

    recentAnswers.forEach(a => {
      const dateKey = format(parseISO(a.created_at), 'dd/MM');
      if (dailyUsageMap[dateKey]) dailyUsageMap[dateKey].questions++;
    });

    recentSimulations.forEach(s => {
      const dateKey = format(parseISO(s.created_at), 'dd/MM');
      if (dailyUsageMap[dateKey]) dailyUsageMap[dateKey].simulations++;
    });

    const dailyUsageData = Object.entries(dailyUsageMap).map(([day, counts]) => ({
      day,
      questions: counts.questions,
      simulations: counts.simulations
    }));

    // 5. Pico Horário
    const hourlyMap = new Array(24).fill(0);
    recentAnswers.forEach(a => {
      const hour = getHours(parseISO(a.created_at));
      hourlyMap[hour]++;
    });

    const maxActivity = Math.max(...hourlyMap);
    const hourlyData = hourlyMap.map((count, i) => ({
      hour: `${i}h`,
      actions: count,
      isPeak: maxActivity > 0 && count >= maxActivity * 0.8
    }));

    // 6. Geografia
    const locationCounts: Record<string, number> = {};
    profiles.forEach(p => {
      if (p.location) {
        const loc = p.location.trim();
        if (loc.length > 2) { 
             locationCounts[loc] = (locationCounts[loc] || 0) + 1;
        }
      }
    });

    const geoLocations = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalUsers,
      activeUsers,
      totalRevenue,
      revenueStats,
      planDistribution,
      planStatsTable,
      dailyUsageData,
      hourlyData,
      geoLocations
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4 animate-in fade-in duration-500">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Sincronizando dados em tempo real...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="text-red-500 font-bold">Erro ao carregar dados</div>
        <p className="text-muted-foreground text-sm">{(error as Error)?.message || "Erro desconhecido"}</p>
      </div>
    );
  }

  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h2>
        <div className="flex items-center gap-2 bg-card border rounded-md p-1 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 border-r text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(thirtyDaysAgo, 'dd/MM/yyyy')}</span>
          </div>
          <span className="text-xs text-muted-foreground px-1">até</span>
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(today, 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-l-4 border-l-cyan-500 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Usuários Ativos / Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-foreground">{stats.activeUsers}</span>
                <span className="text-sm text-muted-foreground font-medium">/ {stats.totalUsers}</span>
              </div>
              <Users className="h-6 w-6 text-cyan-500 mb-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-emerald-500 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Receita Estimada (Ativos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-4">
              <div className="text-4xl font-black text-foreground">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <TrendingUp className="h-6 w-6 text-emerald-500 mb-1" />
            </div>
            <div className="space-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Premium:</span>
                    <div className="flex gap-2">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.revenueStats.premium.value)}</span>
                        <span className="bg-muted px-1.5 rounded text-[10px] flex items-center">{stats.revenueStats.premium.count} un.</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Pro:</span>
                    <div className="flex gap-2">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.revenueStats.pro.value)}</span>
                        <span className="bg-muted px-1.5 rounded text-[10px] flex items-center">{stats.revenueStats.pro.count} un.</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Essencial:</span>
                    <div className="flex gap-2">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.revenueStats.essencial.value)}</span>
                        <span className="bg-muted px-1.5 rounded text-[10px] flex items-center">{stats.revenueStats.essencial.count} un.</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-blue-500 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Engajamento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-4xl font-black text-foreground">{data?.totalQuestions.toLocaleString('pt-BR')}</div>
              <Activity className="h-6 w-6 text-blue-500 mb-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Questões respondidas na plataforma</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas Centrais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tabela Ativos por Plano */}
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <h3 className="font-bold text-sm uppercase text-green-500">Assinantes Ativos por Plano</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xs uppercase font-bold text-muted-foreground grid grid-cols-[1fr_auto] gap-4 px-6 py-3 border-b border-border/50">
              <span>Plano</span>
              <span>Qtd. Ativos</span>
            </div>
            <ScrollArea className="h-[250px]">
              <div className="divide-y divide-border/30">
                {stats.planStatsTable.map((plan, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-4 px-6 py-3 hover:bg-muted/50 transition-colors text-sm">
                    <span className="font-medium text-foreground truncate">{plan.name}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{plan.active}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tabela Status Geral */}
        <Card className="border-t-4 border-t-amber-500">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <h3 className="font-bold text-sm uppercase text-amber-500">Status Geral das Assinaturas</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xs uppercase font-bold text-muted-foreground grid grid-cols-[1fr_50px_50px_50px] gap-2 px-6 py-3 border-b border-border/50 text-right">
              <span className="text-left">Plano</span>
              <span className="text-yellow-500" title="Pendente">Pen.</span>
              <span className="text-orange-500" title="Suspenso">Sus.</span>
              <span className="text-red-500" title="Inativo">Ina.</span>
            </div>
            <ScrollArea className="h-[250px]">
              <div className="divide-y divide-border/30">
                {stats.planStatsTable.map((plan, i) => (
                  <div key={i} className="grid grid-cols-[1fr_50px_50px_50px] gap-2 px-6 py-3 hover:bg-muted/50 transition-colors text-sm text-right">
                    <span className="font-medium text-foreground text-left truncate" title={plan.name}>{plan.name}</span>
                    <span className="text-muted-foreground">{plan.pend}</span>
                    <span className="text-muted-foreground">{plan.susp}</span>
                    <span className="text-muted-foreground">{plan.bloq}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="space-y-6">
        
        {/* Gráfico de Barras - Pico Horário */}
        <Card className="bg-card border-none ring-1 ring-border shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" /> Atividade Recente por Hora (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="hour" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(var(--primary), 0.1)'}} />
                <Bar dataKey="actions" name="Respostas" radius={[4, 4, 0, 0]}>
                  {stats.hourlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isPeak ? '#fbbf24' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Linha - Uso Diário */}
          <Card className="bg-card border-none ring-1 ring-border shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-muted-foreground">Engajamento Diário (30 dias)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyUsageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="day" hide />
                  <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line yAxisId="left" type="monotone" dataKey="questions" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{r: 6}} name="Questões" />
                  <Line yAxisId="right" type="monotone" dataKey="simulations" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{r: 6}} name="Simulados" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Planos */}
          <Card className="bg-card border-none ring-1 ring-border shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-muted-foreground">Distribuição de Planos (Total)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.planDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-[-20px]">
                {stats.planDistribution.slice(0, 4).map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Listas Geográficas */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Top Localizações (Declarado pelos Usuários)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-[10px] uppercase font-bold text-muted-foreground grid grid-cols-[1fr_auto] gap-4 px-6 py-2 border-b border-border/50">
              <span>Local</span>
              <span>Usuários</span>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-border/30">
                {stats.geoLocations.length > 0 ? stats.geoLocations.map((loc, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-4 px-6 py-3 hover:bg-muted/50 transition-colors text-sm">
                    <span className="font-medium text-foreground">{loc.name}</span>
                    <span className="font-mono">{loc.count}</span>
                  </div>
                )) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">Nenhuma localização registrada nos perfis.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboard;