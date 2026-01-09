import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  AlertCircle, Search, Siren, HeartPulse, Zap, 
  Thermometer, Activity, Filter, ShieldAlert 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FavoriteButton from "@/components/FavoriteButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "lucide-react";
import emergencyProtocolsData from "@/data/emergencies.json";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
}

interface ContentLine {
  text: string;
}

interface EmergencyItem {
  title: string;
  icon: keyof typeof LucideIcons;
  color: string;
  openColor: string;
  content: ContentLine[];
}

interface EmergencyCategory {
  category: string;
  color: string;
  items: EmergencyItem[];
}

const emergencyProtocols: EmergencyCategory[] = emergencyProtocolsData;

const quickFilters = [
  { label: "PCR", icon: HeartPulse, term: "Parada" },
  { label: "Choque", icon: Zap, term: "Choque" },
  { label: "Trauma", icon: ShieldAlert, term: "Trauma" },
  { label: "Respiratório", icon: Activity, term: "Asmática" },
];

const Emergency = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Guia', title: 'Urgências e Emergências', path: '/emergency', icon: 'Siren' });
  }, [addActivity]);

  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', profile?.id, 'Protocolo de Emergência'],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', profile.id)
        .eq('item_type', 'Protocolo de Emergência');
      if (error) throw error;
      return data.map(f => f.item_id);
    },
    enabled: !!profile,
  });

  const favoriteSet = useMemo(() => new Set(favoritesData || []), [favoritesData]);

  const filteredProtocols = useMemo(() => {
    if (!searchTerm) {
      return emergencyProtocols;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return emergencyProtocols
      .map(category => {
        const filteredItems = category.items.filter(
          item =>
            item.title.toLowerCase().includes(lowercasedFilter) ||
            item.content.some(c => c.text.toLowerCase().includes(lowercasedFilter))
        );
        return { ...category, items: filteredItems };
      })
      .filter(category => category.items.length > 0);
  }, [searchTerm, emergencyProtocols]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      
      {/* 1. Header Imersivo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-orange-600 to-rose-600 p-8 sm:p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-red-50">
              <Siren className="h-3 w-3 animate-pulse" /> Protocolos de Ação Rápida
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Urgência e <br className="hidden sm:block" /> Emergência
            </h1>
            <p className="text-red-100 max-w-lg text-sm sm:text-lg leading-relaxed">
              Guias essenciais para tomada de decisão em situações críticas. Tempo é vida.
            </p>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
            <HeartPulse className="w-40 h-40 text-white/90 relative z-10 drop-shadow-2xl" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-orange-500/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/emergency"
              itemType="Guia"
              itemTitle="Guia de Emergências"
              isInitiallyFavorited={favoriteSet.has("/emergency")}
              isLoading={isLoadingFavorites}
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      {/* 2. Barra de Busca e Filtros Rápidos (Sticky) */}
      <div className="sticky top-0 z-30 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 bg-background/80 backdrop-blur-lg border-b sm:border-none sm:bg-transparent transition-all space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar protocolo (ex: PCR, IAM, Choque...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base bg-card border-border/50 shadow-sm focus:ring-2 focus:ring-red-500/20 rounded-xl"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button 
                  key={filter.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm(filter.term)}
                  className={cn(
                    "rounded-full h-10 px-4 gap-2 bg-card border-border/50 shadow-sm hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap",
                    searchTerm === filter.term && "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  )}
                >
                  <Icon className="h-4 w-4" /> {filter.label}
                </Button>
              );
            })}
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="rounded-full h-10 px-3 text-muted-foreground">
                Limpar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Aviso Clínico */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex items-start gap-3 shadow-sm">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm uppercase tracking-wide">Aviso Importante</h4>
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-snug">
            Estes protocolos são para consulta rápida e suporte à decisão. Sempre siga as diretrizes institucionais do seu serviço e priorize a avaliação clínica do paciente.
          </p>
        </div>
      </div>

      {/* 4. Grid de Protocolos */}
      {filteredProtocols.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProtocols.map((category) => (
            <Card key={category.category} className="border-t-4 border-t-transparent shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col" style={{ borderTopColor: 'var(--primary)' }}> {/* Fallback color, dynamic in className */}
              <CardHeader className={cn("pb-3 border-b bg-muted/30", category.color)}>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5" /> {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => {
                    const Icon = LucideIcons[item.icon] as LucideIcons.LucideIcon;
                    const itemId = `/emergency#${item.title.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                      <AccordionItem value={item.title} key={item.title} className="border-b last:border-0 px-4 bg-card group/item">
                        <div className="flex items-center w-full py-1">
                          <AccordionTrigger className="flex-1 hover:no-underline text-left py-4 group-data-[state=open]/item:text-primary transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={cn("p-2.5 rounded-xl bg-muted group-hover/item:bg-muted/80 transition-all shrink-0", `text-${item.color.split('-')[1]}-600 dark:text-${item.color.split('-')[1]}-400`)}>
                                {Icon && <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
                              </div>
                              <span className="font-bold text-base sm:text-lg">{item.title}</span>
                            </div>
                          </AccordionTrigger>
                          <div className="pl-2">
                            {profile && (
                              <FavoriteButton
                                userId={profile.id}
                                itemId={itemId}
                                itemType="Protocolo de Emergência"
                                itemTitle={item.title}
                                isInitiallyFavorited={favoriteSet.has(itemId)}
                                isLoading={isLoadingFavorites}
                                className="h-9 w-9 opacity-0 group-hover/item:opacity-100 focus:opacity-100 transition-opacity"
                              />
                            )}
                          </div>
                        </div>
                        <AccordionContent className="pt-2 pb-6 animate-accordion-down">
                          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground/90">
                            {item.content.map((line, idx) => (
                              <div key={idx} className="prose dark:prose-invert max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: line.text }} />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="py-20 text-center text-muted-foreground flex flex-col items-center gap-4">
            <div className="bg-muted p-4 rounded-full">
              <Search className="h-12 w-12 opacity-20" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Nenhum protocolo encontrado</h3>
              <p>Tente buscar por termos como "PCR", "Infarto" ou "Choque".</p>
            </div>
            <Button variant="outline" onClick={() => setSearchTerm("")}>Limpar Busca</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Emergency;