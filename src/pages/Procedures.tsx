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
import { Info, Search, Package, Footprints, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FavoriteButton from "@/components/FavoriteButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "lucide-react";
import proceduresData from "@/data/procedures.json";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import EcgPlacementDiagram from "@/components/diagrams/EcgPlacementDiagram";
import AvpSitesDiagram from "@/components/diagrams/AvpSitesDiagram";
import { cn } from "@/lib/utils";

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
  diagramComponent?: string;
}

const procedures: Procedure[] = proceduresData;

const diagramMap: { [key: string]: React.ComponentType } = {
  EcgPlacementDiagram,
  AvpSitesDiagram,
};

const Procedures = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
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

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = new Set(procedures.map(p => p.category));
    return ["Todos", ...Array.from(cats)];
  }, []);

  const filteredProcedures = useMemo(() => {
    return procedures.filter(proc => {
      const matchesSearch = 
        proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeTab === "Todos" || proc.category === activeTab;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeTab]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Guia de Procedimentos</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/procedures"
              itemType="Guia"
              itemTitle="Guia de Procedimentos"
            />
          )}
        </div>
        <p className="text-muted-foreground">Protocolos passo a passo para a prática segura de enfermagem</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar procedimento (ex: Sonda, Curativo, Punção...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs with Horizontal Scroll */}
        <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card p-2 shadow-sm">
          <div className="flex w-max space-x-2 p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  activeTab === cat
                    ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                )}
              >
                {cat === "Todos" && <ListFilter className="mr-2 h-3 w-3" />}
                {cat}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {filteredProcedures.length > 0 ? (
        <div className="space-y-4">
          {filteredProcedures.map((proc, index) => {
            const Icon = LucideIcons[proc.icon] as LucideIcons.LucideIcon;
            const itemId = `/procedures#${proc.title.toLowerCase().replace(/\s+/g, '-')}`;
            const DiagramComponent = proc.diagramComponent ? diagramMap[proc.diagramComponent] : null;
            
            return (
              <Accordion type="single" collapsible key={`${proc.title}-${index}`}>
                <AccordionItem value={`item-${index}`} className="border rounded-lg px-0 bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center px-4">
                    <AccordionTrigger className="flex-1 group hover:no-underline text-left py-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors`}>
                          {Icon && <Icon className={`h-6 w-6 ${proc.color} transition-colors group-data-[state=open]:${proc.openColor}`} />}
                        </div>
                        <div>
                          <span className="font-semibold text-lg block">{proc.title}</span>
                          <span className="text-xs text-muted-foreground font-normal hidden sm:block">{proc.description}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <div className="pl-2">
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
                  
                  <AccordionContent className="px-0 pb-0">
                    {/* Descrição Mobile (se necessário) */}
                    <div className="px-6 pb-4 sm:hidden text-sm text-muted-foreground border-b border-border/50">
                      {proc.description}
                    </div>

                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                      {/* Coluna 1: Materiais */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/30 md:col-span-1">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                          <Package className="h-4 w-4" /> Materiais Necessários
                        </h4>
                        <ul className="space-y-2">
                          {proc.materials.map((material, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                              {material}
                            </li>
                          ))}
                        </ul>
                        {DiagramComponent && (
                          <div className="mt-6">
                            <DiagramComponent />
                          </div>
                        )}
                      </div>

                      {/* Coluna 2: Passo a Passo */}
                      <div className="p-6 md:col-span-2 bg-background">
                        <h4 className="font-bold text-primary mb-6 flex items-center gap-2">
                          <Footprints className="h-4 w-4" /> Passo a Passo
                        </h4>
                        
                        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-3.5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                          {proc.steps.map((step, i) => (
                            <div key={i} className="relative flex gap-4 pb-6 last:pb-0 group">
                              <div className="absolute left-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm group-hover:border-primary transition-colors z-10">
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">{i + 1}</span>
                              </div>
                              <div className="pl-8">
                                <p className="text-sm leading-relaxed text-foreground/90" dangerouslySetInnerHTML={{ __html: step }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8">
                          <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                            <Info className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                            <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold ml-2">Ponto de Atenção</AlertTitle>
                            <AlertDescription className="text-amber-700 dark:text-amber-300 ml-2 mt-1 text-sm">
                              {proc.observations}
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Search className="h-8 w-8 opacity-20" />
            <p>Nenhum procedimento encontrado para os filtros selecionados.</p>
            <p className="text-xs">Tente mudar a categoria para "Todos" ou buscar por outro termo.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Procedures;