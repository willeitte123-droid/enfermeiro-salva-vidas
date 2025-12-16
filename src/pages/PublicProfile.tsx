import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, FileQuestion, Percent, Timer, Trophy, Calendar, Medal, Star, Lock, Zap, AlertTriangle, Brain, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { BADGES } from "@/data/badges";

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

interface UserBadge {
  badge_code: string;
  earned_at: string;
}

const getBarColor = (accuracy: number) => {
  if (accuracy >= 70) return "#10b981"; // emerald-500
  if (accuracy >= 50) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur border rounded-lg shadow-xl p-3 text-xs sm:text-sm ring-1 ring-border/50">
        <p className="font-bold text-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].stroke || payload[0].fill }} />
          <span className="text-muted-foreground">{payload[0].name === 'Aproveitamento' ? 'Nota' : payload[0].name}:</span>
          <span className="font-bold">{payload[0].value}%</span>
        </div>
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
  const simulationsPromise = supabase
    .from("user_simulations")
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  const statsPromise = supabase.rpc('get_user_performance_stats', { p_user_id: userId });

  const badgesPromise = supabase
    .from("user_badges")
    .select('*')
    .eq('user_id', userId);

  const [simulationsResult, statsResult, badgesResult] = await Promise.all([
    simulationsPromise, 
    statsPromise,
    badgesPromise
  ]);

  if (simulationsResult.error) console.error("Simulations Error:", simulationsResult.error);
  if (statsResult.error) console.error("Stats Error:", statsResult.error);
  if (badgesResult.error) console.error("Badges Error:", badgesResult.error);

  const { totalQuestions = 0, correctQuestions = 0, categoryStats = [] } = statsResult.data || {};
  
  // Ordena categorias por aproveitamento (maior para menor) para a lista
  const sortedCategoryStats = categoryStats 
    ? categoryStats.sort((a: CategoryStat, b: CategoryStat) => b.accuracy - a.accuracy) 
    : [];

  return {
    simulations: simulationsResult.data || [],
    categoryStats: sortedCategoryStats,
    badges: (badgesResult.data as UserBadge[]) || [],
    totalQuestions,
    correctQuestions,
  };
};

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: profile, isLoading: isLoadingProfile, isError: isProfileError } = useQuery({
    queryKey: ['publicProfileBase', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
    staleTime: 0, 
    refetchOnMount: true
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['publicProfileStats', userId],
    queryFn: () => fetchUserStats(userId!),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: true
  });

  const { simulations, categoryStats, badges, totalQuestions, correctQuestions } = stats || {};

  // Processamento de Dados para Gráficos (Memoizado)
  const processedData = useMemo(() => {
    if (!stats) return null;

    // Pontos Fortes e Fracos
    const validCategories = (categoryStats || []).filter((c: CategoryStat) => c.total >= 1);
    const strengths = validCategories.filter((c: CategoryStat) => c.accuracy >= 60).slice(0, 3);
    const weaknesses = validCategories.filter((c: CategoryStat) => c.accuracy < 60).sort((a: CategoryStat, b: CategoryStat) => a.accuracy - b.accuracy).slice(0, 3);

    // Dados para o Radar (Top 6 categorias com mais questões para não poluir)
    const radarData = [...validCategories]
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map(cat => ({
        subject: cat.name.length > 15 ? cat.name.substring(0, 12) + '...' : cat.name,
        fullSubject: cat.name,
        Aproveitamento: cat.accuracy,
        fullMark: 100
      }));

    // Dados para Evolução (Inverter ordem para cronológica)
    const evolutionData = [...(simulations || [])]
      .reverse()
      .map((sim: any) => ({
        date: format(new Date(sim.created_at), 'dd/MM'),
        Aproveitamento: sim.percentage,
        Score: sim.score
      }));

    return { strengths, weaknesses, radarData, evolutionData };
  }, [stats]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getInitials = () => {
    const firstName = profile?.first_name?.[0] || '';
    const lastName = profile?.last_name?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  const questionAccuracy = totalQuestions && totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

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

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Botão Voltar */}
      <div className="hidden md:block">
        <Button asChild variant="ghost" size="sm" className="hover:bg-transparent hover:text-primary pl-0">
          <Link to="/ranking" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Voltar para o Ranking</Link>
        </Button>
      </div>
      
      {/* Header do Perfil */}
      <div className="relative">
        <div className="h-32 md:h-48 w-full rounded-t-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="bg-card border-x border-b rounded-b-2xl shadow-sm px-6 pb-6 relative pt-16 md:pt-20 text-center md:text-left">
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

            {profile.specializations && profile.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {profile.specializations.map((spec, i) => (
                  <Badge key={i} variant="secondary" className="px-2 py-0.5 text-xs font-normal bg-secondary/50">
                    {spec}
                  </Badge>
                ))}
              </div>
            )}

            <div className="max-w-2xl text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50 mx-auto md:mx-0">
              {profile.bio || "Este usuário ainda não escreveu uma biografia."}
            </div>
          </div>
        </div>
      </div>

      {isLoadingStats ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
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
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pontos (XP)</span>
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md text-purple-600"><Trophy className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{correctQuestions}</span>
                  <p className="text-xs text-muted-foreground mt-1">Acumulados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3 h-11 p-1 bg-muted/50 rounded-full">
                <TabsTrigger value="overview" className="rounded-full text-xs font-semibold">Visão Geral</TabsTrigger>
                <TabsTrigger value="history" className="rounded-full text-xs font-semibold">Histórico</TabsTrigger>
                <TabsTrigger value="badges" className="rounded-full text-xs font-semibold">Conquistas</TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: VISÃO GERAL */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Gráfico Radar - Competências */}
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-500" /> Mapa de Competências
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {processedData?.radarData && processedData.radarData.length > 2 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={processedData.radarData}>
                          <PolarGrid strokeOpacity={0.2} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Aproveitamento" dataKey="Aproveitamento" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                          <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center">Dados insuficientes para gerar o mapa de competências.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Pontos Fortes e Fracos */}
                <div className="space-y-4">
                  <Card className="bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Zap className="h-4 w-4 fill-current" /> Pontos Fortes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 pb-4 space-y-2">
                      {processedData?.strengths.length ? processedData.strengths.map((s: any) => (
                        <div key={s.name} className="flex justify-between items-center text-sm">
                          <span className="truncate max-w-[70%] text-foreground/80">{s.name}</span>
                          <Badge className="bg-green-500 text-white border-0">{s.accuracy}%</Badge>
                        </div>
                      )) : <p className="text-xs text-muted-foreground italic">Nenhuma disciplina acima de 60%.</p>}
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4 fill-current" /> Pontos de Atenção
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 pb-4 space-y-2">
                      {processedData?.weaknesses.length ? processedData.weaknesses.map((w: any) => (
                        <div key={w.name} className="flex justify-between items-center text-sm">
                          <span className="truncate max-w-[70%] text-foreground/80">{w.name}</span>
                          <Badge variant="outline" className="border-red-400 text-red-500">{w.accuracy}%</Badge>
                        </div>
                      )) : <p className="text-xs text-muted-foreground italic">Nenhum ponto crítico identificado.</p>}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Gráfico de Evolução */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" /> Evolução nos Simulados
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  {processedData?.evolutionData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={processedData.evolutionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScorePublic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="Aproveitamento" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorScorePublic)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sem dados de evolução.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: HISTÓRICO */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-amber-500" />
                    Histórico Completo
                  </CardTitle>
                  <CardDescription>Todos os simulados realizados.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {simulations && simulations.length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <div className="divide-y divide-border/50">
                        {simulations.map((sim: any) => (
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
            </TabsContent>

            {/* TAB: CONQUISTAS */}
            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Medal className="h-5 w-5 text-purple-500" />
                    Galeria de Conquistas
                  </CardTitle>
                  <CardDescription>Medalhas desbloqueadas pelo usuário.</CardDescription>
                </CardHeader>
                <CardContent>
                  {badges && badges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {badges.map((userBadge: UserBadge) => {
                        const badgeDef = BADGES.find(b => b.id === userBadge.badge_code);
                        if (!badgeDef) return null;
                        const Icon = badgeDef.icon;
                        
                        return (
                          <div key={userBadge.badge_code} className={cn("flex flex-col items-center p-3 rounded-xl border text-center relative overflow-hidden group transition-all hover:scale-105", `bg-gradient-to-br ${badgeDef.bgGradient} border-${badgeDef.color.split('-')[1]}-200 dark:border-${badgeDef.color.split('-')[1]}-800`)}>
                            <div className="absolute top-1 right-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse" />
                            </div>
                            <div className="p-2.5 bg-background rounded-full mb-2 shadow-sm">
                              <Icon className={cn("w-6 h-6", badgeDef.color)} />
                            </div>
                            <p className="text-xs font-bold leading-tight line-clamp-1">{badgeDef.name}</p>
                            <p className="text-[9px] text-muted-foreground mt-1">{format(new Date(userBadge.earned_at), "dd/MM/yy", { locale: ptBR })}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground bg-muted/10 rounded-lg border border-dashed text-center p-4">
                      <Lock className="h-8 w-8 mb-3 opacity-20" />
                      <p className="text-sm">Este usuário ainda não desbloqueou conquistas.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default PublicProfile;