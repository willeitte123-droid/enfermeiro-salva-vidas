import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  HeartPulse, Wind, Brain, Droplet, Utensils, Shield, 
  Activity, Stethoscope, Microscope, Info 
} from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import anatomyData from "@/data/anatomy.json";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
}

interface PhysiologyProcess {
  title: string;
  description: string;
}

interface AnatomySystem {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  anatomy: { part: string; function: string }[];
  physiology: PhysiologyProcess[] | string;
  nursingFocus: string[];
}

const iconMap: Record<string, React.ElementType> = {
  HeartPulse, Wind, Brain, Droplet, Utensils, Shield
};

const AnatomyPhysiology = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [activeSystem, setActiveSystem] = useState<AnatomySystem>(anatomyData[0] as unknown as AnatomySystem);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Anatomia e Fisiologia', path: '/anatomy', icon: 'Activity' });
  }, [addActivity]);

  useEffect(() => {
    const currentInJson = anatomyData.find(sys => sys.id === activeSystem.id);
    if (currentInJson) {
      setActiveSystem(currentInJson as unknown as AnatomySystem);
    }
  }, [activeSystem.id]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Anatomia e Fisiologia</h1>
          </div>
          <p className="max-w-2xl text-violet-100 text-xs sm:text-sm md:text-base mb-4">
            Estrutura e função do corpo humano aplicadas à prática clínica de enfermagem.
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 translate-y-1/4 -translate-x-1/4 rounded-full bg-violet-400/20 blur-2xl" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/anatomy"
              itemType="Guia"
              itemTitle="Anatomia e Fisiologia"
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      {/* System Selector - Horizontal Scroll with Mobile Constraint */}
      <div className="w-full max-w-[calc(100vw-2rem)] mx-auto">
        <ScrollArea className="w-full whitespace-nowrap rounded-xl border-0 bg-transparent mb-2">
          <div className="flex w-max space-x-2 sm:space-x-4 p-1">
            {anatomyData.map((system) => {
              const Icon = iconMap[system.icon];
              const isActive = activeSystem.id === system.id;
              return (
                <button
                  key={system.id}
                  onClick={() => setActiveSystem(system as unknown as AnatomySystem)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-20 h-20 sm:w-24 sm:h-24 border-2",
                    isActive 
                      ? `border-primary ${system.bgColor} shadow-md scale-[1.02] ring-1 ring-primary/20` 
                      : "border-transparent bg-card hover:bg-accent hover:border-muted-foreground/10 shadow-sm"
                  )}
                >
                  <div className={cn("p-1.5 sm:p-2 rounded-full mb-1 transition-colors", isActive ? "bg-background/80 backdrop-blur-sm" : "bg-muted")}>
                    <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6 transition-colors", isActive ? system.color : "text-muted-foreground")} />
                  </div>
                  <span className={cn("text-[9px] sm:text-xs font-semibold text-wrap text-center leading-tight line-clamp-2 max-w-full px-1", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {system.name.replace('Sistema ', '')}
                  </span>
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Overview & Anatomy */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-primary shadow-md overflow-hidden">
            <CardHeader className="p-4 sm:p-6 bg-muted/10 border-b">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={cn("p-2 sm:p-3 rounded-xl shrink-0 shadow-sm bg-background border", activeSystem.color)}>
                  {(() => {
                    const Icon = iconMap[activeSystem.icon];
                    return <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", activeSystem.color)} />;
                  })()}
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-2xl leading-tight">{activeSystem.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 leading-relaxed">{activeSystem.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="physiology" className="w-full">
                <div className="px-4 pt-2 bg-muted/5 border-b">
                  <TabsList className="grid w-full grid-cols-2 mb-2 h-10">
                    <TabsTrigger value="physiology" className="text-xs sm:text-sm font-semibold"><Activity className="mr-2 h-3.5 w-3.5"/> Função</TabsTrigger>
                    <TabsTrigger value="anatomy" className="text-xs sm:text-sm font-semibold"><Microscope className="mr-2 h-3.5 w-3.5"/> Estrutura</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="anatomy" className="p-4 sm:p-6 space-y-3 m-0 bg-card min-h-[300px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSystem.anatomy.map((item, index) => (
                      <div key={index} className="p-3 sm:p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors shadow-sm">
                        <h3 className={cn("font-bold mb-1.5 flex items-center gap-2 text-sm", activeSystem.color)}>
                          <div className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                          {item.part}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {item.function}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="physiology" className="p-4 sm:p-6 space-y-3 m-0 bg-card min-h-[300px]">
                  {Array.isArray(activeSystem.physiology) ? (
                    activeSystem.physiology.map((process, idx) => (
                      <div key={idx} className="relative overflow-hidden rounded-lg border bg-background p-3 sm:p-4 shadow-sm group hover:shadow-md transition-all">
                        <div className={cn("absolute left-0 top-0 h-full w-1 transition-all group-hover:w-1.5", activeSystem.bgColor.replace('bg-', 'bg-slate-300'))} />
                        <div className="flex gap-3 sm:gap-4 pl-2">
                          <div className={cn("flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full font-bold text-xs text-white mt-0.5 shadow-sm", activeSystem.color.replace('text-', 'bg-'))}>
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-foreground mb-1">
                              {process.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
                              {process.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-card border leading-relaxed text-sm">
                      <p>{activeSystem.physiology}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Nursing Focus */}
        <div className="lg:col-span-1">
          <Card className="h-full border-l-4 border-l-emerald-500 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 shadow-sm">
            <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3">
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-base sm:text-lg">
                <Stethoscope className="h-5 w-5" />
                Foco na Enfermagem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
              <ul className="space-y-2.5">
                {activeSystem.nursingFocus.map((point, index) => (
                  <li key={index} className="flex gap-3 items-start p-3 rounded-lg bg-background/80 border shadow-sm hover:bg-background transition-colors">
                    <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm leading-snug text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 shadow-sm">
                <p className="text-[10px] sm:text-xs text-yellow-800 dark:text-yellow-200 font-medium text-center flex items-center justify-center gap-2">
                  <Info className="h-3 w-3" />
                  Relacione sempre os sinais vitais com a fisiologia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnatomyPhysiology;