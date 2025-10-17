import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Star, ListChecks, ClipboardList, Syringe, Siren, BookOpen, Library, FlaskConical, Calculator as CalculatorIcon } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface Profile {
  id: string;
}

interface Favorite {
  id: string;
  item_id: string;
  item_type: string;
  item_title: string;
}

const fetchFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const iconMap: { [key: string]: LucideIcon } = {
  'Escala': ListChecks,
  'Procedimento': ClipboardList,
  'Medicamento': Syringe,
  'Protocolo de Emergência': Siren,
  'Guia': BookOpen,
  'Tópico de Revisão': Library,
  'Ferramenta': CalculatorIcon,
};

const FavoritesPage = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Navegação', title: 'Meus Favoritos', path: '/favorites', icon: 'Star' });
  }, [addActivity]);

  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ["favorites", profile?.id],
    queryFn: () => fetchFavorites(profile!.id),
    enabled: !!profile,
  });

  const groupedFavorites = favorites.reduce((acc, favorite) => {
    const { item_type } = favorite;
    if (!acc[item_type]) {
      acc[item_type] = [];
    }
    acc[item_type].push(favorite);
    return acc;
  }, {} as Record<string, Favorite[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Meus Favoritos</h1>
        <p className="text-muted-foreground">Acesse rapidamente suas ferramentas e conteúdos mais importantes.</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold">Nenhum favorito ainda</h3>
            <p className="text-muted-foreground mt-2">Procure por uma estrela <Star className="inline h-4 w-4 text-amber-400" /> nos conteúdos para adicioná-los aqui.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFavorites).map(([type, items]) => {
            const Icon = iconMap[type] || Star;
            return (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {type}s
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                      <Link to={item.item_id} key={item.id}>
                        <div className="p-4 border rounded-lg hover:bg-accent hover:border-primary transition-all h-full">
                          <p className="font-semibold text-foreground">{item.item_title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;