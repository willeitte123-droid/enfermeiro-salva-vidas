import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const INTERVAL_SECONDS = 60; // Salvar a cada 1 minuto

export const TimeTracker = () => {
  const { session } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    const trackTime = async () => {
      // Só conta se a aba estiver visível/focada
      if (document.visibilityState === 'visible') {
        await supabase.rpc('increment_user_activity', { seconds_to_add: INTERVAL_SECONDS });
      }
    };

    // Inicia o intervalo
    intervalRef.current = setInterval(trackTime, INTERVAL_SECONDS * 1000);

    // Limpa ao desmontar
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session]);

  return null; // Componente invisível
};