import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Star, ListChecks, ClipboardList, Syringe, Siren, 
  BookOpen, Library, Calculator as CalculatorIcon, ArrowRight,
  Heart, Sparkles, Bookmark
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  first_name: string;
}

interface Favorite {
  id: string;
  item_id: string;
  item_type: string;
  item_title: string;
  created_at: string;
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

// Configuração visual por categoria
const categoryConfig: Record<string, { icon: LucideIcon, gradient: string, text: string, border: string, iconBg: string }> = {
  'Escala': { 
    icon: ListChecks, 
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50"
  },
  'Procedimento': { 
    icon: ClipboardList, 
    gradient: "from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/50"
  },
  'Medicamento': { 
    icon: Syringe, 
    gradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    iconBg: "bg-rose-100 dark:bg-rose-900/50"
  },
  'Protocolo de Emergência': { 
    icon: Siren, 
    gradient: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    iconBg: "bg-orange-100 dark:bg-orange-900/50"
  },
  'Guia': { 
    icon: BookOpen, 
    gradient: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
    iconBg: "bg-violet-100 dark:bg-violet-900/50"
  },
  'Tópico de Revisão': { 
    icon: Library, 
    gradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50"
  },
  'Ferramenta': { 
    icon: CalculatorIcon, 
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/50"
  },
  'Documento': { 
    icon: Bookmark, 
    gradient: "from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
    iconBg: "bg-slate-100 dark:bg-slate-900/50"
  },
};

const FavoritesPage = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const navigate = useNavigate();

  useEffect(() => {
    addActivity({ type: 'Navegação', title: 'Meus Favoritos', path: '/favorites', icon: 'Star' });
  }, [addActivity]);

  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ["favorites", profile?.id],
    queryFn: () => fetchFavorites(profile!.id),
    enabled: !!profile,
  });

  const groupedFavorites = useMemo(() => {
    return favorites.reduce((acc, favorite) => {
      const { item_type } = favorite;
      if (!acc[item_type]) {
        acc[item_type] = [];
      }
      acc[item_type].push(favorite);
      return acc;
    }, {} as Record<string, Favorite[]>);
  }, [favorites]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 relative z-10" />
        </div>
        <p className="text-muted-foreground animate-pulse">Carregando sua coleção...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Header Imersivo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-8 sm:p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-amber-100">
            <Heart className="h-3 w-3 fill-current" /> Seus itens salvos
          </div>
          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">Meus Favoritos</h1>
            <p className="text-amber-100 max-w-xl text-sm sm:text-lg leading-relaxed">
              Sua biblioteca pessoal de conhecimento. Acesse rapidamente as ferramentas, protocolos e conteúdos mais importantes para sua rotina.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
          <Star className="w-64 h-64 text-white/10 rotate-12 fill-white/5" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-10 right-20 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-20 right-40 w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-muted/20 border-2 border-dashed border-muted rounded-3xl text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-background p-6 rounded-full shadow-lg relative group">
            <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full group-hover:bg-amber-400/30 transition-all duration-500"></div>
            <Star className="h-12 w-12 text-amber-500 relative z-10 fill-amber-500/10" />
          </div>
          <div className="max-w-md px-4">
            <h3 className="text-2xl font-bold text-foreground">Sua coleção está vazia</h3>
            <p className="text-muted-foreground mt-2">
              Explore a plataforma e clique no ícone de estrela <Star className="inline h-3.5 w-3.5 text-amber-500" /> para salvar seus conteúdos preferidos aqui.
            </p>
          </div>
          <Button onClick={() => navigate('/')} size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
            Explorar Conteúdos
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFavorites).map(([type, items]) => {
            const config = categoryConfig[type] || { 
              icon: Star, 
              gradient: "from-slate-50 to-gray-50", 
              text: "text-slate-700", 
              border: "border-slate-200", 
              iconBg: "bg-slate-100" 
            };
            const Icon = config.icon;
            
            return (
              <div key={type} className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 px-2">
                  <div className={cn("p-2 rounded-lg shadow-sm", config.iconBg)}>
                    <Icon className={cn("h-5 w-5", config.text)} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">{type}s</h2>
                  <Badge variant="secondary" className="ml-auto bg-muted/50 text-muted-foreground">
                    {items.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => (
                    <Link to={item.item_id} key={item.id} className="group outline-none">
                      <Card className={cn(
                        "h-full border transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 group-hover:shadow-lg group-focus-visible:ring-2 ring-primary ring-offset-2",
                        config.border,
                        "bg-card/50 backdrop-blur-sm"
                      )}>
                        {/* Gradient Background Effect */}
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-br opacity-40 group-hover:opacity-60 transition-opacity duration-500",
                          config.gradient
                        )} />
                        
                        <CardContent className="p-5 relative z-10 flex flex-col h-full">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className={cn(
                              "p-2.5 rounded-xl bg-background/80 backdrop-blur shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-300",
                              config.text
                            )}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                              <div className="bg-background/80 p-1.5 rounded-full shadow-sm text-muted-foreground">
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-auto space-y-1">
                            <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                              {item.item_title}
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              Salvo em favoritos
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;