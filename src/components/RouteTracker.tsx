import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export const RouteTracker = () => {
  const location = useLocation();
  const { session } = useAuth();

  useEffect(() => {
    const logAccess = async () => {
      if (!session?.user) return;

      try {
        // Ignora rotas administrativas para não poluir os dados de uso real
        if (location.pathname.startsWith('/admin')) return;

        await supabase.from('access_logs').insert({
          user_id: session.user.id,
          path: location.pathname
        });
      } catch (error) {
        // Silenciosamente falha para não atrapalhar o usuário
        console.error("Erro ao logar acesso:", error);
      }
    };

    logAccess();
  }, [location.pathname, session]);

  return null;
};