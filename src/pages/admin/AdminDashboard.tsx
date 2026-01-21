import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Tooltip as RechartsTooltip 
} from "recharts";
import { Users, DollarSign, Activity, Calendar, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Mock Data para simular a visualização (Substituir por dados reais da API futuramente)
const HOURLY_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}h`,
  actions: i >= 17 && i <= 19 ? Math.floor(Math.random() * 500) + 3000 : Math.floor(Math.random() * 1000) + 500,
  isPeak: i >= 17 && i <= 19
}));

const DAILY_USAGE_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  credits: Math.floor(Math.random() * 10000) + 5000,
  logs: Math.floor(Math.random() * 2000) + 500
}));

const PLAN_DISTRIBUTION = [
  { name: 'Starter', value: 45, color: '#0ea5e9' }, // Cyan/Blue
  { name: 'Premium', value: 25, color: '#6366f1' }, // Indigo
  { name: 'Bee', value: 15, color: '#8b5cf6' }, // Violet
  { name: 'Professional', value: 10, color: '#ec4899' }, // Pink
  { name: 'Outros', value: 5, color: '#64748b' }, // Slate
];

const PLAN_STATS = [
  { name: "Starter", active: 193, pend: 0, susp: 331, bloq: 50 },
  { name: "Premium", active: 118, pend: 1, susp: 85, bloq: 11 },
  { name: "Bee", active: 60, pend: 1, susp: 0, bloq: 0 },
  { name: "Professional", active: 11, pend: 0, susp: 2, bloq: 0 },
  { name: "Starter Anual", active: 11, pend: 0, susp: 0, bloq: 0 },
  { name: "Premium Anual", active: 8, pend: 0, susp: 1, bloq: 0 },
  { name: "Free", active: 1, pend: 14, susp: 0, bloq: 1 },
  { name: "Sem Plano", active: 0, pend: 865, susp: 2, bloq: 1 },
];

const GEO_CITIES = [
  { name: "São Paulo, Brazil", count: 40 },
  { name: "Rio de Janeiro, Brazil", count: 34 },
  { name: "Rio Branco, Brazil", count: 23 },
  { name: "Lisbon, Portugal", count: 17 },
  { name: "Fortaleza, Brazil", count: 15 },
  { name: "Belo Horizonte, Brazil", count: 14 },
  { name: "Palhoça, Brazil", count: 14 },
  { name: "Brasília, Brazil", count: 13 },
];

const GEO_COUNTRIES = [
  { name: "Brazil", count: 858 },
  { name: "Portugal", count: 50 },
  { name: "United States", count: 8 },
  { name: "Canada", count: 3 },
  { name: "Germany", count: 2 },
  { name: "Spain", count: 2 },
  { name: "United Kingdom", count: 2 },
  { name: "Argentina", count: 1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded-md shadow-xl text-xs">
        <p className="font-bold text-slate-200">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  // Calculando totais para os cards superiores
  const totalUsers = 403; // Mock
  const mrr = 37544.10; // Mock
  const totalCredits = 397472; // Mock

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header com Datepicker simulado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h2>
        <div className="flex items-center gap-2 bg-card border rounded-md p-1">
          <div className="flex items-center gap-2 px-3 py-1.5 border-r text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>23/12/2025</span>
          </div>
          <span className="text-sm px-1 text-muted-foreground">até</span>
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>21/01/2026</span>
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
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total de Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-4xl font-black text-foreground">{totalUsers}</div>
              <Users className="h-6 w-6 text-cyan-500 mb-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-emerald-500 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">MRR (Receita Mensal)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-4xl font-black text-foreground">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mrr)}
              </div>
              <DollarSign className="h-6 w-6 text-emerald-500 mb-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-blue-500 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Créditos Gastos (Período)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-4xl font-black text-foreground">{totalCredits.toLocaleString('pt-BR')}</div>
              <Activity className="h-6 w-6 text-blue-500 mb-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas Centrais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tabela Ativos */}
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <h3 className="font-bold text-sm uppercase text-green-500">Controle de Assinantes Ativos</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xs uppercase font-bold text-muted-foreground grid grid-cols-[1fr_auto] gap-4 px-6 py-3 border-b border-border/50">
              <span>Plano</span>
              <span>Qtd. Ativos</span>
            </div>
            <ScrollArea className="h-[250px]">
              <div className="divide-y divide-border/30">
                {PLAN_STATS.map((plan, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-4 px-6 py-3 hover:bg-muted/50 transition-colors text-sm">
                    <span className="font-medium text-foreground">{plan.name}</span>
                    <span className="font-bold text-white">{plan.active}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tabela Suspensos/Bloqueados */}
        <Card className="border-t-4 border-t-amber-500">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <h3 className="font-bold text-sm uppercase text-amber-500">Assinaturas Suspensas/Bloqueadas</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xs uppercase font-bold text-muted-foreground grid grid-cols-[1fr_60px_60px_60px] gap-2 px-6 py-3 border-b border-border/50 text-right">
              <span className="text-left">Plano</span>
              <span className="text-yellow-500">Pend.</span>
              <span className="text-orange-500">Susp.</span>
              <span className="text-red-500">Bloq.</span>
            </div>
            <ScrollArea className="h-[250px]">
              <div className="divide-y divide-border/30">
                {PLAN_STATS.map((plan, i) => (
                  <div key={i} className="grid grid-cols-[1fr_60px_60px_60px] gap-2 px-6 py-3 hover:bg-muted/50 transition-colors text-sm text-right">
                    <span className="font-medium text-foreground text-left">{plan.name}</span>
                    <span>{plan.pend}</span>
                    <span>{plan.susp}</span>
                    <span>{plan.bloq}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <Card className="p-6 border-0 bg-transparent shadow-none px-0">
        <div className="space-y-6">
          
          {/* Gráfico de Barras - Pico */}
          <Card className="bg-card border-none ring-1 ring-border shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-muted-foreground">Horários de Pico (Ações por Hora)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOURLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="actions" radius={[4, 4, 0, 0]}>
                    {HOURLY_DATA.map((entry, index) => (
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
                <CardTitle className="text-sm font-bold text-muted-foreground">Uso Diário (Créditos e Logs)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DAILY_USAGE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="day" hide />
                    <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line yAxisId="left" type="monotone" dataKey="credits" stroke="#22d3ee" strokeWidth={2} dot={{r: 3, fill: '#22d3ee'}} activeDot={{r: 6}} name="Créditos" />
                    <Line yAxisId="right" type="monotone" dataKey="logs" stroke="#f87171" strokeWidth={2} dot={{r: 3, fill: '#f87171'}} activeDot={{r: 6}} name="Logs" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Pizza - Planos */}
            <Card className="bg-card border-none ring-1 ring-border shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-muted-foreground">Usuários por Plano (Total)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PLAN_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {PLAN_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>

      {/* Listas Geográficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Usuários por Cidade
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-[10px] uppercase font-bold text-muted-foreground grid grid-cols-[1fr_auto] gap-4 px-6 py-2 border-b border-border/50">
              <span>Cidade</span>
              <span>Usuários</span>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-border/30">
                {GEO_CITIES.map((city, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-4 px-6 py-3 hover:bg-muted/50 transition-colors text-sm">
                    <span className="font-medium text-foreground">{city.name}</span>
                    <span className="font-mono">{city.count}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Usuários por País
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-[10px] uppercase font-bold text-muted-foreground grid grid-cols-[1fr_auto] gap-4 px-6 py-2 border-b border-border/50">
              <span>País</span>
              <span>Usuários</span>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-border/30">
                {GEO_COUNTRIES.map((country, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-4 px-6 py-3 hover:bg-muted/50 transition-colors text-sm">
                    <span className="font-medium text-foreground">{country.name}</span>
                    <span className="font-mono">{country.count}</span>
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