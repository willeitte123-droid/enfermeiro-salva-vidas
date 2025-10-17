import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, CheckSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FavoriteButton from "@/components/FavoriteButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "lucide-react";
import proceduresData from "@/data/procedures.json";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface Profile {
  id: string;
}

interface Procedure {
  title: string;
  icon: keyof typeof LucideIcons;
  color: string;
  openColor: string;
  description: string;
  materials: string[];
  steps: string[];
  observations: string;
  category: "Acessos e Punções" | "Sondagens e Drenagem" | "Vias Aéreas" | "Monitoramento e Emergência" | "Cuidados Gerais";
}

const procedures: Procedure[] = proceduresData;

const Procedures = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Guia', title: 'Guia de Procedimentos', path: '/procedures', icon: 'ClipboardList' });
  }, [addActivity]);

  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', profile?.id, 'Procedimento'],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', profile.id)
        .eq('item_type', 'Procedimento');
      if (error) throw error;
      return data.map(f => f.item_id);
    },
    enabled: !!profile,
  });

  const favoriteSet = useMemo(() => new Set(favoritesData || []), [favoritesData]);

  const categories = useMemo(() => {
    const allCategories = procedures.map(p => p.category);
    return ["Todos", ...Array.from(new Set(allCategories))];
  }, [procedures]);

  const filteredProcedures = useMemo(() => {
    return procedures
      .filter(proc => activeCategory === "Todos" || proc.category === activeCategory)
      .filter(proc =>
        proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, activeCategory, procedures]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Guia de Procedimentos</h1>
        <p className="text-muted-foreground">Checklists passo a passo para os principais procedimentos de enfermagem</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por procedimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap h-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filteredProcedures.length > 0 ? (
        <div className="space-y-4">
          {filteredProcedures.map((proc, index) => {
            const Icon = LucideIcons[proc.icon] as LucideIcons.LucideIcon;
            const itemId = `/procedures#${proc.title.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <Accordion type="single" collapsible key={index}>
                <AccordionItem value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
                  <div className="flex items-center">
                    <AccordionTrigger className="flex-1 group hover:no-underline text-left py-0">
                      <div className="flex items-center gap-3 py-4">
                        {Icon && <Icon className={`h-5 w-5 ${proc.color} flex-shrink-0 transition-colors group-data-[state=open]:${proc.openColor}`} />}
                        <span className="font-semibold text-left">{proc.title}</span>
                      </div>
                    </AccordionTrigger>
                    <div className="pl-4">
                      {profile && (
                        <FavoriteButton
                          userId={profile.id}
                          itemId={itemId}
                          itemType="Procedimento"
                          itemTitle={proc.title}
                          isInitiallyFavorited={favoriteSet.has(itemId)}
                          isLoading={isLoadingFavorites}
                        />
                      )}
                    </div>
                  </div>
                  <AccordionContent className="pt-4 space-y-6">
                    <p className="text-sm text-muted-foreground">{proc.description}</p>
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Materiais Essenciais</h4>
                      <div className="flex flex-wrap gap-2">
                        {proc.materials.map((material, i) => (
                          <Badge key={i} variant="secondary">{material}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-3">Passo a Passo</h4>
                      <ol className="space-y-3">
                        {proc.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <CheckSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: step }} />
                          </li>
                        ))}
                      </ol>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle className="font-semibold">Pontos Críticos</AlertTitle>
                      <AlertDescription>
                        {proc.observations}
                      </AlertDescription>
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum procedimento encontrado para os filtros selecionados.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Procedures;