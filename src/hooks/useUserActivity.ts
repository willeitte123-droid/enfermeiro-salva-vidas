import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useActivityTracker } from "./useActivityTracker";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as LucideIcons from "lucide-react";

interface Profile {
  id: string;
  first_name?: string;
}

interface Favorite {
  item_id: string;
  item_type: string;
  item_title: string;
}

const favoriteTypeToIconName: { [key: string]: string } = {
  'Escala': 'ListChecks',
  'Procedimento': 'ClipboardList',
  'Medicamento': 'Syringe',
  'Protocolo de Emergência': 'Siren',
  'Guia': 'BookOpen',
  'Tópico de Revisão': 'Library',
  'Ferramenta': 'Calculator',
};

export const useUserActivity = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { activities } = useActivityTracker();

  const userName = profile?.first_name || "Usuário";

  const recentActivity = activities.slice(0, 5).map(activity => ({
    ...activity,
    icon: activity.icon.toString(),
    timestamp: formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ptBR }),
  }));

  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ["favorites", profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from("user_favorites")
        .select("item_id, item_type, item_title")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!profile,
  });

  const formattedFavorites = favorites.map(fav => ({
    title: fav.item_title,
    path: fav.item_id,
    icon: favoriteTypeToIconName[fav.item_type] || 'Star',
  }));

  const allActivity = activities.map(activity => ({
    ...activity,
    timestamp: new Date(activity.timestamp).toISOString(),
  }));

  return {
    userName,
    recentActivity,
    favorites: formattedFavorites,
    allActivity,
  };
};