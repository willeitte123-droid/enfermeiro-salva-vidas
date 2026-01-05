import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  HeartPulse, Wind, Brain, Droplet, Utensils, Shield, 
  Activity, Microscope, AlertTriangle, Lightbulb, 
  Layers, Stethoscope, ArrowRight, CheckCircle2,
  ChevronsRight
} from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import anatomyData from "@/data/anatomy.json";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
}

const iconMap: Record<string, React.ElementType> = {
  HeartPulse, Wind, Brain, Droplet, Utensils, Shield
};

// Configurações de tema vibrantes (Design Anterior restaurado)
const themeStyles: Record<string, any> = {
  rose: {
    gradient: "from-rose-600 to-red-600",
    text: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    border: "border-rose-200 dark:border-rose-800",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-300",
    activeTab: "data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 data-[state=active]:border-rose-200 dark:data-[state=active]:bg-rose-900/40 dark:data-[state=active]:text-rose-300 dark:data-[state=active]:border-rose-700"
  },
  sky: {
    gradient: "from-sky-600 to-blue-600",
    text: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    border: "border-sky-200 dark:border-sky-800",
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-300",
    activeTab: "data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:border-sky-200 dark:data-[state=active]:bg-sky-900/40 dark:data-[state=active]:text-sky-300 dark:data-[state=active]:border-sky-700"
  },
  violet: {
    gradient: "from-violet-600 to-purple-600",
    text: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
    border: "border-violet-200 dark:border-violet-800",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-300",
    activeTab: "data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 data-[state=active]:border-violet-200 dark:data-[state=active]:bg-violet-900/40 dark:data-[state=active]:text-violet-300 dark:data-[state=active]:border-violet-700"
  },
  amber: {
    gradient: "from-amber-500 to-orange-600",
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-700 dark:text-amber-300",
    activeTab: "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 dark:data-[state=active]:bg-amber-900/40 dark:data-[state=active]:text-amber-300 dark:data-[state=active]:border-amber-700"
  },
  orange: {
    gradient: "from-orange-500 to-red-600",
    text: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    border: "border-orange-200 dark:border-orange-800",
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-700 dark:text-orange-300",
    activeTab: "data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 dark:data-[state=active]:bg-orange-900/40 dark:data-[state=active]:text-orange-300 dark:data-[state=active]:border-orange-700"
  },
  emerald: {
    gradient: "from-emerald-600 to-green-600",
    text: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    border: "border-emerald-200 dark:border-emerald-800",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-700 dark:text-emerald-300",
    activeTab: "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 dark:data-[state=active]:bg-emerald-900/40 dark:data-[state=active]:text-emerald-300 dark:data-[state=active]:border-emerald-700"
  }
};

const AnatomyPhysiology = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [activeTab, setActiveTab] = useState(anatomyData[0].id);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Anatomia e Fisiologia', path: '/anatomy', icon: 'Activity' });
  }, [addActivity]);

  const activeSystem = anatomyData.find(s => s.id === activeTab) || anatomyData[0];
  const currentTheme = themeStyles[activeSystem.theme] || themeStyles.rose;
  const SystemIcon = iconMap[activeSystem.icon] || Activity;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* 1. Header Imersivo (Restaurado e Adaptado) */}
      <div className={cn("relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-lg transition-colors duration-500", `bg-gradient-to-r ${currentTheme.gradient}`)}>
        <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <SystemIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{activeSystem.name}</h1>
          </div>
          <p className="max-w-2xl text-white/90 text-xs sm:text-sm md:text-base mb-4">
            {activeSystem.description}
          </p>
        </div>
        
        {/* Elementos Decorativos */}
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 translate-y-1/4 -translate-x-1/4 rounded-full bg-black/10 blur-2xl" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId={`/anatomy#${activeSystem.id}`}
              itemType="Guia"
              itemTitle={`Anatomia: ${activeSystem.name}`}
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      {/* Indicador de rolagem no mobile */}
      <div className="flex justify-end px-4 sm:hidden animate-pulse">
        <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
          <span className="text-[10px] text-muted-foreground">Deslize para ver sistemas</span>
          <ChevronsRight className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* 2. Navegação Responsiva (ScrollArea como em Curativos) */}
      <Tabs defaultValue={anatomyData[0].id} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full max-w-[calc(100vw-2rem)] mx-auto">
          <ScrollArea className="w-full whitespace-nowrap rounded-xl border-0 bg-transparent mb-4">
            <TabsList className="flex w-max space-x-2 h-auto bg-transparent p-1">
              {anatomyData.map((system) => {
                const Icon = iconMap[system.icon];
                const theme = themeStyles[system.theme];
                return (
                  <TabsTrigger 
                    key={system.id} 
                    value={system.id}
                    className={cn(
                      "rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all hover:bg-accent",
                      theme.activeTab
                    )}
                  >
                    <Icon className="mr-1.5 h-3.5 w-3.5" />
                    {system.name.replace("Sistema ", "")}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {/* 3. Conteúdo do Sistema Ativo (Layout Grid Responsivo) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Coluna Principal (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Card: Anatomia e Fisiologia */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-t-4 border-t-primary shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Microscope className="h-5 w-5 text-primary" /> Estruturas (Anatomia)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {activeSystem.anatomy.map((item, idx) => (
                      <AccordionItem value={`anat-${idx}`} key={idx} className="px-4 border-b last:border-0">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <span className="text-sm font-semibold text-left">{item.part}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3">
                          {item.detail}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-blue-500 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                    <Activity className="h-5 w-5" /> Funções (Fisiologia)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {activeSystem.physiology.map((item, idx) => (
                      <AccordionItem value={`physio-${idx}`} key={idx} className="px-4 border-b last:border-0">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <span className="text-sm font-semibold text-left">{item.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3">
                          <div dangerouslySetInnerHTML={{ __html: item.content }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Patologias */}
            <Card className="border-dashed border-2 bg-muted/10 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-700 dark:text-slate-300">
                  <Layers className="h-5 w-5" /> Principais Patologias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {activeSystem.pathology.map((path, idx) => (
                  <div key={idx} className="bg-background p-3 rounded-lg border shadow-sm">
                    <span className="font-bold block mb-1 text-sm text-foreground">{path.condition}</span>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-snug">{path.mechanism}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Coluna Lateral (4 cols) - Sinais de Alerta e Dicas */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Red Flags */}
            <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10 overflow-hidden">
              <CardHeader className="bg-red-100/50 dark:bg-red-900/30 p-4 border-b border-red-200 dark:border-red-900/50">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" /> Sinais de Alerta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-red-200/50 dark:divide-red-800/50">
                  {activeSystem.red_flags.map((flag, idx) => (
                    <li key={idx} className="p-3 text-xs sm:text-sm text-red-900/80 dark:text-red-200 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span className="leading-snug">{flag}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Dicas Clínicas */}
            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/10 overflow-hidden">
              <CardHeader className="bg-amber-100/50 dark:bg-amber-900/30 p-4 border-b border-amber-200 dark:border-amber-900/50">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-amber-700 dark:text-amber-400">
                  <Lightbulb className="h-5 w-5" /> Dicas Práticas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {activeSystem.clinical_pearls.map((pearl, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="leading-snug italic">"{pearl}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CTA */}
            <div className={cn("border rounded-xl p-5 text-center space-y-3 shadow-sm", currentTheme.bg, currentTheme.border)}>
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-white/50 backdrop-blur")}>
                <Stethoscope className={cn("h-6 w-6", currentTheme.iconColor)} />
              </div>
              <div>
                <h3 className={cn("font-bold text-base", currentTheme.text)}>Aplicação Prática</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Aprenda a avaliar este sistema no exame físico.
                </p>
              </div>
              <Button variant="outline" className="w-full gap-2 text-xs sm:text-sm h-10 bg-white/50 hover:bg-white/80" asChild>
                <a href="/semiology">
                  Ir para Semiologia <ArrowRight className="h-3 w-3" />
                </a>
              </Button>
            </div>

          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AnatomyPhysiology;