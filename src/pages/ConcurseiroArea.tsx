import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, GraduationCap, Scale, ShieldAlert, 
  Stethoscope, Baby, Lightbulb, CheckCircle2, Gavel,
  Biohazard, Scissors, Activity, Thermometer, Heart, Search,
  Calculator, Siren, Brain, ChevronRight, X
} from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import concursoData from "@/data/concursoTopics.json";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Profile {
  id: string;
}

const iconMap: Record<string, React.ElementType> = {
  Scale, ShieldAlert, Stethoscope, Baby, Gavel, 
  Biohazard, Scissors, Activity, Thermometer, Heart,
  Calculator, Siren, Brain
};

const ConcurseiroArea = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Área do Concurseiro', path: '/concurseiro', icon: 'GraduationCap' });
  }, [addActivity]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return concursoData;
    
    const lowerTerm = searchTerm.toLowerCase();
    
    return concursoData.map(section => ({
      ...section,
      topics: section.topics.filter(topic => 
        topic.title.toLowerCase().includes(lowerTerm) ||
        topic.summary.toLowerCase().includes(lowerTerm)
      )
    })).filter(section => section.topics.length > 0);
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      setOpenSections(filteredData.map(s => s.category));
    }
  }, [searchTerm, filteredData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
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
            Aprovação sem rodeios. Conteúdo 'mastigado' e 100% focado nos temas que mais caem nos concursos de enfermagem.
          </p>
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por tema, lei ou assunto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Content Sections - New List Layout */}
      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="w-full space-y-4">
        {filteredData.map((section) => {
          const Icon = iconMap[section.icon] || BookOpen;
          return (
            <AccordionItem key={section.category} value={section.category} className="border rounded-xl bg-card shadow-sm overflow-hidden px-0">
              <AccordionTrigger className="hover:no-underline py-4 px-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4 text-left">
                  <div className={cn("p-2.5 rounded-lg bg-muted/50 shadow-sm", section.color.replace('text-', 'bg-').replace('600', '100').replace('500', '100'))}>
                    <Icon className={cn("h-6 w-6", section.color)} />
                  </div>
                  <div>
                    <h2 className={cn("text-lg font-bold tracking-tight", section.color)}>{section.category}</h2>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">
                      {section.topics.length} aulas disponíveis
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-0 pb-0">
                <div className="divide-y divide-border/50">
                  {section.topics.map((topic, index) => (
                    <button 
                        key={index} 
                        onClick={() => setSelectedTopic({ ...topic, categoryName: section.category, categoryColor: section.color })}
                        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/40 transition-all text-left group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1 hidden sm:block">
                                <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                                    {topic.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                    {topic.summary}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Reading Sheet (Detailed View) */}
      <Sheet open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col h-full bg-background border-l shadow-2xl">
          {selectedTopic && (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b bg-muted/10 shrink-0 flex items-start gap-4">
                <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold border-primary/20", selectedTopic.categoryColor)}>
                            {selectedTopic.categoryName}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                            Aula Completa
                        </Badge>
                    </div>
                    <SheetTitle className="text-xl sm:text-2xl font-bold leading-tight">
                        {selectedTopic.title}
                    </SheetTitle>
                    <SheetDescription className="mt-1 line-clamp-2">
                        {selectedTopic.summary}
                    </SheetDescription>
                </div>
                <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted mt-2">
                        <X className="h-5 w-5" />
                    </Button>
                </SheetClose>
              </div>

              {/* Scrollable Content */}
              <ScrollArea className="flex-1 w-full">
                  <div className="px-6 py-6 sm:px-8 sm:py-8">
                      
                      {/* Dica de Ouro Box */}
                      {selectedTopic.goldenTip && (
                        <div className="mb-8 p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">
                                <Lightbulb className="h-4 w-4" /> Dica de Ouro
                            </div>
                            <p className="text-sm sm:text-base text-amber-800 dark:text-amber-200 leading-relaxed font-medium italic">
                                "{selectedTopic.goldenTip}"
                            </p>
                        </div>
                      )}

                      {/* Conteúdo Principal (HTML Render) */}
                      <div 
                        className="prose prose-slate dark:prose-invert max-w-none prose-base sm:prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg marker:text-primary/50 leading-loose"
                        dangerouslySetInnerHTML={{ 
                            __html: selectedTopic.detailedContent || selectedTopic.keyPoints.map((p: string) => `<p>• ${p}</p>`).join('') 
                        }} 
                      />

                      {/* Footer do conteúdo */}
                      <div className="mt-12 pt-6 border-t flex items-center justify-center text-muted-foreground text-sm">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          Você concluiu a leitura deste tópico.
                      </div>
                  </div>
              </ScrollArea>
              
              {/* Footer Actions */}
              <div className="p-4 border-t bg-background shrink-0 flex justify-end">
                 <Button onClick={() => setSelectedTopic(null)}>Concluir Leitura</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {filteredData.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
          <p className="text-muted-foreground">Nenhum conteúdo encontrado para "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
};

export default ConcurseiroArea;