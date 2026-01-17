import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, Lock, Star, Target, CheckCircle2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { BADGES, BadgeDef } from "@/data/badges";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
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
    <div className="flex justify-center items-end gap-2 sm:gap-4 pb-6 border-b border-dashed px-1 h-48">
      {/* 2nd Place */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-full" />
        <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
        <Skeleton className="h-20 sm:h-24 w-full max-w-[80px] rounded-t-lg bg-muted/50" />
      </div>
      {/* 1st Place */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
        <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
        <Skeleton className="h-28 sm:h-32 w-full max-w-[80px] rounded-t-lg bg-muted/50" />
      </div>
      {/* 3rd Place */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-full" />
        <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
        <Skeleton className="h-16 sm:h-20 w-full max-w-[80px] rounded-t-lg bg-muted/50" />
      </div>
    </div>

    {/* List Skeleton */}
    <div className="max-w-3xl mx-auto space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border bg-card/50">
          <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded" />
          <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-full" />
          <div className="flex-1 space-y-1.5 sm:space-y-2">
            <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            <Skeleton className="h-2 sm:h-3 w-12 sm:w-16" />
          </div>
          <Skeleton className="h-5 sm:h-6 w-10 sm:w-12" />
        </div>
      ))}
    </div>
  </div>
);

const PodiumItem = ({ user, position }: { user: RankedUser; position: 1 | 2 | 3 }) => {
  const colors = {
    1: "from-yellow-300 to-amber-500 ring-amber-400",
    2: "from-slate-300 to-slate-400 ring-slate-400",
    3: "from-orange-300 to-orange-500 ring-orange-400"
  };

  const height = {
    1: "h-32 sm:h-40",
    2: "h-24 sm:h-32",
    3: "h-20 sm:h-28"
  };

  const avatarSize = {
    1: "w-16 h-16 sm:w-20 sm:h-20",
    2: "w-12 h-12 sm:w-16 sm:h-16",
    3: "w-12 h-12 sm:w-16 sm:h-16"
  };

  const fallbackColor = getUserColor(user.user_id);

  return (
    <div className="flex flex-col items-center justify-end group w-1/3 max-w-[140px] animate-in slide-in-from-bottom-4 duration-700 fade-in relative z-10">
      <Link to={`/user/${user.user_id}`} className="relative mb-2 sm:mb-3 cursor-pointer transition-transform hover:scale-105 active:scale-95 flex flex-col items-center">
        {position === 1 && <Crown className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400 animate-bounce" />}
        <Avatar className={cn("border-2 sm:border-4 transition-all shadow-md", colors[position].split(' ')[2], avatarSize[position])}>
          <AvatarImage src={user.avatar_url || undefined} className="object-cover" />
          <AvatarFallback className={cn("font-bold text-sm sm:text-lg text-white", fallbackColor)}>{user.first_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className={cn("absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-sm shadow-lg bg-gradient-to-br", colors[position])}>
          {position}
        </div>
      </Link>
      
      <div className="text-center mb-1 sm:mb-2 w-full px-0.5">
        <Link to={`/user/${user.user_id}`} className="font-bold text-foreground truncate text-xs sm:text-sm md:text-base hover:text-primary hover:underline transition-colors block leading-tight mb-1">
          {user.first_name}
        </Link>
        
        {/* Stats Container - Compacto no mobile */}
        <div className="flex flex-col items-center space-y-0.5 sm:space-y-1">
          <div className="flex flex-col items-center leading-none">
            <span className="font-black text-sm sm:text-xl text-primary">{user.score}</span>
            <span className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground tracking-wide scale-75 sm:scale-100 origin-center">pts</span>
          </div>
          
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full mt-0.5">
            <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400" />
            <span className="text-[9px] sm:text-[10px] font-bold text-green-700 dark:text-green-300">{user.accuracy}%</span>
          </div>
        </div>
      </div>

      <div className={cn("w-full rounded-t-lg bg-gradient-to-t opacity-80 shadow-inner group-hover:opacity-100 transition-opacity", colors[position], height[position])} />
    </div>
  );
};

const RankingItem = ({ user, position, isCurrentUser }: { user: RankedUser; position: number; isCurrentUser: boolean }) => {
  const fallbackColor = getUserColor(user.user_id);

  return (
    <div className={cn(
      "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all hover:scale-[1.01] group",
      isCurrentUser 
        ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]" 
        : "bg-card border-border hover:border-primary/30"
    )}>
      <div className={cn("font-bold text-center text-sm sm:text-base w-6 sm:w-8", position <= 3 ? "text-primary" : "text-muted-foreground")}>
        {position}º
      </div>
      
      <Link to={`/user/${user.user_id}`} className="flex flex-1 items-center gap-3 sm:gap-4 min-w-0 cursor-pointer">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-background shadow-sm group-hover:border-primary transition-colors shrink-0">
          <AvatarImage src={user.avatar_url || undefined} className="object-cover" />
          <AvatarFallback className={cn("text-white font-medium", fallbackColor)}>{user.first_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn("font-semibold text-sm sm:text-base truncate group-hover:text-primary group-hover:underline transition-colors max-w-[120px] sm:max-w-none", isCurrentUser && "text-primary")}>
              {user.first_name} {user.last_name}
            </p>
            {isCurrentUser && <span className="text-[9px] sm:text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full no-underline shrink-0">Você</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <Badge variant="secondary" className="h-4 sm:h-5 px-1 sm:px-1.5 text-[9px] sm:text-[10px] font-normal flex gap-1 items-center bg-muted border-0">
                <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {user.accuracy}%
            </Badge>
          </div>
        </div>
      </Link>

      <div className="text-right pl-2">
        <p className="font-bold text-base sm:text-xl text-primary leading-none">{user.score}</p>
        <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-wider hidden sm:block">Pontos</p>
        <p className="text-[9px] text-muted-foreground sm:hidden">pts</p>
      </div>
    </div>
  );
};

const BadgeCard = ({ badge, isUnlocked, earnedDate }: { badge: BadgeDef; isUnlocked: boolean; earnedDate?: string }) => {
  const Icon = badge.icon;
  
  const difficultyColor = {
    "Fácil": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    "Médio": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "Difícil": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    "Lendário": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
  };

  return (
    <div className={cn(
      "relative p-3 sm:p-4 rounded-xl border transition-all duration-300 overflow-hidden group flex flex-col justify-between h-full min-h-[120px] sm:min-h-[110px]",
      isUnlocked 
        ? `bg-gradient-to-br ${badge.bgGradient} border-primary/20 hover:shadow-lg hover:border-primary/40` 
        : "bg-muted/30 border-dashed border-border opacity-80 hover:opacity-100"
    )}>
      {isUnlocked && (
        <div className="absolute top-0 right-0 p-2">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 animate-pulse-subtle" />
        </div>
      )}
      
      <div className="flex flex-col gap-2 text-center items-center">
        <div className={cn(
          "p-2 sm:p-3 rounded-full shrink-0 transition-transform group-hover:scale-110 relative",
          isUnlocked ? "bg-background shadow-sm" : "bg-muted grayscale"
        )}>
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", isUnlocked ? badge.color : "text-muted-foreground")} />
          {!isUnlocked && <Lock className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground bg-background rounded-full p-0.5" />}
        </div>
        <div className="w-full min-w-0">
          <h3 className={cn("font-bold text-xs sm:text-sm leading-tight truncate px-1", isUnlocked ? "text-foreground" : "text-muted-foreground")}>{badge.name}</h3>
          <p className="text-[10px] text-muted-foreground mt-1 leading-snug line-clamp-3 sm:line-clamp-2">{badge.description}</p>
        </div>
      </div>

      <div className="flex justify-center sm:justify-between items-center mt-2 sm:mt-3 pt-2 border-t border-border/10 w-full">
        <Badge variant="outline" className={cn("text-[8px] sm:text-9px font-bold border-0 px-1.5 py-0.5", difficultyColor[badge.difficulty])}>
          {badge.difficulty}
        </Badge>
        
        {isUnlocked && earnedDate && (
          <p className="text-[9px] text-primary/80 font-medium hidden sm:block">
            {new Date(earnedDate).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
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
    refetchInterval: 30000, 
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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_question_answers' },
        () => queryClient.invalidateQueries({ queryKey: ['globalRanking'] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_simulations' },
        () => queryClient.invalidateQueries({ queryKey: ['globalRanking'] })
      )
      .subscribe();

    const badgesChannel = supabase.channel('badges-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_badges', filter: `user_id=eq.${profile.id}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['myBadges', profile.id] });
          const newBadgeCode = payload.new.badge_code;
          const badgeInfo = BADGES.find(b => b.id === newBadgeCode);
          if (badgeInfo) {
            toast.success(`Nova Conquista: ${badgeInfo.name}`, {
                description: badgeInfo.description,
                icon: <Trophy className="h-5 w-5 text-yellow-500" />,
                duration: 5000,
                className: "border-l-4 border-yellow-500 bg-background"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(rankingChannel);
      supabase.removeChannel(badgesChannel);
    };
  }, [profile, queryClient]);

  const top3 = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3, 10);
  const myRankIndex = ranking.findIndex(u => u.user_id === profile?.id);
  const myRank = myRankIndex !== -1 ? ranking[myRankIndex] : null;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Header Otimizado */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-4 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-center md:text-left w-full">
            <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Globe className="h-5 w-5 sm:h-7 sm:w-7 text-yellow-300" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Ranking Geral</h1>
            </div>
            <p className="text-purple-100 text-xs sm:text-base max-w-md mx-auto md:mx-0">
              Supere seus limites e conquiste seu lugar entre os melhores.
            </p>
          </div>
          
          {myRank && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-center">
              <div className="text-center border-r border-white/20 pr-3 sm:pr-4">
                <p className="text-[10px] sm:text-xs text-purple-200 font-bold uppercase">Posição</p>
                <p className="text-xl sm:text-2xl font-black">#{myRankIndex + 1}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-purple-200 font-bold uppercase">Pontos</p>
                <p className="text-xl sm:text-2xl font-black text-yellow-300">{myRank.score}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <Tabs defaultValue="ranking" className="w-full">
        <div className="flex justify-center mb-4 sm:mb-6">
          <TabsList className="grid w-full max-w-[280px] sm:max-w-md grid-cols-2 bg-muted/50 p-1 rounded-full h-9 sm:h-11">
            <TabsTrigger value="ranking" className="rounded-full text-[10px] sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-sm transition-all">Ranking Geral</TabsTrigger>
            <TabsTrigger value="badges" className="rounded-full text-[10px] sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-sm transition-all">Conquistas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="ranking" className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {isLoadingRanking ? (
            <RankingSkeleton />
          ) : (
            <>
              {/* Podium Mobile Friendly */}
              {top3.length > 0 && (
                <div className="flex justify-center items-end gap-1 sm:gap-4 pb-4 sm:pb-6 border-b border-dashed px-1">
                  {/* 2º Lugar */}
                  {top3[1] && <PodiumItem user={top3[1]} position={2} />}
                  
                  {/* 1º Lugar */}
                  {top3[0] && <PodiumItem user={top3[0]} position={1} />}
                  
                  {/* 3º Lugar */}
                  {top3[2] && <PodiumItem user={top3[2]} position={3} />}
                </div>
              )}

              {/* Listagem (Limitada até o 10º colocado) */}
              <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">
                {restOfRanking.length > 0 ? (
                  <>
                    {restOfRanking.map((user, index) => (
                      <RankingItem 
                        key={user.user_id} 
                        user={user} 
                        position={index + 4} 
                        isCurrentUser={user.user_id === profile?.id}
                      />
                    ))}
                    
                    {myRankIndex >= 10 && myRank && (
                      <>
                        <div className="flex items-center justify-center py-2 text-muted-foreground text-xs font-medium">...</div>
                        <RankingItem 
                          user={myRank} 
                          position={myRankIndex + 1} 
                          isCurrentUser={true}
                        />
                      </>
                    )}
                  </>
                ) : ranking.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground animate-in fade-in zoom-in duration-500">
                    <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-20 text-yellow-500" />
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">O Ranking está vazio</h3>
                    <p className="text-xs sm:text-sm">Seja o primeiro a pontuar!</p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="badges" className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ranking;