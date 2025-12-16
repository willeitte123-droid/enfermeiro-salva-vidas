import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, FileQuestion, Percent, Timer, Trophy, Medal, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

interface UserBadge {
  badge_code: string;
  earned_at: string;
}

interface Simulation {
  id: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds: number;
  created_at: string;
}

interface RankedUser {
  user_id: string;
  score: number;
}

const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return data as Profile;
};

const fetchUserStats = async (userId: string) => {
  // 1. Buscar Simulados (Histórico + Totais)
  const simulationsPromise = supabase
    .from("user_simulations")
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // 2. Buscar Dados da Banca (Questões Avulsas)
  const { count: bankTotalQuestions, error: bankCountError } = await supabase
    .from("user_question_answers")
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (bankCountError) throw bankCountError;

  const { count: bankTotalCorrect, error: bankCorrectError } = await supabase
    .from("user_question_answers")
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_correct', true);

  if (bankCorrectError) throw bankCorrectError;

  // 3. Buscar Conquistas
  const badgesPromise = supabase
    .from("user_badges")
    .select('*')
    .eq('user_id', userId);

  // 4. Buscar Ranking Global para determinar posição
  const rankingPromise = supabase.rpc('get_global_ranking');

  const [simulationsResult, badgesResult, rankingResult] = await Promise.all([
    simulationsPromise, 
    badgesPromise,
    rankingPromise
  ]);

  if (simulationsResult.error) console.error("Simulations Error:", simulationsResult.error);
  if (badgesResult.error) console.error("Badges Error:", badgesResult.error);
  if (rankingResult.error) console.error("Ranking Error:", rankingResult.error);

  const simulations = (simulationsResult.data as Simulation[]) || [];
  const badges = (badgesResult.data as UserBadge[]) || [];
  const rankingList = (rankingResult.data as RankedUser[]) || [];

  // --- CÁLCULO UNIFICADO ---
  
  // Totais dos Simulados
  const simTotalQuestions = simulations.reduce((acc, sim) => acc + (sim.total_questions || 0), 0);
  const simTotalCorrect = simulations.reduce((acc, sim) => acc + (sim.score || 0), 0);

  // Totais Gerais
  const grandTotalQuestions = (bankTotalQuestions || 0) + simTotalQuestions;
  const grandTotalCorrect = (bankTotalCorrect || 0) + simTotalCorrect; // XP Total
  
  // Precisão Global
  const globalAccuracy = grandTotalQuestions > 0 
    ? Math.round((grandTotalCorrect / grandTotalQuestions) * 100) 
    : 0;

  // Determinar Posição no Ranking
  const userRankIndex = rankingList.findIndex(u => u.user_id === userId);
  const rankingPosition = userRankIndex !== -1 ? userRankIndex + 1 : null;

  return {
    simulations,
    badges,
    grandTotalQuestions,
    grandTotalCorrect,
    globalAccuracy,
    totalSimulations: simulations.length,
    rankingPosition
  };
};

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();

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

  const { 
    badges, 
    grandTotalQuestions, 
    grandTotalCorrect, 
    globalAccuracy, 
    totalSimulations,
    rankingPosition
  } = stats || {};

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

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Botão Voltar (Desktop) */}
      <div className="hidden md:block">
        <Button asChild variant="ghost" size="sm" className="hover:bg-transparent hover:text-primary pl-0">
          <Link to="/ranking" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Voltar para o Ranking</Link>
        </Button>
      </div>

      {/* Botão Voltar (Mobile Flutuante) */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button asChild size="icon" className="rounded-full shadow-lg h-12 w-12">
          <Link to="/ranking"><ArrowLeft className="h-6 w-6" /></Link>
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
            <Card className="bg-gradient-to-br from-card to-blue-50/50 dark:to-blue-950/10 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Questões</span>
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-600 group-hover:scale-110 transition-transform"><FileQuestion className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{grandTotalQuestions || 0}</span>
                  <p className="text-xs text-muted-foreground mt-1">Total Respondido</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-green-50/50 dark:to-green-950/10 border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Precisão</span>
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md text-green-600 group-hover:scale-110 transition-transform"><Percent className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{globalAccuracy || 0}%</span>
                  <p className="text-xs text-muted-foreground mt-1">Média Geral</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-amber-50/50 dark:to-amber-950/10 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Simulados</span>
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-md text-amber-600 group-hover:scale-110 transition-transform"><Timer className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{totalSimulations || 0}</span>
                  <p className="text-xs text-muted-foreground mt-1">Concluídos</p>
                </div>
              </CardContent>
            </Card>

            {/* CARD ALTERADO: Ranking com Posição */}
            <Card className="bg-gradient-to-br from-card to-purple-50/50 dark:to-purple-950/10 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ranking XP</span>
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md text-purple-600 group-hover:scale-110 transition-transform"><Trophy className="h-4 w-4" /></div>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    {rankingPosition ? `${rankingPosition}º` : "-"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">Posição Geral</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção de Conquistas (Badges) */}
          <Card className="border-t-4 border-t-purple-500 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Medal className="h-5 w-5 text-purple-500" />
                Conquistas Desbloqueadas
              </CardTitle>
              <CardDescription>Medalhas ganhas por completar desafios na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              {badges && badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {badges.map((userBadge) => {
                    const badgeDef = BADGES.find(b => b.id === userBadge.badge_code);
                    if (!badgeDef) return null;
                    const Icon = badgeDef.icon;
                    
                    return (
                      <div key={userBadge.badge_code} className={cn("flex flex-col items-center p-3 rounded-xl border text-center relative overflow-hidden group hover:shadow-md transition-all", `bg-gradient-to-br ${badgeDef.bgGradient} border-${badgeDef.color.split('-')[1]}-200 dark:border-${badgeDef.color.split('-')[1]}-800`)}>
                        <div className="absolute top-1 right-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="p-2 bg-background rounded-full mb-2 shadow-sm">
                          <Icon className={cn("w-5 h-5", badgeDef.color)} />
                        </div>
                        <p className="text-xs font-bold leading-tight">{badgeDef.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(userBadge.earned_at), "dd/MM/yy", { locale: ptBR })}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground bg-muted/10 rounded-lg border border-dashed text-center p-4">
                  <Lock className="h-8 w-8 mb-3 opacity-20" />
                  <p className="text-sm">Este usuário ainda não desbloqueou conquistas.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;