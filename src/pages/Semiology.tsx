import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, BookOpen } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import * as LucideIcons from "lucide-react";
import assessmentData from "@/data/assessment.json";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
}

interface AnamnesisStep {
  title: string;
  description: string;
}

interface PropaedeuticMethod {
  name: string;
  icon: keyof typeof LucideIcons;
  description: string;
}

interface AssessmentDetail {
  method: string;
  technique: string;
  findings: string[];
}

interface SystemAssessment {
  id: string;
  name: string;
  icon: keyof typeof LucideIcons;
  color: string;
  details: AssessmentDetail[];
}

const { anamnesisSteps, propaedeuticMethods, systemAssessments }: {
  anamnesisSteps: AnamnesisStep[];
  propaedeuticMethods: PropaedeuticMethod[];
  systemAssessments: SystemAssessment[];
} = assessmentData;

const Semiology = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Guia', title: 'Guia de Semiologia', path: '/semiology', icon: 'FileSearch' });
  }, [addActivity]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Guia de Semiologia</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/semiology"
              itemType="Guia"
              itemTitle="Guia de Semiologia"
            />
          )}
        </div>
        <p className="text-muted-foreground">A arte de identificar sinais e sintomas através do exame clínico.</p>
      </div>

      <Card className="bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-violet-700 dark:text-violet-300 text-lg sm:text-xl">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            Anamnese: A Entrevista Clínica
          </CardTitle>
          <CardDescription className="text-violet-600/80 dark:text-violet-300/80">A base para um diagnóstico preciso começa com uma boa história.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anamnesisSteps.map(step => (
            <div key={step.title} className="p-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-sm border border-violet-100 dark:border-violet-800/50 hover:border-violet-300 dark:hover:border-violet-600 transition-colors">
              <h3 className="font-semibold text-primary text-sm sm:text-base mb-1">{step.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Exame Físico: Avaliação por Sistemas</CardTitle>
          <CardDescription>Aplique os métodos propedêuticos para uma avaliação completa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {propaedeuticMethods.map(method => {
              const Icon = LucideIcons[method.icon] as LucideIcons.LucideIcon;
              return (
                <div key={method.name} className="p-4 bg-muted/40 rounded-xl text-center border hover:border-primary/30 transition-all hover:shadow-sm">
                  <div className="bg-background p-3 rounded-full w-fit mx-auto mb-3 shadow-sm text-primary">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{method.name}</h4>
                  <p className="text-xs text-muted-foreground leading-snug">{method.description}</p>
                </div>
              );
            })}
          </div>

          <Tabs defaultValue="head-neck" className="w-full">
            <div className="w-full mb-6">
              <ScrollArea className="w-full whitespace-nowrap rounded-xl">
                <TabsList className="flex w-max space-x-3 bg-transparent p-1 h-auto">
                  {systemAssessments.map(system => {
                    const Icon = LucideIcons[system.icon] as LucideIcons.LucideIcon;
                    return (
                      <TabsTrigger 
                        key={system.id} 
                        value={system.id}
                        className={cn(
                          "rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-all",
                          "data-[state=active]:bg-primary/10 data-[state=active]:border-primary data-[state=active]:shadow-sm",
                          "hover:bg-muted hover:border-muted-foreground/30",
                          // Aplica a cor do texto do sistema quando ativo
                          `data-[state=active]:${system.color}`
                        )}
                      >
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {system.name}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                <ScrollBar orientation="horizontal" className="invisible" />
              </ScrollArea>
            </div>

            {systemAssessments.map(system => {
              const Icon = LucideIcons[system.icon] as LucideIcons.LucideIcon;
              return (
                <TabsContent key={system.id} value={system.id} className="mt-0 animate-in fade-in slide-in-from-left-4 duration-300">
                  <Card className="border-2 border-muted">
                    <CardHeader className="bg-muted/10 pb-4">
                      <CardTitle className={cn("flex items-center gap-3 text-lg sm:text-xl", system.color)}>
                        <div className={cn("p-2 rounded-lg bg-current/10")}>
                          {Icon && <Icon className="h-6 w-6" />} 
                        </div>
                        {system.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible defaultValue={system.details[0]?.method} className="divide-y">
                        {system.details.map((detail, idx) => (
                          <AccordionItem key={detail.method} value={detail.method} className="border-0 px-4 sm:px-6">
                            <AccordionTrigger className="hover:no-underline py-4">
                              <span className="font-semibold text-base">{detail.method}</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pb-6">
                              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                <p className="text-sm text-muted-foreground italic font-medium">"{detail.technique}"</p>
                              </div>
                              <div>
                                <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-foreground/80">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  Principais Achados:
                                </h5>
                                <div className="grid sm:grid-cols-2 gap-2">
                                  {detail.findings.map((finding, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm bg-card p-2 rounded border shadow-sm">
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                      <span className="leading-snug">{finding}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Semiology;