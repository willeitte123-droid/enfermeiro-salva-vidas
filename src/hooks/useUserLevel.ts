import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { startOfWeek } from "date-fns";
import { useEffect } from "react";

export interface LevelData {
  currentXP: number;
  currentLevel: number;
  levelName: string;
  nextLevelXP: number;
  progressToNextLevel: number;
  weeklyProgress: number;
  weeklyTarget: number;
}

const LEVELS = [
  { min: 0, name: "Novato", target: 10 },
  { min: 20, name: "Aprendiz", target: 30 },
  { min: 50, name: "Iniciado", target: 50 }, // Renomeado de "Estudante" para evitar confusão
  { min: 100, name: "Praticante", target: 70 },
  { min: 200, name: "Intermediário", target: 100 },
  { min: 400, name: "Avançado", target: 150 },
  { min: 700, name: "Especialista", target: 200 },
  { min: 1000, name: "Mestre", target: 300 },
  { min: 2000, name: "Lenda", target: 500 },
];

export const useUserLevel = (userId?: string) => {
  const queryClient = useQueryClient();

  // Configuração do Realtime para atualizar XP/Meta instantaneamente
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('level-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Escuta novas respostas
          schema: 'public',
          table: 'user_question_answers',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Invalida a query para forçar o recarregamento dos dados
          queryClient.invalidateQueries({ queryKey: ["userLevel", userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ["userLevel", userId],
    queryFn: async (): Promise<LevelData> => {
      if (!userId) throw new Error("User ID required");

      // 1. Buscar total de acertos (XP Total)
      const { count: totalCorrect, error: totalError } = await supabase
        .from("user_question_answers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_correct", true);

      if (totalError) throw totalError;

      const currentXP = totalCorrect || 0;

      // 2. Determinar Nível
      let currentLevelIndex = 0;
      for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (currentXP >= LEVELS[i].min) {
          currentLevelIndex = i;
          break;
        }
      }

      const currentLevelData = LEVELS[currentLevelIndex];
      const nextLevelData = LEVELS[currentLevelIndex + 1];
      
      const nextLevelXP = nextLevelData ? nextLevelData.min : currentXP * 1.5; // Fallback se for nível máximo
      
      // Cálculo de progresso para o próximo nível (0 a 100)
      const xpInLevel = currentXP - currentLevelData.min;
      const xpNeededForNext = nextLevelXP - currentLevelData.min;
      const progressToNextLevel = Math.min(100, Math.max(0, (xpInLevel / xpNeededForNext) * 100));

      // 3. Buscar progresso semanal (Desafio da Semana)
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 }).toISOString();
      
      const { count: weeklyCorrect, error: weeklyError } = await supabase
        .from("user_question_answers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_correct", true)
        .gte("created_at", startOfCurrentWeek);

      if (weeklyError) throw weeklyError;

      // Meta semanal escala com o nível
      const weeklyTarget = currentLevelData.target;

      return {
        currentXP,
        currentLevel: currentLevelIndex + 1,
        levelName: currentLevelData.name,
        nextLevelXP,
        progressToNextLevel,
        weeklyProgress: weeklyCorrect || 0,
        weeklyTarget
      };
    },
    enabled: !!userId,
    // Reduzimos o polling já que temos realtime, mas mantemos um fallback
    staleTime: 60000, 
  });
};