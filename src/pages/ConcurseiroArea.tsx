import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, GraduationCap, Scale, ShieldAlert, 
  Stethoscope, Baby, Lightbulb, CheckCircle2, Gavel,
  Biohazard, Scissors, Activity, Thermometer, Heart
} from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import concursoData from "@/data/concursoTopics.json";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
}

const iconMap: Record<string, React.ElementType> = {
  Scale, ShieldAlert, Stethoscope, Baby, Gavel, 
  Biohazard, Scissors, Activity, Thermometer, Heart
};

const ConcurseiroArea = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [activeTab, setActiveTab] = useState(concursoData[0].category);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Área do Concurseiro', path: '/concurseiro', icon: 'GraduationCap' });
  }, [addActivity]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Área do Concurseiro</h1>
          </div>
          <p className="max-w-2xl text-blue-100 text-sm sm:text-base mb-4">
            Conteúdo direcionado e de alta performance para sua aprovação. 
            Foco nos temas mais cobrados em provas de Enfermagem.
          </p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
              <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Lei 8.080
            </Badge>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
              <Scale className="mr-1.5 h-3.5 w-3.5" /> Código de Ética
            </Badge>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
              <ShieldAlert className="mr-1.5 h-3.5 w-3.5" /> PNI & Vigilância
            </Badge>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 translate-y-1/4 -translate-x-1/4 rounded-full bg-blue-400/20 blur-2xl" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/concurseiro"
              itemType="Estudo"
              itemTitle="Área do Concurseiro"
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-card p-1 shadow-sm">
            <TabsList className="flex w-max h-auto bg-transparent p-0 gap-1">
              {concursoData.map((section) => {
                const Icon = iconMap[section.icon] || BookOpen;
                return (
                  <TabsTrigger 
                    key={section.category} 
                    value={section.category}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all data-[state=active]:shadow-sm",
                      activeTab === section.category 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {section.category}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {concursoData.map((section) => (
          <TabsContent key={section.category} value={section.category} className="space-y-4 mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {section.topics.map((topic, index) => (
                <Card key={index} className="flex flex-col h-full border-t-4 border-t-primary hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className={cn("text-lg flex items-start justify-between gap-2", section.color)}>
                      {topic.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1 leading-relaxed">
                      {topic.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <div className="flex-1">
                      <ul className="space-y-2">
                        {topic.keyPoints.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: point }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full border rounded-md bg-muted/30">
                      <AccordionItem value="details" className="border-0">
                        <AccordionTrigger className="px-3 py-2 text-xs font-semibold hover:no-underline hover:bg-muted/50">
                          Ver Todos os Pontos
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3 pt-1">
                          <ul className="space-y-2 pt-2">
                            {topic.keyPoints.map((point, idx) => (
                              <li key={idx} className="text-xs sm:text-sm flex items-start gap-2 text-foreground/80">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                <span dangerouslySetInnerHTML={{ __html: point }} />
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="mt-auto p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-1 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <Lightbulb className="h-3.5 w-3.5" /> Dica de Ouro
                      </div>
                      <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed italic">
                        "{topic.goldenTip}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ConcurseiroArea;