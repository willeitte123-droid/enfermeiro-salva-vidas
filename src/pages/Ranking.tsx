import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, Lock, Star, Target, CheckCircle2, Globe, UserPlus, Camera, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BADGES, BadgeDef } from "@/data/badges";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  profession?: string;
  bio?: string;
  role?: string;
}

interface RankedUser {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  score: number;
  accuracy: number;
}

interface UserBadge {
  badge_code: string;
  earned_at: string;
}

// Lista de cores para avatares (garantindo contraste com texto branco)
const AVATAR_COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-600", "bg-yellow-600", "bg-lime-600",
  "bg-green-600", "bg-emerald-600", "bg-teal-600", "bg-cyan-600", "bg-sky-600",
  "bg-blue-600", "bg-indigo-600", "bg-violet-600", "bg-purple-600", "bg-fuchsia-600",
  "bg-pink-600", "bg-rose-600"
];

// Função para obter uma cor consistente baseada no ID do usuário
const getUserColor = (userId: string) => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const fetchRanking = async () => {
  const { data, error } = await supabase.rpc('get_global_ranking');
  if (error) throw error;
  return data as RankedUser[];
};

const fetchUserBadges = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as UserBadge[];
};

const RankingSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Podium Skeleton */}
    <div className="flex justify-center items-end gap-2 sm:gap-4 pb-6 h-48 sm:h-64 px-4 pt-16">
      {/* 2nd Place */}
      <div className="flex flex-col items-center gap-2 w-1/3 max-w-[120px]">
        <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
        <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
        <Skeleton className="h-24 sm:h-32 w-full rounded-t-2xl bg-muted/30" />
      </div>
      {/* 1st Place */}
      <div className="flex flex-col items-center gap-2 w-1/3 max-w-[120px]">
        <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
        <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
        <Skeleton className="h-32 sm:h-40 w-full rounded-t-2xl bg-muted/30" />
      </div>
      {/* 3rd Place */}
      <div className="flex flex-col items-center gap-2 w-1/3 max-w-[120px]">
        <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
        <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
        <Skeleton className="h-16 sm:h-24 w-full rounded-t-2xl bg-muted/30" />
      </div>
    </div>

    {/* List Skeleton */}
    <div className="max-w-3xl mx-auto space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border bg-card/50">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
  </div>
);

const ProfileIncentiveCard = ({ profile }: { profile: Profile }) => {
  const hasAvatar = !!profile.avatar_url;
  const isAdmin = profile.role === 'admin';

  // O banner desaparece se o usuário tiver foto, a menos que seja admin (para visualização)
  if (hasAvatar && !isAdmin) return null;

  return (
    <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border-violet-200 dark:border-violet-900 mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="w-32 h-32 text-violet-500 rotate-12" />
      </div>
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 relative z-10">
        <div className="p-4 bg-white dark:bg-violet-900/50 rounded-full shadow-md shrink-0">
          <UserPlus className="w-8 h-8 text-violet-600 dark:text-violet-300" />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h3 className="font-bold text-lg text-violet-900 dark:text-violet-100">
             {hasAvatar && isAdmin ? "Visualização do Administrador" : "Destaque-se no Ranking!"}
          </h3>
          <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed max-w-lg">
            Adicione uma foto de perfil e atualize sua biografia para que os outros usuários possam te conhecer melhor.
            {hasAvatar && isAdmin && <span className="block mt-1 font-semibold opacity-80">(Este banner é exibido para usuários sem foto. Você o vê porque é admin.)</span>}
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 shadow-lg shadow-violet-500/20 shrink-0">
          <Link to="/profile">
            <Camera className="w-4 h-4 mr-2" />
            {hasAvatar ? "Editar Perfil" : "Adicionar Foto"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const PodiumItem = ({ user, position }: { user: RankedUser; position: 1 | 2 | 3 }) => {
  const styles = {
    1: {
      height: "h-40 sm:h-64", 
      avatarSize: "w-16 h-16 sm:w-28 sm:h-28",
      blockGradient: "bg-gradient-to-b from-yellow-300 via-amber-500 to-orange-600 shadow-[0_0_40px_-5px_rgba(251,191,36,0.5)] border-t border-white/40",
      ring: "ring-2 sm:ring-4 ring-yellow-400 shadow-2xl shadow-yellow-500/40",
      text: "text-amber-800 dark:text-amber-100",
      badgeBg: "bg-gradient-to-r from-yellow-400 to-amber-500",
      scale: "scale-105 z-30 order-2 -mt-8 sm:-mt-16",
      icon: <Crown className="w-6 h-6 sm:w-12 sm:h-12 text-yellow-400 fill-yellow-200 absolute -top-8 sm:-top-14 animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />,
      baseGlow: "bg-yellow-500/40"
    },
    2: {
      height: "h-28 sm:h-48",
      avatarSize: "w-12 h-12 sm:w-20 sm:h-20",
      blockGradient: "bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 shadow-[0_0_30px_-5px_rgba(148,163,184,0.4)] border-t border-white/40",
      ring: "ring-2 sm:ring-4 ring-slate-300 shadow-xl shadow-slate-400/30",
      text: "text-slate-700 dark:text-slate-200",
      badgeBg: "bg-gradient-to-r from-slate-300 to-slate-400",
      scale: "z-20 order-1", 
      icon: null,
      baseGlow: "bg-slate-500/30"
    },
    3: {
      height: "h-20 sm:h-36",
      avatarSize: "w-12 h-12 sm:w-20 sm:h-20",
      blockGradient: "bg-gradient-to-b from-orange-300 via-orange-400 to-red-400 shadow-[0_0_30px_-5px_rgba(234,88,12,0.4)] border-t border-white/40",
      ring: "ring-2 sm:ring-4 ring-orange-300 shadow-xl shadow-orange-500/30",
      text: "text-orange-800 dark:text-orange-100",
      badgeBg: "bg-gradient-to-r from-orange-300 to-orange-400",
      scale: "z-20 order-3 mt-4 sm:mt-8", 
      icon: null,
      baseGlow: "bg-orange-500/20"
    }
  };

  const currentStyle = styles[position];
  const fallbackColor = getUserColor(user.user_id);
  const fullName = `${user.first_name} ${user.last_name || ''}`.trim();

  return (
    <div className={cn("flex flex-col items-center justify-end w-full sm:max-w-[160px] group relative", currentStyle.scale)}>
      
      {/* Avatar Section */}
      <div className="relative flex flex-col items-center mb-2 sm:mb-4 z-20">
        {currentStyle.icon}
        <Link to={`/user/${user.user_id}`} className="transition-transform hover:scale-105 duration-300 relative">
           <div className={cn("absolute inset-0 rounded-full blur-xl opacity-60", currentStyle.baseGlow)} />
           <Avatar className={cn("border-2 sm:border-4 border-white dark:border-slate-900", currentStyle.avatarSize, currentStyle.ring)}>
            <AvatarImage src={user.avatar_url || undefined} className="object-cover" />
            <AvatarFallback className={cn("text-white font-bold text-base sm:text-2xl", fallbackColor)}>
              {user.first_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className={cn("absolute -bottom-2 sm:-bottom-3 px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-sm font-black shadow-lg tracking-wider", currentStyle.badgeBg)}>
          {position}º
        </div>
      </div>
      
      {/* Info Section - Nomes Completos */}
      <div className="text-center mb-1 sm:mb-2 w-full px-0.5 z-20 min-h-[2.5rem] sm:min-h-[3.5rem] flex flex-col justify-end">
        <Link to={`/user/${user.user_id}`} className="block font-bold text-[10px] sm:text-sm leading-tight text-foreground hover:text-primary transition-colors w-full break-words line-clamp-2 px-1" title={fullName}>
          {fullName}
        </Link>
        <p className={cn("text-[9px] sm:text-xs font-black mt-0.5 sm:mt-1 uppercase tracking-wide", currentStyle.text)}>
          {user.score} pts
        </p>
      </div>

      {/* Podium Block - Vibrant Gradient */}
      <div className={cn(
        "w-full rounded-t-lg sm:rounded-t-2xl shadow-lg backdrop-blur-md relative overflow-hidden border-t border-x border-white/20", 
        currentStyle.blockGradient, 
        currentStyle.height
      )}>
         {/* Glossy Effect */}
         <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
         <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
         
         {/* Position Number on Block */}
         <div className="absolute bottom-1 sm:bottom-4 left-0 right-0 text-center opacity-20 text-white font-black text-3xl sm:text-6xl select-none">
            {position}
         </div>
      </div>
    </div>
  );
};

const RankingItem = ({ user, position, isCurrentUser }: { user: RankedUser; position: number; isCurrentUser: boolean }) => {
  const fallbackColor = getUserColor(user.user_id);
  const fullName = `${user.first_name} ${user.last_name || ''}`.trim();

  return (
    <Link to={`/user/${user.user_id}`}>
      <div className={cn(
        "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all duration-300 hover:shadow-md group",
        isCurrentUser 
          ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20 sticky bottom-4 shadow-lg z-30 backdrop-blur-md" 
          : "bg-card border-border/50 hover:border-primary/20 hover:bg-accent/50"
      )}>
        <div className="w-6 sm:w-8 text-center font-bold text-muted-foreground text-xs sm:text-base group-hover:text-primary transition-colors shrink-0">
          {position}º
        </div>
        
        <Avatar className="h-8 w-8 sm:h-12 sm:w-12 border-2 border-background shadow-sm shrink-0">
          <AvatarImage src={user.avatar_url || undefined} className="object-cover" />
          <AvatarFallback className={cn("text-white font-bold text-xs sm:text-base", fallbackColor)}>{user.first_name?.[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
            <p className={cn("font-bold text-xs sm:text-base group-hover:text-primary transition-colors truncate max-w-full", isCurrentUser && "text-primary")}>
              {fullName}
            </p>
            {isCurrentUser && (
              <Badge variant="default" className="text-[8px] sm:text-[10px] h-4 sm:h-5 px-1 sm:px-1.5 bg-primary/90 hover:bg-primary w-fit">Você</Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
             <div className="flex items-center gap-1 text-[9px] sm:text-xs text-muted-foreground">
                <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />
                <span className="font-medium text-foreground/80">{user.accuracy}%</span> precisão
             </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="block font-black text-sm sm:text-lg text-primary">{user.score}</span>
          <span className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Pontos</span>
        </div>
        
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/30 group-hover:text-primary/50 group-hover:translate-x-1 transition-all hidden sm:block" />
      </div>
    </Link>
  );
};

const BadgeCard = ({ badge, isUnlocked, earnedDate }: { badge: BadgeDef; isUnlocked: boolean; earnedDate?: string }) => {
  const Icon = badge.icon;
  
  return (
    <div className={cn(
      "relative p-3 sm:p-4 rounded-2xl border transition-all duration-300 overflow-hidden group flex flex-col items-center text-center h-full",
      isUnlocked 
        ? `bg-gradient-to-br ${badge.bgGradient} border-primary/10 shadow-sm hover:shadow-md` 
        : "bg-muted/20 border-dashed border-border opacity-70 hover:opacity-100 grayscale hover:grayscale-0"
    )}>
      <div className={cn(
        "p-2 sm:p-3 rounded-full mb-2 sm:mb-3 transition-transform group-hover:scale-110 relative",
        isUnlocked ? "bg-background shadow-inner" : "bg-muted"
      )}>
        <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", isUnlocked ? badge.color : "text-muted-foreground")} />
        {!isUnlocked && <Lock className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground bg-background rounded-full p-0.5 border" />}
      </div>

      <h3 className={cn("font-bold text-xs sm:text-sm leading-tight mb-1", isUnlocked ? "text-foreground" : "text-muted-foreground")}>
        {badge.name}
      </h3>
      
      <p className="text-[9px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {badge.description}
      </p>

      {isUnlocked && (
        <div className="mt-auto pt-2 sm:pt-3 w-full">
           <Badge variant="secondary" className="text-[8px] sm:text-[9px] h-4 sm:h-5 bg-background/50 backdrop-blur-sm border-0 w-full justify-center">
             {new Date(earnedDate!).toLocaleDateString('pt-BR')}
           </Badge>
        </div>
      )}
    </div>
  );
};

const Ranking = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const queryClient = useQueryClient();

  useEffect(() => {
    addActivity({ type: 'Social', title: 'Ranking Geral', path: '/ranking', icon: 'Trophy' });
  }, [addActivity]);

  const { data: ranking = [], isLoading: isLoadingRanking } = useQuery({
    queryKey: ['globalRanking'], 
    queryFn: fetchRanking,
    refetchInterval: 60000, 
    refetchOnWindowFocus: true,
  });

  const { data: myBadges = [], isLoading: isLoadingBadges } = useQuery({
    queryKey: ['myBadges', profile?.id],
    queryFn: () => profile ? fetchUserBadges(profile.id) : Promise.resolve([]),
    enabled: !!profile,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!profile) return;
    const rankingChannel = supabase.channel('ranking-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_question_answers' }, () => queryClient.invalidateQueries({ queryKey: ['globalRanking'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_simulations' }, () => queryClient.invalidateQueries({ queryKey: ['globalRanking'] }))
      .subscribe();

    return () => { supabase.removeChannel(rankingChannel); };
  }, [profile, queryClient]);

  const top3 = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3, 10);
  const myRankIndex = ranking.findIndex(u => u.user_id === profile?.id);
  const myRank = myRankIndex !== -1 ? ranking[myRankIndex] : null;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 animate-in fade-in duration-700">
      
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 p-8 sm:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <Globe className="h-6 w-6 text-yellow-300" />
              </div>
              <h1 className="text-2xl sm:text-5xl font-black tracking-tight">Ranking Geral</h1>
            </div>
            <p className="text-purple-100 text-sm sm:text-lg max-w-md mx-auto md:mx-0 font-medium">
              Supere seus limites e conquiste seu lugar entre os melhores profissionais.
            </p>
          </div>

          {/* User Rank Card */}
          {myRank && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-6 shadow-xl animate-in slide-in-from-right-8 duration-700">
              <div className="text-center">
                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">Sua Posição</p>
                <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm">#{myRankIndex + 1}</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">Seus Pontos</p>
                <p className="text-2xl sm:text-3xl font-black text-yellow-300 drop-shadow-sm">{myRank.score}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Background Particles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      </div>

      {profile && <ProfileIncentiveCard profile={profile} />}

      <Tabs defaultValue="ranking" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-[280px] sm:max-w-[320px] grid-cols-2 bg-muted/50 p-1 rounded-full h-12 shadow-inner">
            <TabsTrigger value="ranking" className="rounded-full text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
               🏆 Classificação
            </TabsTrigger>
            <TabsTrigger value="badges" className="rounded-full text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
               🏅 Conquistas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="ranking" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isLoadingRanking ? (
            <RankingSkeleton />
          ) : (
            <>
              {/* Podium Section */}
              {top3.length > 0 && (
                <div className="relative pt-16 sm:pt-20 pb-4">
                   {/* Light glow behind podium */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
                   
                   <div className="flex justify-center items-end gap-2 sm:gap-6 px-2 relative z-10 w-full max-w-3xl mx-auto">
                    {/* 2nd Place */}
                    <div className="order-1 flex justify-center w-1/3">{top3[1] && <PodiumItem user={top3[1]} position={2} />}</div>
                    {/* 1st Place */}
                    <div className="order-2 flex justify-center w-1/3 -mx-2 sm:-mx-4 z-20 -mt-6 sm:-mt-8">{top3[0] && <PodiumItem user={top3[0]} position={1} />}</div>
                    {/* 3rd Place */}
                    <div className="order-3 flex justify-center w-1/3">{top3[2] && <PodiumItem user={top3[2]} position={3} />}</div>
                  </div>
                </div>
              )}

              {/* List Section */}
              <div className="max-w-3xl mx-auto space-y-3 pb-8">
                {restOfRanking.length > 0 ? (
                  <>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Outros Competidores</div>
                    {restOfRanking.map((user, index) => (
                      <RankingItem 
                        key={user.user_id} 
                        user={user} 
                        position={index + 4} 
                        isCurrentUser={user.user_id === profile?.id}
                      />
                    ))}
                    
                    {/* Sticky Current User Rank if not in top 10 */}
                    {myRankIndex >= 10 && myRank && (
                      <>
                        <div className="flex items-center justify-center py-4">
                           <div className="h-1 w-1 bg-muted-foreground/30 rounded-full mx-1" />
                           <div className="h-1 w-1 bg-muted-foreground/30 rounded-full mx-1" />
                           <div className="h-1 w-1 bg-muted-foreground/30 rounded-full mx-1" />
                        </div>
                        <div className="sticky bottom-4 z-40 animate-in slide-in-from-bottom-10 duration-700 delay-300">
                           <RankingItem 
                             user={myRank} 
                             position={myRankIndex + 1} 
                             isCurrentUser={true}
                           />
                        </div>
                      </>
                    )}
                  </>
                ) : ranking.length === 0 ? (
                  <div className="text-center py-16 bg-muted/20 rounded-3xl border border-dashed animate-in fade-in zoom-in duration-500">
                    <div className="bg-muted p-4 rounded-full w-fit mx-auto mb-4">
                       <Trophy className="w-10 h-10 opacity-30 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">O Ranking está vazio</h3>
                    <p className="text-sm text-muted-foreground mt-1">Seja o primeiro a pontuar!</p>
                    <Button variant="outline" className="mt-4" asChild>
                       <Link to="/questions">Começar Agora</Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="badges" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {BADGES.map((badge) => {
                  const userBadge = myBadges.find(b => b.badge_code === badge.id);
                  return (
                    <BadgeCard 
                      key={badge.id}
                      badge={badge}
                      isUnlocked={!!userBadge}
                      earnedDate={userBadge?.earned_at}
                    />
                  );
                })}
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ranking;