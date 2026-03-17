import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export const MetaPixel = () => {
  const { pathname } = useLocation();
  const { session } = useAuth();
  const { data: profile } = useProfile(session);

  useEffect(() => {
    // Verifica se o script base do Facebook foi carregado no index.html
    if (typeof window === 'undefined' || !(window as any).fbq) return;

    // Objeto de Correspondência Avançada (Advanced Matching)
    const advancedMatching: any = {};
    
    // Se o usuário estiver logado, pegamos os dados dele
    if (session?.user?.email) {
      advancedMatching.em = session.user.email.toLowerCase().trim();
    }
    
    if (profile?.first_name) {
      advancedMatching.fn = profile.first_name.toLowerCase().trim();
    }
    
    if (profile?.last_name) {
      advancedMatching.ln = profile.last_name.toLowerCase().trim();
    }

    // Inicializa o Pixel passando os dados do usuário (se houver)
    (window as any).fbq('init', '1336974837913423', advancedMatching);
    
    // Dispara o evento de PageView a cada mudança de rota
    (window as any).fbq('track', 'PageView');
    
  }, [pathname, session, profile]);

  return null;
};