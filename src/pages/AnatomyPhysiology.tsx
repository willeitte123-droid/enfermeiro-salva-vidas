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
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="text-center px-2">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
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
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Conecte a estrutura e função do corpo humano com a prática clínica de enfermagem.
        </p>
      </div>

      {/* System Selector - Horizontal Scroll on Mobile */}
      <div className="w-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card p-2 sm:p-4 shadow-sm max-w-[100vw]">
          <div className="flex w-max space-x-3 sm:space-x-4 p-1">
            {anatomyData.map((system) => {
              const Icon = iconMap[system.icon];
              const isActive = activeSystem.id === system.id;
              return (
                <button
                  key={system.id}
                  onClick={() => setActiveSystem(system as unknown as AnatomySystem)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl transition-all duration-300 w-24 h-24 sm:w-32 sm:h-32 border-2",
                    isActive 
                      ? `border-primary ${system.bgColor} scale-105 shadow-md` 
                      : "border-transparent hover:bg-accent hover:border-muted-foreground/20"
                  )}
                >
                  <div className={cn("p-2 sm:p-3 rounded-full mb-1 sm:mb-2 bg-background", isActive && "shadow-sm")}>
                    <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", system.color)} />
                  </div>
                  <span className={cn("text-[10px] sm:text-xs font-semibold text-wrap text-center leading-tight", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {system.name}
                  </span>
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Overview & Anatomy */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className={cn("p-2 rounded-lg shrink-0 mt-1 sm:mt-0", activeSystem.bgColor)}>
                  {(() => {
                    const Icon = iconMap[activeSystem.icon];
                    return <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", activeSystem.color)} />;
                  })()}
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">{activeSystem.name}</CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-1">{activeSystem.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <Tabs defaultValue="physiology" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="anatomy" className="font-bold text-xs sm:text-sm"><Microscope className="mr-2 h-3 w-3 sm:h-4 sm:w-4"/> Estrutura</TabsTrigger>
                  <TabsTrigger value="physiology" className="font-bold text-xs sm:text-sm"><Activity className="mr-2 h-3 w-3 sm:h-4 sm:w-4"/> Função</TabsTrigger>
                </TabsList>
                
                <TabsContent value="anatomy" className="mt-4 space-y-4 sm:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {activeSystem.anatomy.map((item, index) => (
                      <div key={index} className="p-3 sm:p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                        <h3 className={cn("font-bold mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base", activeSystem.color)}>
                          <div className="h-2 w-2 rounded-full bg-current shrink-0" />
                          {item.part}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {item.function}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="physiology" className="mt-4">
                  <div className="space-y-3 sm:space-y-4">
                    {Array.isArray(activeSystem.physiology) ? (
                      activeSystem.physiology.map((process, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-lg border bg-background p-3 sm:p-5 hover:shadow-md transition-all duration-300">
                          <div className={cn("absolute left-0 top-0 h-full w-1 transition-all group-hover:w-2", activeSystem.bgColor.replace('bg-', 'bg-slate-200'))} />
                          <div className="flex gap-3 sm:gap-4">
                            <div className={cn("flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full font-bold text-xs sm:text-sm text-white mt-0.5", activeSystem.color.replace('text-', 'bg-'))}>
                              {idx + 1}
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                                {process.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {process.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 sm:p-6 rounded-lg bg-muted/30 border leading-relaxed text-sm sm:text-lg">
                        <p className="first-letter:text-2xl sm:first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
                          {activeSystem.physiology}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Nursing Focus */}
        <div className="lg:col-span-1">
          <Card className="h-full border-l-4 border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-lg sm:text-xl">
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
                Foco na Enfermagem
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Relevância clínica para o plantão.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <ul className="space-y-3 sm:space-y-4">
                {activeSystem.nursingFocus.map((point, index) => (
                  <li key={index} className="flex gap-3 items-start p-3 rounded-md bg-background border shadow-sm hover:border-emerald-200 transition-colors">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium text-center flex flex-col gap-1">
                  <span className="text-base sm:text-lg">💡</span>
                  Relacione sempre os sinais vitais com a fisiologia do sistema.
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