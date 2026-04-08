import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useTimer } from '@/context/TimerContext';

const INTERVAL_SECONDS = 10; // Salvar a cada 10 segundos para maior precisão

export const TimeTracker = () => {
  const { session } = useAuth();
  const { data: profile } = useProfile(session);
  const { isActive } = useTimer(); // Pega o estado do cronômetro manual
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    // Bloqueio Total para Admins: Não rastrear tempo de uso de administradores
    if (profile?.role === 'admin') return;

    const saveTime = async () => {
      // Só salva se a página estiver visível E o cronômetro manual estiver rodando
      if (document.visibilityState === 'visible' && isActive) {
        // Chamada para o tempo total (usado em Meu Desempenho)
        supabase.rpc('increment_user_activity', { seconds_to_add: INTERVAL_SECONDS }).then();
        
        // Chamada para o tempo diário (usado no Gráfico de 7 dias)
        supabase.rpc('increment_daily_activity', { seconds_to_add: INTERVAL_SECONDS }).then();
      }
    };

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(saveTime, INTERVAL_SECONDS * 1000);
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    // Iniciar o timer se a página já estiver visível, o perfil carregado e o cronômetro ativo
    if (document.visibilityState === 'visible' && profile && isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    // Ouvinte de eventos para pausar/retomar quando o usuário troca de aba
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && profile?.role !== 'admin' && isActive) {
        startTimer(); // Retoma
      } else {
        stopTimer(); // Pausa
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Limpeza ao desmontar
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, profile, isActive]); // Reage também às mudanças do cronômetro (isActive)

  return null;
};