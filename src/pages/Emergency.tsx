import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  AlertCircle, Search, Siren, HeartPulse, Zap, 
  Thermometer, Activity, ShieldAlert, Brain, 
  Stethoscope, Flame, AlertTriangle
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
    border: "border-red-200 dark:border-red-800",
    headerBg: "bg-red-50 dark:bg-red-950/20",
    titleColor: "text-red-700 dark:text-red-400"
  },
  "Emergências Neurológicas": {
    icon: Brain,
    style: "data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 data-[state=active]:border-violet-200 dark:data-[state=active]:bg-violet-900/40 dark:data-[state=active]:text-violet-300 dark:data-[state=active]:border-violet-700",
    border: "border-violet-200 dark:border-violet-800",
    headerBg: "bg-violet-50 dark:bg-violet-950/20",
    titleColor: "text-violet-700 dark:text-violet-400"
  },
  "Emergências Respiratórias": {
    icon: Activity, // Wind não é tão comum, Activity serve bem ou Stethoscope
    style: "data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 data-[state=active]:border-cyan-200 dark:data-[state=active]:bg-cyan-900/40 dark:data-[state=active]:text-cyan-300 dark:data-[state=active]:border-cyan-700",
    border: "border-cyan-200 dark:border-cyan-800",
    headerBg: "bg-cyan-50 dark:bg-cyan-950/20",
    titleColor: "text-cyan-700 dark:text-cyan-400"
  },
  "Emergências Metabólicas e Sistêmicas": {
    icon: Thermometer,
    style: "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 dark:data-[state=active]:bg-emerald-900/40 dark:data-[state=active]:text-emerald-300 dark:data-[state=active]:border-emerald-700",
    border: "border-emerald-200 dark:border-emerald-800",
    headerBg: "bg-emerald-50 dark:bg-emerald-950/20",
    titleColor: "text-emerald-700 dark:text-emerald-400"
  },
  "Trauma e Ambiente": {
    icon: ShieldAlert,
    style: "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 dark:data-[state=active]:bg-amber-900/40 dark:data-[state=active]:text-amber-300 dark:data-[state=active]:border-amber-700",
    border: "border-amber-200 dark:border-amber-800",
    headerBg: "bg-amber-50 dark:bg-amber-950/20",
    titleColor: "text-amber-700 dark:text-amber-400"
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

  // Se houver busca, mostramos todos os itens que dão match, ignorando a aba ativa (ou mudamos a visualização)
  // Para manter consistência com o design de abas, se houver busca, vamos filtrar dentro da aba ativa? 
  // Não, melhor mostrar tudo que corresponde à busca.
  
  const displayItems = useMemo(() => {
    if (!searchTerm) {
        // Retorna apenas os itens da aba ativa
        const category = emergencyProtocols.find(c => c.category === activeTab);
        return category ? category.items : [];
    }
    
    // Se tem busca, retorna tudo que combina
    return emergencyProtocols.flatMap(cat => cat.items).filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.some(c => c.text.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, activeTab]);

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

      {/* 4. Conteúdo em Abas */}
      {searchTerm ? (
         // Se houver busca, mostra lista direta
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayItems.length > 0 ? (
                displayItems.map((item, index) => {
                    const Icon = LucideIcons[item.icon] as LucideIcons.LucideIcon;
                    const itemId = `/emergency#${item.title.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                        <Card key={index} className="border-t-4 border-t-transparent shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border-l-4 border-l-red-500">
                            <CardContent className="p-0 flex-1">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={item.title} className="border-0 px-4 bg-card">
                                        <div className="flex items-center w-full py-1">
                                            <AccordionTrigger className="flex-1 hover:no-underline text-left py-4 group-data-[state=open]:text-primary transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("p-2.5 rounded-xl bg-muted group-hover:bg-muted/80 transition-all shrink-0 text-red-600 dark:text-red-400")}>
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
                                                        className="h-9 w-9 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
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
            <div className="w-full max-w-[calc(100vw-2rem)] mx-auto">
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
                    <TabsContent key={cat.category} value={cat.category} className="mt-4 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {cat.items.map((item, index) => {
                                const Icon = LucideIcons[item.icon] as LucideIcons.LucideIcon;
                                const itemId = `/emergency#${item.title.toLowerCase().replace(/\s+/g, '-')}`;
                                return (
                                    <Card key={index} className={cn("border-t-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group", style.border)} style={{ borderTopColor: 'currentColor' }}>
                                        <CardHeader className={cn("pb-3 border-b", style.headerBg)}>
                                            <CardTitle className={cn("flex items-center gap-2 text-lg", style.titleColor)}>
                                                {Icon && <Icon className="h-5 w-5" />} {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0 flex-1">
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="details" className="border-0 px-4 bg-card">
                                                    <AccordionTrigger className="flex-1 hover:no-underline text-left py-4 transition-colors text-sm font-medium text-muted-foreground">
                                                        Ver Protocolo Completo
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-0 pb-6 animate-accordion-down">
                                                        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground/90">
                                                            {item.content.map((line, idx) => (
                                                                <div key={idx} className="prose dark:prose-invert max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: line.text }} />
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