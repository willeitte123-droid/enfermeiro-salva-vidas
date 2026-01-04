import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  HeartPulse, Wind, Brain, Droplet, Utensils, Shield, 
  Activity, Microscope, Zap, AlertTriangle, BookOpen, 
  Lightbulb, ChevronRight, Eye, EyeOff, Layers, Stethoscope,
  ArrowRight
} from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import anatomyData from "@/data/anatomy.json";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

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

// Mapeamento de cores baseado no tema do JSON
const themeStyles: Record<string, any> = {
  rose: {
    bg: "bg-rose-500",
    lightBg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500 to-red-600",
    subtle: "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200"
  },
  sky: {
    bg: "bg-sky-500",
    lightBg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    gradient: "from-sky-500 to-blue-600",
    subtle: "bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200"
  },
  violet: {
    bg: "bg-violet-500",
    lightBg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    gradient: "from-violet-500 to-purple-600",
    subtle: "bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200"
  },
  amber: {
    bg: "bg-amber-500",
    lightBg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500 to-yellow-600",
    subtle: "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200"
  },
  orange: {
    bg: "bg-orange-500",
    lightBg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-500 to-red-600",
    subtle: "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200"
  },
  emerald: {
    bg: "bg-emerald-500",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500 to-green-600",
    subtle: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200"
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* 1. Header Dinâmico */}
      <div className={cn("relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-lg transition-colors duration-500", `bg-gradient-to-r ${currentTheme.gradient}`)}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-sm">
                <SystemIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{activeSystem.name}</h1>
            </div>
            <p className="text-white/90 font-medium max-w-xl text-sm sm:text-base leading-relaxed">
              {activeSystem.description}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {profile && (
              <FavoriteButton
                userId={profile.id}
                itemId={`/anatomy#${activeSystem.id}`}
                itemType="Guia"
                itemTitle={`Anatomia: ${activeSystem.name}`}
                className="bg-white/20 hover:bg-white/30 text-white border-0 h-9 w-9 rounded-full"
              />
            )}
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
      </div>

      {/* 2. Seletor de Sistemas (Menu Biológico) */}
      <ScrollArea className="w-full whitespace-nowrap rounded-xl bg-transparent">
        <div className="flex w-max space-x-3 p-1 mb-2">
          {anatomyData.map((system) => {
            const Icon = iconMap[system.icon];
            const isActive = activeSystem.id === system.id;
            const theme = themeStyles[system.theme];
            
            return (
              <button
                key={system.id}
                onClick={() => setActiveSystem(system as unknown as AnatomySystem)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 w-24 sm:w-28 border-2 group",
                  isActive 
                    ? `bg-background border-${system.theme}-500 shadow-md scale-105` 
                    : "bg-card border-transparent hover:bg-accent/50 hover:border-border"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full transition-colors",
                  isActive ? theme.bg : "bg-muted group-hover:bg-muted/80"
                )}>
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
                </div>
                <span className={cn(
                  "text-[10px] sm:text-xs font-bold uppercase tracking-wide truncate max-w-full",
                  isActive ? theme.text : "text-muted-foreground"
                )}>
                  {system.name.replace("Sistema ", "")}
                </span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      {/* 3. Conteúdo Principal - Grid Bento */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Estrutura e Função (8 colunas) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Seção de Anatomia */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Microscope className={cn("h-5 w-5", currentTheme.text)} /> Estruturas Chave
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {activeSystem.anatomy.map((item, idx) => (
                <div key={idx} className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow relative group overflow-hidden">
                  <div className={cn("absolute left-0 top-0 w-1 h-full", currentTheme.bg)} />
                  <h3 className="font-bold text-sm mb-1 pr-2">{item.part}</h3>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {item.detail}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Seção de Fisiologia (Processos) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Activity className={cn("h-5 w-5", currentTheme.text)} />
              <h2 className="font-bold text-lg">Fisiologia em Ação</h2>
            </div>
            
            <div className="grid gap-4">
              {activeSystem.physiology.map((process, idx) => (
                <div key={idx} className="bg-card border rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="flex gap-4">
                    <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm", currentTheme.bg)}>
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-base">{process.title}</h3>
                      <p 
                        className="text-sm text-muted-foreground leading-relaxed cursor-help"
                        dangerouslySetInnerHTML={{ __html: process.content }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção de Fisiopatologia (Doenças) */}
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-700 dark:text-slate-300">
                <Layers className="h-5 w-5" /> Principais Patologias
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeSystem.pathology.map((path, idx) => (
                <div key={idx} className="bg-muted/30 p-3 rounded-lg border text-sm">
                  <span className="font-bold block mb-1 text-foreground/90">{path.condition}</span>
                  <span className="text-xs text-muted-foreground">{path.mechanism}</span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Coluna Direita: Foco na Enfermagem (4 colunas) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card de Alerta (Red Flags) */}
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50 shadow-sm overflow-hidden">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 border-b border-red-200 dark:border-red-800/50 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="font-bold text-sm text-red-800 dark:text-red-300">Sinais de Alerta (Red Flags)</h3>
            </div>
            <CardContent className="p-0">
              <ul className="divide-y divide-red-200/50 dark:divide-red-800/50">
                {activeSystem.red_flags.map((flag, idx) => (
                  <li key={idx} className="p-3 text-sm text-red-900/80 dark:text-red-200 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pérolas Clínicas (Dicas) */}
          <Card className="border-t-4 border-t-amber-500 shadow-sm bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-5 w-5" /> Pérolas Clínicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeSystem.clinical_pearls.map((pearl, idx) => (
                <div key={idx} className="bg-background/80 p-3 rounded-lg border shadow-sm text-sm text-muted-foreground italic relative">
                  <span className="absolute -left-1 top-4 w-2 h-2 bg-amber-400 rounded-r-full" />
                  "{pearl}"
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Foco de Enfermagem (CTA para Prática) */}
          <div className={cn("p-5 rounded-2xl text-center space-y-3 border", currentTheme.subtle, currentTheme.border)}>
            <Stethoscope className="h-8 w-8 mx-auto opacity-80" />
            <h3 className="font-bold text-base">Aplicação Prática</h3>
            <p className="text-xs opacity-90 leading-relaxed">
              Conecte a teoria à prática. Avalie sempre relacionando sinais vitais com a fisiologia.
            </p>
            <Button size="sm" variant="outline" className="w-full bg-background/50 hover:bg-background border-current opacity-80 hover:opacity-100" asChild>
              <a href="/semiology">
                Ir para Semiologia <ArrowRight className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnatomyPhysiology;