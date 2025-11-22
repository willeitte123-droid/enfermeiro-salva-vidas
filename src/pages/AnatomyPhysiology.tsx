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
    <div className="space-y-4 animate-in fade-in duration-500 pb-4">
      <div className="text-center px-2">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Anatomia e Fisiologia
          </h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/anatomy"
              itemType="Guia"
              itemTitle="Anatomia e Fisiologia"
            />
          )}
        </div>
        <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Estrutura e função do corpo humano na prática clínica.
        </p>
      </div>

      {/* System Selector - Horizontal Scroll on Mobile */}
      <div className="w-full -mx-4 px-4 sm:mx-0 sm:px-0">
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-card/50 p-2 shadow-sm">
          <div className="flex w-max space-x-2 sm:space-x-4 p-1">
            {anatomyData.map((system) => {
              const Icon = iconMap[system.icon];
              const isActive = activeSystem.id === system.id;
              return (
                <button
                  key={system.id}
                  onClick={() => setActiveSystem(system as unknown as AnatomySystem)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-20 h-20 sm:w-28 sm:h-28 border-2",
                    isActive 
                      ? `border-primary ${system.bgColor} shadow-md scale-[1.02]` 
                      : "border-transparent hover:bg-accent hover:border-muted-foreground/20"
                  )}
                >
                  <div className={cn("p-1.5 sm:p-2.5 rounded-full mb-1 bg-background/80 backdrop-blur-sm", isActive && "shadow-sm")}>
                    <Icon className={cn("h-5 w-5 sm:h-7 sm:w-7", system.color)} />
                  </div>
                  <span className={cn("text-[9px] sm:text-xs font-semibold text-wrap text-center leading-tight line-clamp-2", isActive ? "text-foreground" : "text-muted-foreground")}>
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
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left Column: Overview & Anatomy */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-t-4 border-t-primary shadow-md overflow-hidden">
            <CardHeader className="p-4 sm:p-6 bg-muted/10">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg shrink-0 shadow-sm bg-background", activeSystem.color.replace('text-', 'text-'))}>
                  {(() => {
                    const Icon = iconMap[activeSystem.icon];
                    return <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", activeSystem.color)} />;
                  })()}
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-2xl leading-tight">{activeSystem.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 leading-snug">{activeSystem.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="physiology" className="w-full">
                <div className="px-4 pt-2 border-b bg-muted/5">
                  <TabsList className="grid w-full grid-cols-2 mb-2 h-9">
                    <TabsTrigger value="physiology" className="text-xs font-semibold"><Activity className="mr-2 h-3.5 w-3.5"/> Função</TabsTrigger>
                    <TabsTrigger value="anatomy" className="text-xs font-semibold"><Microscope className="mr-2 h-3.5 w-3.5"/> Estrutura</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="anatomy" className="p-4 space-y-3 m-0 bg-muted/5 min-h-[300px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSystem.anatomy.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-all">
                        <h3 className={cn("font-bold mb-1 flex items-center gap-2 text-sm", activeSystem.color)}>
                          <div className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                          {item.part}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.function}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="physiology" className="p-4 space-y-3 m-0 bg-muted/5 min-h-[300px]">
                  {Array.isArray(activeSystem.physiology) ? (
                    activeSystem.physiology.map((process, idx) => (
                      <div key={idx} className="relative overflow-hidden rounded-lg border bg-card p-3 shadow-sm">
                        <div className={cn("absolute left-0 top-0 h-full w-1", activeSystem.bgColor.replace('bg-', 'bg-slate-300'))} />
                        <div className="flex gap-3 pl-2">
                          <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-xs text-white mt-0.5", activeSystem.color.replace('text-', 'bg-'))}>
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-foreground mb-1">
                              {process.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed text-justify">
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
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-base sm:text-lg">
                <Stethoscope className="h-5 w-5" />
                Foco na Enfermagem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <ul className="space-y-2">
                {activeSystem.nursingFocus.map((point, index) => (
                  <li key={index} className="flex gap-3 items-start p-2.5 rounded-md bg-background/80 border shadow-sm">
                    <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs leading-snug text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-[10px] sm:text-xs text-yellow-800 dark:text-yellow-200 font-medium text-center">
                  💡 Relacione sempre os sinais vitais com a fisiologia.
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