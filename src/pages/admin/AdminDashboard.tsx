import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Tooltip as RechartsTooltip, AreaChart, Area
} from "recharts";
import { Users, Activity, Calendar, MapPin, Brain, DollarSign, TrendingUp, AlertOctagon, ArrowUpRight, Crown, CreditCard, ShieldCheck } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { subDays, format, parseISO, getHours } from "date-fns";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- CORES ---
const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

// --- PREÇOS ---
const PLAN_PRICES: Record<string, number> = {
  'premium': 197.00,
  'pro': 97.00,
  'essencial': 67.00,
  'free': 0.00
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-md border p-3 rounded-xl shadow-xl text-xs z-50 ring-1 ring-border/50">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
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

const fetchDashboardData = async () => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30).toISOString();

  // 1. Perfis
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, plan, status, location');
  if (profilesError) throw profilesError;

  // 2. Respostas
  const { data: recentAnswers, error: answersError } = await supabase
    .from('user_question_answers')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo)
    .limit(5000);
  if (answersError) console.error(answersError);

  // 3. Simulados
  const { data: recentSimulations, error: simulationsError } = await supabase
    .from('user_simulations')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo)
    .limit(1000);
  if (simulationsError) console.error(simulationsError);

  // 4. Totais
  const { count: totalQuestions } = await supabase.from('user_question_answers').select('*', { count: 'exact', head: true });
  const { count: totalSimulations } = await supabase.from('user_simulations').select('*', { count: 'exact', head: true });

  return { profiles: profiles || [], recentAnswers: recentAnswers || [], recentSimulations: recentSimulations || [], totalQuestions: totalQuestions || 0, totalSimulations: totalSimulations || 0 };
};

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboardStatsReal'],
    queryFn: fetchDashboardData,
    refetchInterval: 60000,
    retry: 1
  });

  const stats = useMemo(() => {
    if (!data) return null;
    const { profiles, recentAnswers, recentSimulations } = data;

    const totalUsers = profiles.length;
    const activeUsers = profiles.filter(p => p.status === 'active' || p.status === 'active ').length; 
    
    let totalRevenue = 0;
    const revenueStats = { premium: { value: 0, count: 0 }, pro: { value: 0, count: 0 }, essencial: { value: 0, count: 0 }, outros: { value: 0, count: 0 } };
    
    profiles.forEach(p => {
      const isActive = p.status && p.status.trim().toLowerCase() === 'active';
      if (isActive && p.plan) {
        const planKey = p.plan.toLowerCase().trim();
        let price = 0;
        let category: keyof typeof revenueStats = 'outros';

        if (planKey.includes('premium')) { category = 'premium'; price = PLAN_PRICES.premium; }
        else if (planKey.includes('pro')) { category = 'pro'; price = PLAN_PRICES.pro; }
        else if (planKey.includes('essencial')) { category = 'essencial'; price = PLAN_PRICES.essencial; }

        if (price > 0) {
            totalRevenue += price;
            revenueStats[category].value += price;
            revenueStats[category].count += 1;
        }
      }
    });

    const planCounts: Record<string, number> = {};
    const planStatsMap: Record<string, { active: number, pend: number, susp: number, bloq: number }> = {};
    
    profiles.forEach(p => {
      const plan = p.plan || 'Sem Plano';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
      
      if (!planStatsMap[plan]) planStatsMap[plan] = { active: 0, pend: 0, susp: 0, bloq: 0 };
      const status = (p.status || '').trim().toLowerCase();
      if (status === 'active') planStatsMap[plan].active++;
      else if (status === 'pending') planStatsMap[plan].pend++;
      else if (status === 'suspended') planStatsMap[plan].susp++;
      else if (status === 'inactive') planStatsMap[plan].bloq++;
    });

    const planDistribution = Object.entries(planCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    
    const planStatsTable = Object.entries(planStatsMap)
      .map(([name, counts]) => ({ name, ...counts, totalIssues: counts.pend + counts.susp + counts.bloq }))
      .sort((a, b) => b.totalIssues - a.totalIssues); 

    const dailyUsageMap: Record<string, { questions: number, simulations: number }> = {};
    for (let i = 29; i >= 0; i--) { dailyUsageMap[format(subDays(new Date(), i), 'dd/MM')] = { questions: 0, simulations: 0 }; }

    recentAnswers.forEach(a => { const d = format(parseISO(a.created_at), 'dd/MM'); if (dailyUsageMap[d]) dailyUsageMap[d].questions++; });
    recentSimulations.forEach(s => { const d = format(parseISO(s.created_at), 'dd/MM'); if (dailyUsageMap[d]) dailyUsageMap[d].simulations++; });

    const dailyUsageData = Object.entries(dailyUsageMap).map(([day, counts]) => ({ day, ...counts }));

    const hourlyMap = new Array(24).fill(0);
    recentAnswers.forEach(a => hourlyMap[getHours(parseISO(a.created_at))]++);
    const hourlyData = hourlyMap.map((count, i) => ({ hour: `${i}h`, actions: count, isPeak: count >= Math.max(...hourlyMap) * 0.8 }));

    const locationCounts: Record<string, number> = {};
    profiles.forEach(p => { if (p.location && p.location.trim().length > 2) locationCounts[p.location.trim()] = (locationCounts[p.location.trim()] || 0) + 1; });
    const geoLocations = Object.entries(locationCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);

    return { totalUsers, activeUsers, totalRevenue, revenueStats, planDistribution, planStatsTable, dailyUsageData, hourlyData, geoLocations };
  }, [data]);

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (error || !stats) return <div className="text-center p-10 text-red-500">Erro ao carregar dados.</div>;

  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard Administrativo</h2>
        <div className="flex items-center gap-2 bg-card border rounded-md p-1 shadow-sm text-xs sm:text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 border-r text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(thirtyDaysAgo, 'dd/MM')}</span>
          </div>
          <span className="text-muted-foreground px-1">até</span>
          <div className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(today, 'dd/MM')}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* REVENUE CARD */}
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-24 h-24 sm:w-32 sm:h-32" /></div>
          <CardContent className="p-5 sm:p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-100" /></div>
              <Badge variant="secondary" className="bg-emerald-400/20 text-emerald-50 border-0 text-[10px] sm:text-xs">MRR Estimado</Badge>
            </div>
            <div className="space-y-1 mb-6">
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium">Receita de assinaturas ativas</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div className="sm:border-r border-white/10 pr-2">
                <p className="text-[10px] uppercase font-bold text-emerald-200/70 mb-0.5">Premium</p>
                <div className="flex items-baseline justify-between sm:block">
                    <p className="font-bold text-xs">{formatCurrency(stats.revenueStats.premium.value)}</p>
                    <p className="text-[10px] text-emerald-100">{stats.revenueStats.premium.count} ass.</p>
                </div>
              </div>
              <div className="sm:border-r border-white/10 px-0 sm:px-2">
                <p className="text-[10px] uppercase font-bold text-emerald-200/70 mb-0.5">Pro</p>
                <div className="flex items-baseline justify-between sm:block">
                    <p className="font-bold text-xs">{formatCurrency(stats.revenueStats.pro.value)}</p>
                    <p className="text-[10px] text-emerald-100">{stats.revenueStats.pro.count} ass.</p>
                </div>
              </div>
              <div className="pl-0 sm:pl-2">
                <p className="text-[10px] uppercase font-bold text-emerald-200/70 mb-0.5">Essencial</p>
                <div className="flex items-baseline justify-between sm:block">
                    <p className="font-bold text-xs">{formatCurrency(stats.revenueStats.essencial.value)}</p>
                    <p className="text-[10px] text-emerald-100">{stats.revenueStats.essencial.count} ass.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* USERS CARD */}
        <Card className="relative overflow-hidden border-none shadow-lg bg-card group hover:shadow-xl transition-all duration-300">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors" />
           <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
             <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Base de Usuários</CardTitle>
             <Users className="h-4 w-4 text-blue-500" />
           </CardHeader>
           <CardContent className="relative z-10">
             <div className="flex items-baseline gap-2 mb-1">
               <span className="text-3xl sm:text-4xl font-black text-foreground">{stats.activeUsers}</span>
               <span className="text-xs sm:text-sm text-muted-foreground">ativos</span>
             </div>
             <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }} />
             </div>
             <p className="text-xs text-muted-foreground">de um total de <strong>{stats.totalUsers}</strong> cadastros.</p>
           </CardContent>
        </Card>

        {/* ENGAGEMENT CARD */}
        <Card className="relative overflow-hidden border-none shadow-lg bg-card group hover:shadow-xl transition-all duration-300">
           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 group-hover:from-orange-500/10 group-hover:to-red-500/10 transition-colors" />
           <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
             <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Engajamento Total</CardTitle>
             <Activity className="h-4 w-4 text-orange-500" />
           </CardHeader>
           <CardContent className="relative z-10">
             <div className="flex items-baseline gap-2 mb-1">
               <span className="text-3xl sm:text-4xl font-black text-foreground">{data?.totalQuestions.toLocaleString('pt-BR')}</span>
               <span className="text-xs sm:text-sm text-muted-foreground">questões</span>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-600"><Brain className="w-3 h-3" /></div>
                  <span className="text-xs font-medium">Banca</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-red-600"><ShieldCheck className="w-3 h-3" /></div>
                  <span className="text-xs font-medium">{data?.totalSimulations} Sims</span>
                </div>
             </div>
           </CardContent>
        </Card>
      </div>

      {/* SECTION 2: SUBSCRIPTION MONITOR (Updated Table with Horizontal Scroll) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tabela Status Geral - Atualizada */}
        <Card className="lg:col-span-2 border-t-4 border-t-amber-500">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4 text-amber-500" />
                  <h3 className="font-bold text-sm uppercase text-amber-500">Monitor de Assinaturas</h3>
               </div>
               <Badge variant="outline" className="text-[10px]">Por Criticidade</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <ScrollArea className="h-[300px]">
                <div className="min-w-[600px]">
                    <div className="text-xs uppercase font-bold text-muted-foreground grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr] gap-1 px-4 py-3 border-b border-border/50 text-center sticky top-0 bg-card z-10">
                    <span className="text-left">Plano</span>
                    <span className="text-yellow-600 font-extrabold" title="Pendente">Pend.</span>
                    <span className="text-orange-600 font-extrabold" title="Suspenso">Susp.</span>
                    <span className="text-red-600 font-extrabold" title="Inativo">Inat.</span>
                    <span className="text-muted-foreground pl-2" title="Total de não ativos">Total</span>
                    </div>
                    <div className="divide-y divide-border/30">
                    {stats.planStatsTable.map((plan, i) => (
                        <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr] gap-1 px-4 py-3 hover:bg-muted/50 transition-colors text-sm text-center items-center">
                            <span className="font-medium text-foreground text-left truncate text-xs sm:text-sm" title={plan.name}>{plan.name}</span>
                            <span className="text-yellow-600 font-bold bg-yellow-50 dark:bg-yellow-900/20 rounded py-0.5">{plan.pend}</span>
                            <span className="text-orange-600 font-bold bg-orange-50 dark:bg-orange-900/20 rounded py-0.5">{plan.susp}</span>
                            <span className="text-red-600 font-bold bg-red-50 dark:bg-red-900/20 rounded py-0.5">{plan.bloq}</span>
                            <span className="text-muted-foreground font-mono text-xs pl-2">{plan.totalIssues}</span>
                        </div>
                    ))}
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
             </ScrollArea>
          </CardContent>
        </Card>

        {/* PIE CHART - PLAN DISTRIBUTION */}
        <Card className="border-none shadow-md ring-1 ring-border/50 flex flex-col">
           <CardHeader className="pb-2 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-500" /> Share de Planos</CardTitle>
           </CardHeader>
           <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={stats.planDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                          {stats.planDistribution.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                       </Pie>
                       <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="w-full space-y-2 mt-2">
                 {stats.planDistribution.slice(0, 3).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-muted-foreground truncate max-w-[120px]">{entry.name}</span>
                       </div>
                       <span className="font-bold">{entry.value}</span>
                    </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Tabela Ativos por Plano */}
      <div className="grid grid-cols-1">
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <h3 className="font-bold text-sm uppercase text-green-500">Assinantes Ativos por Plano</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xs uppercase font-bold text-muted-foreground grid grid-cols-[1fr_auto] gap-4 px-6 py-3 border-b border-border/50 bg-muted/20">
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
      </div>

      {/* SECTION 3: GRAPHS & GEO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Usage Chart */}
         <Card className="border-none shadow-md ring-1 ring-border/50">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-purple-500" /> Engajamento Diário</CardTitle>
               <CardDescription>Volume de questões e simulados (30 dias).</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.dailyUsageData}>
                     <defs>
                        <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                     <XAxis dataKey="day" hide />
                     <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                     <RechartsTooltip content={<CustomTooltip />} />
                     <Area type="monotone" dataKey="questions" stroke="#10b981" fillOpacity={1} fill="url(#colorQ)" name="Questões" strokeWidth={2} />
                     <Area type="monotone" dataKey="simulations" stroke="#3b82f6" fill="transparent" name="Simulados" strokeWidth={2} />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Geo Map List */}
         <Card className="border-none shadow-md ring-1 ring-border/50">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Top Localizações</CardTitle>
               <CardDescription>Concentração geográfica de usuários.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[250px] sm:h-[300px] px-6">
                  <div className="space-y-4 pt-2 pb-4">
                     {stats.geoLocations.map((loc, i) => (
                        <div key={i} className="flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                              <span className="text-xs sm:text-sm font-medium text-foreground">{loc.name}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-16 sm:w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                 <div className="h-full bg-red-500 rounded-full" style={{ width: `${(loc.count / stats.totalUsers) * 100}%` }} />
                              </div>
                              <span className="text-xs font-mono text-muted-foreground w-6 text-right">{loc.count}</span>
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

export default AdminDashboard;