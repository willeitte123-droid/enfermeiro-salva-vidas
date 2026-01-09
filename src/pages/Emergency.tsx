import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  AlertCircle, Search, Siren, HeartPulse, Zap, 
  Thermometer, Activity, ShieldAlert, Brain
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const categoryStyles: Record<string, any> = {
  "Emergências Cardiovasculares": {
    icon: HeartPulse,
    style: "data-[state=active]:bg-red-100 data-[state=active]:text-red-700 data-[state=active]:border-red-200 dark:data-[state=active]:bg-red-900/40 dark:data-[state=active]:text-red-300 dark:data-[state=active]:border-red-700",
    cardBorder: "border-red-200 dark:border-red-800",
    topBorder: "border-t-red-500",
    headerBg: "bg-red-50 dark:bg-red-950/20",
    titleColor: "text-red-700 dark:text-red-400",
    iconColor: "text-red-600 dark:text-red-400",
    accordionTriggerHover: "hover:bg-red-50/50 dark:hover:bg-red-900/10"
  },
  "Emergências Neurológicas": {
    icon: Brain,
    style: "data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 data-[state=active]:border-violet-200 dark:data-[state=active]:bg-violet-900/40 dark:data-[state=active]:text-violet-300 dark:data-[state=active]:border-violet-700",
    cardBorder: "border-violet-200 dark:border-violet-800",
    topBorder: "border-t-violet-500",
    headerBg: "bg-violet-50 dark:bg-violet-950/20",
    titleColor: "text-violet-700 dark:text-violet-400",
    iconColor: "text-violet-600 dark:text-violet-400",
    accordionTriggerHover: "hover:bg-violet-50/50 dark:hover:bg-violet-900/10"
  },
  "Emergências Respiratórias": {
    icon: Activity,
    style: "data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 data-[state=active]:border-cyan-200 dark:data-[state=active]:bg-cyan-900/40 dark:data-[state=active]:text-cyan-300 dark:data-[state=active]:border-cyan-700",
    cardBorder: "border-cyan-200 dark:border-cyan-800",
    topBorder: "border-t-cyan-500",
    headerBg: "bg-cyan-50 dark:bg-cyan-950/20",
    titleColor: "text-cyan-700 dark:text-cyan-400",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    accordionTriggerHover: "hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10"
  },
  "Emergências Metabólicas e Sistêmicas": {
    icon: Thermometer,
    style: "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 dark:data-[state=active]:bg-emerald-900/40 dark:data-[state=active]:text-emerald-300 dark:data-[state=active]:border-emerald-700",
    cardBorder: "border-emerald-200 dark:border-emerald-800",
    topBorder: "border-t-emerald-500",
    headerBg: "bg-emerald-50 dark:bg-emerald-950/20",
    titleColor: "text-emerald-700 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accordionTriggerHover: "hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
  },
  "Trauma e Ambiente": {
    icon: ShieldAlert,
    style: "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 dark:data-[state=active]:bg-amber-900/40 dark:data-[state=active]:text-amber-300 dark:data-[state=active]:border-amber-700",
    cardBorder: "border-amber-200 dark:border-amber-800",
    topBorder: "border-t-amber-500",
    headerBg: "bg-amber-50 dark:bg-amber-950/20",
    titleColor: "text-amber-700 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
    accordionTriggerHover: "hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
  }
};

const Emergency = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");
  const { addActivity } = useActivityTracker();
  const [activeTab, setActiveTab] = useState(emergencyProtocols[0].category);

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

  const displayItems = useMemo(() => {
    if (!searchTerm) {
        const category = emergencyProtocols.find(c => c.category === activeTab);
        return category ? category.items : [];
    }
    
    return emergencyProtocols.flatMap(cat => cat.items).filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.some(c => c.text.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12 w-full max-w-full overflow-hidden">
      
      {/* 1. Header Imersivo - Responsivo */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-700 via-orange-600 to-rose-600 p-6 sm:p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-50">
              <Siren className="h-3 w-3 animate-pulse" /> Protocolos de Ação Rápida
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Urgência e <br className="hidden sm:block" /> Emergência
            </h1>
            <p className="text-red-100 max-w-lg text-xs sm:text-base lg:text-lg leading-relaxed">
              Guias essenciais para tomada de decisão em situações críticas. Tempo é vida.
            </p>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
            <HeartPulse className="w-32 h-32 lg:w-40 lg:h-40 text-white/90 relative z-10 drop-shadow-2xl" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-48 h-48 lg:w-64 lg:h-64 bg-orange-500/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        
        {profile && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
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

      {/* 2. Barra de Busca e Filtros - Sticky simplificado e seguro */}
      <div className="sticky top-0 z-30 py-2 bg-background/95 backdrop-blur-sm border-b transition-all -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-b-0 sm:static">
        <div className="flex flex-col gap-3">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar protocolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 sm:h-12 text-sm sm:text-base bg-card border-border/50 shadow-sm focus:ring-2 focus:ring-red-500/20 rounded-xl w-full"
            />
          </div>
          
          <div className="w-full overflow-x-auto pb-1 no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <Button 
                    key={filter.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm(filter.term)}
                    className={cn(
                      "rounded-full h-8 sm:h-10 px-3 sm:px-4 gap-2 bg-card border-border/50 shadow-sm hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap text-xs sm:text-sm",
                      searchTerm === filter.term && "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {filter.label}
                  </Button>
                );
              })}
              {searchTerm && (
                <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="rounded-full h-8 sm:h-10 px-3 text-muted-foreground text-xs sm:text-sm">
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Aviso Clínico */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 sm:p-4 rounded-xl flex items-start gap-3 shadow-sm">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-800 dark:text-amber-400 text-xs sm:text-sm uppercase tracking-wide">Aviso Importante</h4>
          <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 leading-snug">
            Estes protocolos são para consulta rápida e suporte à decisão. Sempre siga as diretrizes institucionais do seu serviço e priorize a avaliação clínica do paciente.
          </p>
        </div>
      </div>

      {/* 4. Conteúdo em Abas */}
      {searchTerm ? (
         // Se houver busca, mostra lista direta
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {displayItems.length > 0 ? (
                displayItems.map((item, index) => {
                    const Icon = LucideIcons[item.icon] as LucideIcons.LucideIcon;
                    const itemId = `/emergency#${item.title.toLowerCase().replace(/\s+/g, '-')}`;
                    const originalCategory = emergencyProtocols.find(cat => cat.items.some(i => i.title === item.title))?.category || "Emergências Cardiovasculares";
                    const style = categoryStyles[originalCategory] || categoryStyles["Emergências Cardiovasculares"];

                    return (
                        <Card key={index} className={cn("border-t-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group", style.cardBorder, style.topBorder)}>
                            <CardHeader className={cn("pb-3 border-b py-3 sm:py-4", style.headerBg)}>
                                <CardTitle className={cn("flex items-center gap-2 text-base sm:text-lg", style.titleColor)}>
                                    {Icon && <Icon className={cn("h-5 w-5 shrink-0", style.iconColor)} />} 
                                    <span className="leading-tight">{item.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={item.title} className="border-0 px-0 sm:px-4 bg-card">
                                        <div className="flex items-center w-full py-1 px-4 sm:px-0">
                                            <AccordionTrigger className={cn("flex-1 hover:no-underline text-left py-4 transition-colors text-sm font-medium text-muted-foreground group-data-[state=open]:text-primary", style.accordionTriggerHover)}>
                                                Ver Protocolo Completo
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
                                                        className="h-8 w-8 sm:h-9 sm:w-9 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 transition-opacity"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <AccordionContent className="pt-2 pb-6 px-4 sm:px-0 animate-accordion-down">
                                            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground/90">
                                                {item.content.map((line, idx) => (
                                                    <div key={idx} className="prose dark:prose-invert max-w-none prose-sm overflow-hidden" dangerouslySetInnerHTML={{ __html: line.text }} />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    );
                })
            ) : (
                <Card className="col-span-full border-dashed border-2 bg-muted/10">
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
      ) : (
        // Se não houver busca, mostra estrutura de Abas
        <Tabs defaultValue={emergencyProtocols[0].category} value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Scrollable Tabs Wrapper - Otimizado para Mobile */}
            <div className="w-full max-w-[100vw] -mx-4 px-4 sm:mx-0 sm:px-0">
                <ScrollArea className="w-full whitespace-nowrap rounded-xl border-0 bg-transparent mb-4">
                    <TabsList className="flex w-max space-x-2 h-auto bg-transparent p-1">
                        {emergencyProtocols.map(cat => {
                            const style = categoryStyles[cat.category] || categoryStyles["Emergências Cardiovasculares"];
                            const Icon = style.icon;
                            return (
                                <TabsTrigger 
                                    key={cat.category} 
                                    value={cat.category}
                                    className={cn(
                                        "rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all hover:bg-accent",
                                        style.style
                                    )}
                                >
                                    <Icon className="mr-1.5 h-3.5 w-3.5" />
                                    {cat.category.replace("Emergências ", "")}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
            </div>

            {emergencyProtocols.map(cat => {
                const style = categoryStyles[cat.category] || categoryStyles["Emergências Cardiovasculares"];
                return (
                    <TabsContent key={cat.category} value={cat.category} className="mt-2 sm:mt-4 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {cat.items.map((item, index) => {
                                const Icon = LucideIcons[item.icon] as LucideIcons.LucideIcon;
                                const itemId = `/emergency#${item.title.toLowerCase().replace(/\s+/g, '-')}`;
                                return (
                                    <Card key={index} className={cn("border-t-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group", style.cardBorder, style.topBorder)}>
                                        <CardHeader className={cn("pb-3 border-b py-3 sm:py-4", style.headerBg)}>
                                            <CardTitle className={cn("flex items-center gap-2 text-base sm:text-lg", style.titleColor)}>
                                                {Icon && <Icon className={cn("h-5 w-5 shrink-0", style.iconColor)} />} 
                                                <span className="leading-tight">{item.title}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0 flex-1">
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="details" className="border-0 px-0 sm:px-4 bg-card">
                                                    <AccordionTrigger className={cn("flex-1 hover:no-underline text-left py-4 px-4 sm:px-0 transition-colors text-sm font-medium text-muted-foreground group-data-[state=open]:text-primary", style.accordionTriggerHover)}>
                                                        Ver Protocolo Completo
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-0 pb-6 px-4 sm:px-0 animate-accordion-down">
                                                        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground/90">
                                                            {item.content.map((line, idx) => (
                                                                <div key={idx} className="prose dark:prose-invert max-w-none prose-sm overflow-hidden" dangerouslySetInnerHTML={{ __html: line.text }} />
                                                            ))}
                                                        </div>
                                                        <div className="mt-4 flex justify-end">
                                                            {profile && (
                                                                <FavoriteButton
                                                                    userId={profile.id}
                                                                    itemId={itemId}
                                                                    itemType="Protocolo de Emergência"
                                                                    itemTitle={item.title}
                                                                    isInitiallyFavorited={favoriteSet.has(itemId)}
                                                                    isLoading={isLoadingFavorites}
                                                                />
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                );
            })}
        </Tabs>
      )}
    </div>
  );
};

export default Emergency;