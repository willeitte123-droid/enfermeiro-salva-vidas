import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, Lock, Star, Target, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BADGES, BadgeDef } from "@/data/badges";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { toast } from "sonner";

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

const fetchRanking = async () => {
  const { data, error } = await supabase.rpc('get_weekly_ranking');
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

const PodiumItem = ({ user, position }: { user: RankedUser; position: 1 | 2 | 3 }) => {
  const colors = {
    1: "from-yellow-300 to-amber-500 ring-amber-400",
    2: "from-slate-300 to-slate-400 ring-slate-400",
    3: "from-orange-300 to-orange-500 ring-orange-400"
  };

  const height = {
    1: "h-40",
    2: "h-32",
    3: "h-28"
  };

  return (
    <div className="flex flex-col items-center justify-end group w-1/3 max-w-[140px] animate-in slide-in-from-bottom-4 duration-700 fade-in">
      <div className="relative mb-3">
        {position === 1 && <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" />}
        <Avatar className={cn("w-14 h-14 sm:w-20 sm:h-20 border-4 transition-transform group-hover:scale-110", colors[position].split(' ')[2])}>
          <AvatarImage src={user.avatar_url || undefined} className="object-cover" />
          <AvatarFallback className="font-bold text-lg bg-card">{user.first_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className={cn("absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg bg-gradient-to-br", colors[position])}>
          {position}
        </div>
      </div>
      
      <div className="text-center mb-2 w-full">
        <p className="font-bold text-foreground truncate text-sm sm:text-base group-hover:text-primary transition-colors">{user.first_name}</p>
        
        {/* Stats Container */}
        <div className="flex flex-col items-center mt-1 space-y-1">
          <div className="flex flex-col items-center leading-none">
            <span className="font-black text-lg sm:text-xl text-primary">{user.score}</span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Acertos</span>
          </div>
          
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
            <Target className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-[10px] font-bold text-green-700 dark:text-green-300">{user.accuracy}%</span>
          </div>
        </div>
      </div>

      <div className={cn("w-full rounded-t-lg bg-gradient-to-t opacity-80 shadow-inner group-hover:opacity-100 transition-opacity", colors[position], height[position])} />
    </div>
  );
};

const RankingItem = ({ user, position, isCurrentUser }: { user: RankedUser; position: number; isCurrentUser: boolean }) => (
  <div className={cn(
    "flex items-center gap-4 p-3 sm:p-4 rounded-xl border transition-all hover:scale-[1.01] group",
    isCurrentUser 
      ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]" 
      : "bg-card border-border hover:border-primary/30"
  )}>
    <div className="font-bold text-muted-foreground w-6 text-center">{position}</div>
    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-background shadow-sm group-hover:border-primary transition-colors">
      <AvatarImage src={user.avatar_url || undefined} className="object-cover" />
      <AvatarFallback>{user.first_name?.[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className={cn("font-semibold truncate group-hover:text-primary transition-colors", isCurrentUser && "text-primary")}>
        {user.first_name} {user.last_name}
        {isCurrentUser && <span className="ml-2 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full">Você</span>}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal flex gap-1 items-center">
            <Target className="w-3 h-3" /> {user.accuracy}% precisão
        </Badge>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-lg sm:text-xl text-primary leading-none">{user.score}</p>
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Acertos</p>
    </div>
  </div>
);

const BadgeCard = ({ badge, isUnlocked, earnedDate }: { badge: BadgeDef; isUnlocked: boolean; earnedDate?: string }) => {
  const Icon = badge.icon;
  
  return (
    <div className={cn(
      "relative p-4 rounded-xl border transition-all duration-300 overflow-hidden group",
      isUnlocked 
        ? `bg-gradient-to-br ${badge.bgGradient} border-primary/20 hover:shadow-lg hover:border-primary/40` 
        : "bg-muted/30 border-dashed border-border opacity-70 grayscale hover:opacity-100"
    )}>
      {isUnlocked && (
        <div className="absolute top-0 right-0 p-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse-subtle" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-full shrink-0 transition-transform group-hover:scale-110",
          isUnlocked ? "bg-background shadow-sm" : "bg-muted"
        )}>
          <Icon className={cn("w-6 h-6", isUnlocked ? badge.color : "text-muted-foreground")} />
        </div>
        <div>
          <h3 className={cn("font-bold text-sm", isUnlocked ? "text-foreground" : "text-muted-foreground")}>{badge.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">{badge.description}</p>
          {isUnlocked && earnedDate && (
            <p className="text-[10px] text-primary/80 mt-2 font-medium">
              Conquistado em {new Date(earnedDate).toLocaleDateString('pt-BR')}
            </p>
          )}
          {!isUnlocked && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
              <Lock className="w-3 h-3" /> Bloqueado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Ranking = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const queryClient = useQueryClient();

  useEffect(() => {
    addActivity({ type: 'Social', title: 'Ranking e Conquistas', path: '/ranking', icon: 'Trophy' });
  }, [addActivity]);

  const { data: ranking = [], isLoading: isLoadingRanking } = useQuery({
    queryKey: ['weeklyRanking'],
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

  // Configuração do Realtime para atualização instantânea e Notificações de Conquista
  useEffect(() => {
    if (!profile) return;

    // Canal para Ranking (Respostas)
    const rankingChannel = supabase.channel('ranking-updates')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'user_question_answers' 
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['weeklyRanking'] });
        }
      )
      .subscribe();

    // Canal dedicado para Medalhas (Badges)
    const badgesChannel = supabase.channel('badges-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_badges',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          // Atualiza a lista de badges imediatamente
          queryClient.invalidateQueries({ queryKey: ['myBadges', profile.id] });
          
          // Mostra notificação de conquista
          const newBadgeCode = payload.new.badge_code;
          const badgeInfo = BADGES.find(b => b.id === newBadgeCode);
          
          if (badgeInfo) {
            toast.success(`Nova Conquista Desbloqueada!`, {
                description: badgeInfo.name,
                icon: <Trophy className="h-5 w-5 text-yellow-500" />,
                duration: 5000,
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
  const restOfRanking = ranking.slice(3);
  const myRankIndex = ranking.findIndex(u => u.user_id === profile?.id);
  const myRank = myRankIndex !== -1 ? ranking[myRankIndex] : null;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Hall da Fama</h1>
            <p className="text-purple-100 max-w-md text-sm sm:text-base">
              Dispute com outros estudantes, conquiste medalhas e mostre que você domina a Enfermagem!
            </p>
          </div>
          
          {myRank && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center gap-4 min-w-[200px]">
              <div className="text-center border-r border-white/20 pr-4">
                <p className="text-xs text-purple-200 font-bold uppercase">Sua Posição</p>
                <p className="text-2xl font-black">#{myRankIndex + 1}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-purple-200 font-bold uppercase">Seus Pontos</p>
                <p className="text-2xl font-black text-yellow-300">{myRank.score}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <Tabs defaultValue="ranking" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-muted/50 p-1 rounded-full">
          <TabsTrigger value="ranking" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-sm transition-all">Ranking Semanal</TabsTrigger>
          <TabsTrigger value="badges" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:shadow-sm transition-all">Minhas Conquistas</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-8">
          {/* Podium - Exibe dinamicamente conforme usuários disponíveis */}
          {top3.length > 0 && (
            <div className="flex justify-center items-end gap-2 sm:gap-4 pb-6 border-b border-dashed px-2">
              {/* 2º Lugar (Esquerda) */}
              {top3[1] && <PodiumItem user={top3[1]} position={2} />}
              
              {/* 1º Lugar (Centro - Destaque) */}
              {top3[0] && <PodiumItem user={top3[0]} position={1} />}
              
              {/* 3º Lugar (Direita) */}
              {top3[2] && <PodiumItem user={top3[2]} position={3} />}
            </div>
          )}

          {/* List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {restOfRanking.length > 0 ? (
              restOfRanking.map((user, index) => (
                <RankingItem 
                  key={user.user_id} 
                  user={user} 
                  position={index + 4} 
                  isCurrentUser={user.user_id === profile?.id}
                />
              ))
            ) : ranking.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground animate-in fade-in zoom-in duration-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20 text-yellow-500" />
                <h3 className="text-lg font-semibold text-foreground">O Ranking está vazio</h3>
                <p className="text-sm">Seja o primeiro a pontuar nesta semana!</p>
              </div>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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