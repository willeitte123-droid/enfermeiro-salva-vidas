import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Tooltip as RechartsTooltip, AreaChart, Area
} from "recharts";
import { Users, Activity, Calendar, MapPin, Brain, DollarSign, TrendingUp, AlertOctagon, ArrowUpRight, Crown, CreditCard, ShieldCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      .sort((a, b) => b.totalIssues - a.totalIssues); // Ordena por quem tem mais problemas

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

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* SECTION 1: MAIN METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* REVENUE CARD */}
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white">
          <div className="absolute top-0 right-0 p-6 opacity-10"><DollarSign className="w-32 h-32" /></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><TrendingUp className="h-6 w-6 text-emerald-100" /></div>
              <Badge variant="secondary" className="bg-emerald-400/20 text-emerald-50 border-0">MRR Estimado</Badge>
            </div>
            <div className="space-y-1 mb-6">
              <h3 className="text-4xl font-black tracking-tight">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-emerald-100 text-sm font-medium">Receita de assinaturas ativas</p>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-200/70 mb-1">Premium</p>
                <p className="font-bold text-sm">{formatCurrency(stats.revenueStats.premium.value)}</p>
                <p className="text-[10px] text-emerald-100">{stats.revenueStats.premium.count} ass.</p>
              </div>
              <div className="border-l border-white/10 pl-2">
                <p className="text-[10px] uppercase font-bold text-emerald-200/70 mb-1">Pro</p>
                <p className="font-bold text-sm">{formatCurrency(stats.revenueStats.pro.value)}</p>
                <p className="text-[10px] text-emerald-100">{stats.revenueStats.pro.count} ass.</p>
              </div>
              <div className="border-l border-white/10 pl-2">
                <p className="text-[10px] uppercase font-bold text-emerald-200/70 mb-1">Essencial</p>
                <p className="font-bold text-sm">{formatCurrency(stats.revenueStats.essencial.value)}</p>
                <p className="text-[10px] text-emerald-100">{stats.revenueStats.essencial.count} ass.</p>
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
               <span className="text-3xl font-black text-foreground">{stats.activeUsers}</span>
               <span className="text-sm text-muted-foreground">ativos</span>
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
               <span className="text-3xl font-black text-foreground">{data?.totalQuestions.toLocaleString('pt-BR')}</span>
               <span className="text-sm text-muted-foreground">questões</span>
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

      {/* SECTION 2: SUBSCRIPTION MONITOR (Updated Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-md ring-1 ring-border/50">
          <CardHeader className="pb-2 border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2"><AlertOctagon className="w-4 h-4 text-amber-500" /> Status Geral das Assinaturas</CardTitle>
                  <CardDescription className="text-xs mt-1">Monitoramento de inadimplência e churn por plano.</CardDescription>
               </div>
               <Badge variant="outline" className="bg-background">Ordenado por Criticidade</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <ScrollArea className="h-[300px]">
                <table className="w-full text-sm text-left">
                   <thead className="text-xs text-muted-foreground uppercase bg-muted/30 font-bold">
                      <tr>
                         <th className="px-6 py-3">Plano</th>
                         <th className="px-4 py-3 text-center">Ativos</th>
                         <th className="px-4 py-3 text-center text-yellow-600">Pendente</th>
                         <th className="px-4 py-3 text-center text-orange-600">Suspenso</th>
                         <th className="px-4 py-3 text-center text-red-600">Inativo</th>
                         <th className="px-6 py-3 text-right">Total Problemas</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border/40">
                      {stats.planStatsTable.map((plan, i) => (
                         <tr key={i} className="hover:bg-muted/40 transition-colors group">
                            <td className="px-6 py-3 font-medium text-foreground">
                               <div className="flex items-center gap-2">
                                  {plan.name.toLowerCase().includes('premium') && <Crown className="w-3 h-3 text-yellow-500" />}
                                  <span className="truncate max-w-[150px]" title={plan.name}>{plan.name}</span>
                               </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                               <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 border-0">
                                  {plan.active}
                               </Badge>
                            </td>
                            <td className="px-4 py-3 text-center font-mono text-muted-foreground group-hover:text-yellow-600 transition-colors">{plan.pend > 0 ? plan.pend : '-'}</td>
                            <td className="px-4 py-3 text-center font-mono text-muted-foreground group-hover:text-orange-600 transition-colors">{plan.susp > 0 ? plan.susp : '-'}</td>
                            <td className="px-4 py-3 text-center font-mono text-muted-foreground group-hover:text-red-600 transition-colors">{plan.bloq > 0 ? plan.bloq : '-'}</td>
                            <td className="px-6 py-3 text-right">
                               <span className={cn("font-bold", plan.totalIssues > 0 ? "text-red-500" : "text-muted-foreground/30")}>
                                  {plan.totalIssues}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </ScrollArea>
          </CardContent>
        </Card>

        {/* PIE CHART - PLAN DISTRIBUTION */}
        <Card className="border-none shadow-md ring-1 ring-border/50 flex flex-col">
           <CardHeader className="pb-2 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-base font-bold flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-500" /> Share de Planos</CardTitle>
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

      {/* SECTION 3: GRAPHS & GEO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Usage Chart */}
         <Card className="border-none shadow-md ring-1 ring-border/50">
            <CardHeader className="pb-2">
               <CardTitle className="text-base font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-purple-500" /> Engajamento Diário</CardTitle>
               <CardDescription>Volume de questões e simulados (30 dias).</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
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
               <CardTitle className="text-base font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Top Localizações</CardTitle>
               <CardDescription>Concentração geográfica de usuários.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[300px] px-6">
                  <div className="space-y-4 pt-2 pb-4">
                     {stats.geoLocations.map((loc, i) => (
                        <div key={i} className="flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                              <span className="text-sm font-medium text-foreground">{loc.name}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                 <div className="h-full bg-red-500 rounded-full" style={{ width: `${(loc.count / stats.totalUsers) * 100}%` }} />
                              </div>
                              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{loc.count}</span>
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