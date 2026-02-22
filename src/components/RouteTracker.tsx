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
      
      // Bloqueio Total para Admins: Não rastrear navegação de administradores
      if (profile?.role === 'admin') return;

      try {
        await supabase.from('access_logs').insert({
          user_id: session.user.id,
          path: location.pathname
        });
      } catch (error) {
        // Silenciosamente falha para não atrapalhar o usuário
        console.error("Erro ao logar acesso:", error);
      }
    };

    // Só executa se o perfil já estiver carregado e não for admin
    if (profile) {
      logAccess();
    }
  }, [location.pathname, session, profile]);

  return null;
};