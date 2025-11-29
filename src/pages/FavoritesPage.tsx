import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Star, ListChecks, ClipboardList, Syringe, Siren, BookOpen, Library, Calculator as CalculatorIcon } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { cn } from "@/lib/utils";

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

const colorMap: { [key: string]: string } = {
  'Escala': "bg-emerald-100 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:border-emerald-500 dark:hover:border-emerald-500",
  'Procedimento': "bg-cyan-100 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 hover:border-cyan-500 dark:hover:border-cyan-500",
  'Medicamento': "bg-rose-100 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:border-rose-500 dark:hover:border-rose-500",
  'Protocolo de Emergência': "bg-orange-100 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 hover:border-orange-500 dark:hover:border-orange-500",
  'Guia': "bg-violet-100 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-300 hover:border-violet-500 dark:hover:border-violet-500",
  'Tópico de Revisão': "bg-indigo-100 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 hover:border-indigo-500 dark:hover:border-indigo-500",
  'Ferramenta': "bg-blue-100 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:border-blue-500 dark:hover:border-blue-500",
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
            const itemStyle = colorMap[type] || "bg-accent/50 border-border hover:border-primary";
            
            return (
              <Card key={type} className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className={cn("p-2 rounded-lg", itemStyle.split(' ')[0], itemStyle.split(' ')[3])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {type}s
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                      <Link to={item.item_id} key={item.id}>
                        <div className={cn(
                          "p-4 border rounded-xl transition-all duration-200 h-full flex items-center shadow-sm hover:shadow-md hover:scale-[1.02]",
                          itemStyle
                        )}>
                          <p className="font-bold text-sm sm:text-base">{item.item_title}</p>
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