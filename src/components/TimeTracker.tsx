import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const INTERVAL_SECONDS = 10; // Salvar a cada 10 segundos para maior precisão

export const TimeTracker = () => {
  const { session } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    const saveTime = async () => {
      // Só salva se a página estiver realmente visível para o usuário
      if (document.visibilityState === 'visible') {
        await supabase.rpc('increment_user_activity', { seconds_to_add: INTERVAL_SECONDS });
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

    // Iniciar o timer se a página já estiver visível
    if (document.visibilityState === 'visible') {
      startTimer();
    }

    // Ouvinte de eventos para pausar/retomar quando o usuário troca de aba
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
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
  }, [session]);

  return null;
};