import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export const IpTracker = () => {
  const { session } = useAuth();

  useEffect(() => {
    const trackUserLocation = async () => {
      if (!session?.user) return;

      try {
        // Verifica se já rastreamos recentemente (opcional, para economizar chamadas)
        const lastTrackedKey = `last_tracked_${session.user.id}`;
        const lastTracked = localStorage.getItem(lastTrackedKey);
        const now = Date.now();
        
        // Rastrea a cada 1 hora no máximo para não sobrecarregar
        if (lastTracked && now - parseInt(lastTracked) < 3600000) {
           return;
        }

        // Serviço gratuito para obter IP e Localização
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Falha ao obter dados de IP');
        
        const data = await response.json();
        
        const ip = data.ip;
        const location = `${data.city}, ${data.region_code} - ${data.country_code}`; // Ex: São Paulo, SP - BR

        if (ip || location) {
          await supabase
            .from('profiles')
            .update({ 
              last_ip: ip,
              location: location
            })
            .eq('id', session.user.id);
            
          localStorage.setItem(lastTrackedKey, now.toString());
        }

      } catch (error) {
        console.error("Erro ao rastrear localização:", error);
      }
    };

    trackUserLocation();
  }, [session]);

  return null;
};