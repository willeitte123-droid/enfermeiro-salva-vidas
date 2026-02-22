import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const INTERVAL_SECONDS = 10; // Salvar a cada 10 segundos para maior precisão

export const TimeTracker = () => {
  const { session } = useAuth();
  const { data: profile } = useProfile(session);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    // Bloqueio Total para Admins: Não rastrear tempo de uso de administradores
    if (profile?.role === 'admin') return;

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

    // Iniciar o timer se a página já estiver visível e o perfil carregado
    if (document.visibilityState === 'visible' && profile) {
      startTimer();
    }

    // Ouvinte de eventos para pausar/retomar quando o usuário troca de aba
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && profile?.role !== 'admin') {
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
  }, [session, profile]); // Dependência do perfil adicionada para reagir ao carregamento

  return null;
};