import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  HeartPulse, Wind, Brain, Droplet, Utensils, Shield, 
  Activity, Microscope, AlertTriangle, Lightbulb, 
  Layers, Stethoscope, ArrowRight, CheckCircle2
} from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import anatomyData from "@/data/anatomy.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
}

interface AnatomyItem {
  part: string;
  detail: string;
}

interface PhysiologyItem {
  title: string;
  content: string;
}

interface PathologyItem {
  condition: string;
  mechanism: string;
}

interface AnatomySystem {
  id: string;
  name: string;
  icon: string;
  theme: string;
  description: string;
  anatomy: AnatomyItem[];
  physiology: PhysiologyItem[];
  pathology: PathologyItem[];
  clinical_pearls: string[];
  red_flags: string[];
}

const iconMap: Record<string, React.ElementType> = {
  HeartPulse, Wind, Brain, Droplet, Utensils, Shield
};

// Configurações de tema aprimoradas para contraste
const themeStyles: Record<string, any> = {
  rose: {
    gradient: "from-rose-600 to-red-700",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    activeTab: "bg-rose-600 text-white shadow-rose-200",
    subtleBg: "bg-rose-50 dark:bg-rose-950/20"
  },
  sky: {
    gradient: "from-sky-600 to-blue-700",
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800",
    activeTab: "bg-sky-600 text-white shadow-sky-200",
    subtleBg: "bg-sky-50 dark:bg-sky-950/20"
  },
  violet: {
    gradient: "from-violet-600 to-purple-700",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
    activeTab: "bg-violet-600 text-white shadow-violet-200",
    subtleBg: "bg-violet-50 dark:bg-violet-950/20"
  },
  amber: {
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    activeTab: "bg-amber-500 text-white shadow-amber-200",
    subtleBg: "bg-amber-50 dark:bg-amber-950/20"
  },
  orange: {
    gradient: "from-orange-500 to-red-600",
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    activeTab: "bg-orange-500 text-white shadow-orange-200",
    subtleBg: "bg-orange-50 dark:bg-orange-950/20"
  },
  emerald: {
    gradient: "from-emerald-600 to-green-700",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    activeTab: "bg-emerald-600 text-white shadow-emerald-200",
    subtleBg: "bg-emerald-50 dark:bg-emerald-950/20"
  }
};

const AnatomyPhysiology = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [activeSystem, setActiveSystem] = useState<AnatomySystem>(anatomyData[0] as unknown as AnatomySystem);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Anatomia e Fisiologia', path: '/anatomy', icon: 'Activity' });
  }, [addActivity]);

  const currentTheme = themeStyles[activeSystem.theme] || themeStyles.rose;
  const SystemIcon = iconMap[activeSystem.icon] || Activity;

  return (
    <div className="space-y-6 pb-20 sm:pb-12 animate-in fade-in duration-500">
      
      {/* 1. Header (Cartão de Destaque) */}
      <div className={cn("relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-colors duration-500", `bg-gradient-to-br ${currentTheme.gradient}`)}>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-sm shrink-0">
                <SystemIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-medium text-white/80 uppercase tracking-wider block">Sistema</span>
                <h1 className="text-2xl sm:text-3xl font-black leading-none">{activeSystem.name.replace("Sistema ", "")}</h1>
              </div>
            </div>
            
            {profile && (
              <FavoriteButton
                userId={profile.id}
                itemId={`/anatomy#${activeSystem.id}`}
                itemType="Guia"
                itemTitle={`Anatomia: ${activeSystem.name}`}
                className="bg-white/20 hover:bg-white/30 text-white border-0 h-9 w-9 rounded-full shrink-0"
              />
            )}
          </div>
          <p className="text-white/90 text-sm font-medium leading-relaxed max-w-xl">
            {activeSystem.description}
          </p>
        </div>
        
        {/* Elementos Decorativos de Fundo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-5 -mb-5 pointer-events-none" />
      </div>

      {/* 2. Navegação Horizontal (Sistemas) */}
      <div className="w-full -mx-4 px-4 sm:mx-0 sm:px-0 sticky top-0 z-30 bg-background/95 backdrop-blur py-2">
        <ScrollArea className="w-full whitespace-nowrap rounded-xl">
          <div className="flex w-max space-x-3 p-1">
            {anatomyData.map((system) => {
              const Icon = iconMap[system.icon];
              const isActive = activeSystem.id === system.id;
              const theme = themeStyles[system.theme];
              
              return (
                <button
                  key={system.id}
                  onClick={() => setActiveSystem(system as unknown as AnatomySystem)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 min-w-[85px] border h-[85px]",
                    isActive 
                      ? cn("scale-105 font-bold shadow-md", theme.activeTab)
                      : "bg-card border-border hover:bg-accent hover:border-primary/20 text-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-6 w-6", isActive ? "text-white" : "text-muted-foreground")} />
                  <span className="text-xs truncate w-full text-center">
                    {system.name.replace("Sistema ", "")}
                  </span>
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Principal (Conteúdo Técnico) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Anatomia */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold px-1">
              <Microscope className={cn("h-5 w-5", currentTheme.iconColor)} /> Estruturas Chave
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSystem.anatomy.map((item, idx) => (
                <Card key={idx} className="border hover:shadow-sm transition-all overflow-hidden relative">
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1", themeStyles[activeSystem.theme].activeTab.split(' ')[0])} />
                  <CardContent className="p-4 pl-5">
                    <h3 className="font-bold text-sm text-foreground mb-1">{item.part}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.detail}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Fisiologia */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold px-1">
              <Activity className={cn("h-5 w-5", currentTheme.iconColor)} /> Fisiologia
            </h2>
            <div className="space-y-3">
              {activeSystem.physiology.map((process, idx) => (
                <div key={idx} className="bg-card border rounded-xl p-4 shadow-sm flex gap-4 items-start">
                  <div className={cn("flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5", themeStyles[activeSystem.theme].activeTab.split(' ')[0])}>
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-foreground">{process.title}</h3>
                    <div 
                      className="text-sm text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: process.content }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patologia */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold px-1">
              <Layers className={cn("h-5 w-5", currentTheme.iconColor)} /> Patologias Comuns
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeSystem.pathology.map((path, idx) => (
                <div key={idx} className={cn("p-4 rounded-xl border transition-all", currentTheme.subtleBg, currentTheme.border)}>
                  <span className="font-bold block mb-1 text-sm text-foreground">{path.condition}</span>
                  <p className="text-xs text-muted-foreground leading-snug">{path.mechanism}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Coluna Lateral (Foco Clínico) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Red Flags */}
          <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10 overflow-hidden">
            <CardHeader className="bg-red-100/50 dark:bg-red-900/30 p-4 border-b border-red-200 dark:border-red-900/50">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" /> Sinais de Alerta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-red-200/50 dark:divide-red-900/50">
                {activeSystem.red_flags.map((flag, idx) => (
                  <li key={idx} className="p-3 flex items-start gap-3 text-sm text-red-900/80 dark:text-red-200">
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

          {/* CTA para Semiologia */}
          <div className="bg-card border rounded-xl p-5 text-center space-y-3 shadow-sm">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto", currentTheme.iconBg)}>
              <Stethoscope className={cn("h-6 w-6", currentTheme.iconColor)} />
            </div>
            <div>
              <h3 className="font-bold text-base">Aplicação Prática</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Aprenda a avaliar este sistema no exame físico.
              </p>
            </div>
            <Button variant="outline" className="w-full gap-2 text-xs sm:text-sm h-10" asChild>
              <a href="/semiology">
                Ir para Semiologia <ArrowRight className="h-3 w-3" />
              </a>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnatomyPhysiology;