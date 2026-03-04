import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export const RouteTracker = () => {
  const location = useLocation();
  const { session } = useAuth();
  const { data: profile } = useProfile(session);

  useEffect(() => {
    const logAccess = async () => {
      if (!session?.user) return;
      
      // Removido o bloqueio para administradores para permitir visualização de dados durante testes
      try {
        await supabase.from('access_logs').insert({
          user_id: session.user.id,
          path: location.pathname
        });
      } catch (error) {
        console.error("Erro ao logar acesso:", error);
      }
    };

    if (profile) {
      logAccess();
    }
  }, [location.pathname, session, profile]);

  return null;
};