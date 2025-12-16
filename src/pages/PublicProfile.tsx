import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, FileQuestion, Percent, Timer, Trophy, Calendar, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  bio: string;
  role: string;
  profession?: string;
  specializations?: string[];
}

interface CategoryStat {
  name: string;
  accuracy: number;
  total: number;
}

const getBarColor = (accuracy: number) => {
  if (accuracy >= 70) return "#10b981"; // emerald-500
  if (accuracy >= 50) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur border rounded-lg shadow-xl p-3 text-xs sm:text-sm">
        <p className="font-bold text-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].fill }} />
          <span className="text-muted-foreground">Aproveitamento:</span>
          <span className="font-bold">{payload[0].value}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {payload[0].payload.total} questões respondidas
        </p>
      </div>
    );
  }
  return null;
};

const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return data as Profile;
};

const fetchUserStats = async (userId: string) => {
  // Executa as queries em paralelo
  const simulationsPromise = supabase
    .from("user_simulations")
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  const statsPromise = supabase.rpc('get_user_performance_stats', { p_user_id: userId });

  const [simulationsResult, statsResult] = await Promise.all([simulationsPromise, statsPromise]);

  if (simulationsResult.error) console.error("Simulations Error:", simulationsResult.error);
  if (statsResult.error) console.error("Stats Error:", statsResult.error);

  const { totalQuestions = 0, correctQuestions = 0, categoryStats = [] } = statsResult.data || {};
  
  // Ordena categorias por aproveitamento (maior para menor)
  const sortedCategoryStats = categoryStats 
    ? categoryStats.sort((a: CategoryStat, b: CategoryStat) => b.accuracy - a.accuracy) 
    : [];

  return {
    simulations: simulationsResult.data || [],
    categoryStats: sortedCategoryStats,
    totalQuestions,
    correctQuestions,
  };
};

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  // Query 1: Dados Básicos do Perfil
  const { data: profile, isLoading: isLoadingProfile, isError: isProfileError } = useQuery({
    queryKey: ['publicProfileBase', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
    staleTime: 0, // Garante que sempre busca dados novos ao montar
    refetchOnMount: true
  });

  // Query 2: Estatísticas (Atualiza sempre)
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['publicProfileStats', userId],
    queryFn: () => fetchUserStats(userId!),
    enabled: !!userId,
    staleTime: 0, // Garante que sempre busca dados novos ao montar
    refetchOnMount: true
  });

  const { simulations, categoryStats, totalQuestions, correctQuestions } = stats || {};

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Carregando perfil...</p>
      </div>
    );
  }

  if (isProfileError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="bg-muted p-4 rounded-full">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Usuário não encontrado</h2>
          <p className="text-muted-foreground">O perfil que você está procurando não existe ou não pôde ser carregado.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/ranking"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Ranking</Link>
        </Button>
      </div>
    );
  }
  
  const getInitials = () => {
    const firstName = profile?.first_name?.[0] || '';
    const lastName = profile?.last_name?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  const questionAccuracy = totalQuestions && totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Botão Voltar Flutuante */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button asChild size="icon" className="rounded-full shadow-lg h-12 w-12">
          <Link to="/ranking"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
      </div>

      <div className="hidden md:block">
        <Button asChild variant="ghost" size="sm" className="hover:bg-transparent hover:text-primary pl-0">
          <Link to="/ranking" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Voltar para o Ranking</Link>
        </Button>
      </div>
      
      {/* Header do Perfil */}
      <div className="relative">
        {/* Capa com Gradiente */}
        <div className="h-32 md:h-48 w-full rounded-t-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Card de Informações Principais */}
        <div className="bg-card border-x border-b rounded-b-2xl shadow-sm px-6 pb-6 relative pt-16 md:pt-20 text-center md:text-left">
          
          {/* Avatar Flutuante */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-card shadow-xl ring-2 ring-primary/10">
              <AvatarImage src={profile.avatar_url} alt={`Avatar de ${profile.first_name}`} className="object-cover" />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="md:pl-48 space-y-4">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {profile.first_name} {profile.last_name}
                </h1>
                {profile.role === 'admin' && (
                  <Badge variant="default" className="bg-red-500 hover:bg-red-600 w-fit mx-auto md:mx-0">Admin</Badge>
                )}
              </div>
              <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                {profile.profession || "Estudante de Enfermagem"}
              </p>
            </div>

            {/* Chips de Especialização */}
            {profile.specializations && profile.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {profile.specializations.map((spec, i) => (
                  <Badge key={i} variant="secondary" className="px-2 py-0.5 text-xs font-normal bg-secondary/50">
                    {spec}
                  </Badge>
                ))}
              </div>
            )}

            {/* Bio */}
            <div className="max-w-2xl text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50 mx-auto md:mx-0">
              {profile.bio || "Este usuário ainda não escreveu uma biografia."}
            </div>
          </div>
        </div>
      </div>

      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cards de Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-card to-blue-50/50 dark:to-blue-950/10 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Questões</span>
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-600"><FileQuestion className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{totalQuestions || 0}</span>
                  <p className="text-xs text-muted-foreground mt-1">Resolvidas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-green-50/50 dark:to-green-950/10 border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Precisão</span>
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md text-green-600"><Percent className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{questionAccuracy}%</span>
                  <p className="text-xs text-muted-foreground mt-1">Acerto Geral</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-amber-50/50 dark:to-amber-950/10 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Simulados</span>
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-md text-amber-600"><Timer className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{simulations?.length || 0}</span>
                  <p className="text-xs text-muted-foreground mt-1">Realizados</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-purple-50/50 dark:to-purple-950/10 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ranking</span>
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md text-purple-600"><Trophy className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    {correctQuestions}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">Pontos (XP)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Gráfico de Desempenho */}
            <Card className="shadow-md border-t-4 border-t-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Medal className="h-5 w-5 text-primary" /> 
                  Desempenho por Disciplina
                </CardTitle>
                <CardDescription>Análise de aproveitamento nas matérias estudadas.</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryStats && categoryStats.length > 0 ? (
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.3} />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={100} 
                          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                          interval={0}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
                        <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={20}>
                          <LabelList 
                            dataKey="accuracy" 
                            position="right" 
                            formatter={(value: number) => `${value}%`} 
                            fontSize={12} 
                            className="fill-foreground font-bold" 
                          />
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.accuracy)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                    <FileQuestion className="h-10 w-10 mb-3 opacity-20" />
                    <p className="text-sm">Nenhum dado de desempenho disponível ainda.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Histórico Recente */}
            <Card className="shadow-md border-t-4 border-t-amber-500/50 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  Últimos Simulados
                </CardTitle>
                <CardDescription>Histórico de atividades recentes.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {simulations && simulations.length > 0 ? (
                  <ScrollArea className="h-[350px]">
                    <div className="divide-y divide-border/50">
                      {simulations.slice(0, 10).map((sim: any) => (
                        <div key={sim.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-sm">Simulado #{sim.score}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(sim.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <span className="block text-xs text-muted-foreground uppercase font-bold">Tempo</span>
                              <span className="text-sm font-mono">{formatTime(sim.time_taken_seconds)}</span>
                            </div>
                            <div className="text-right">
                              <Badge variant={sim.percentage >= 70 ? "default" : sim.percentage >= 50 ? "secondary" : "destructive"} className="text-xs font-bold px-2">
                                {sim.percentage}%
                              </Badge>
                              <span className="block text-[10px] text-muted-foreground mt-0.5 text-center">Acerto</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground bg-muted/10">
                    <Timer className="h-10 w-10 mb-3 opacity-20" />
                    <p className="text-sm">Nenhum simulado realizado ainda.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;