import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Library, CheckCircle2, ChevronRight, Bookmark } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import * as LucideIcons from "lucide-react";
import reviewTopicsData from "@/data/reviewTopics.json";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
}

interface ReviewTopic {
  id: string;
  title: string;
  icon: keyof typeof LucideIcons;
  color: string;
  summary: string;
  details: {
    subtitle: string;
    points: string[];
  }[];
}

const reviewTopics: ReviewTopic[] = reviewTopicsData;

// Mapeamento de estilos para o novo design
const TOPIC_STYLES: Record<string, { gradient: string, border: string, bg: string, iconBg: string }> = {
  "text-pink-500": { gradient: "from-pink-600 to-rose-600", border: "border-pink-200 dark:border-pink-800", bg: "bg-pink-50 dark:bg-pink-950/20", iconBg: "bg-pink-100 dark:bg-pink-900/40" },
  "text-blue-500": { gradient: "from-blue-600 to-sky-600", border: "border-blue-200 dark:border-blue-800", bg: "bg-blue-50 dark:bg-blue-950/20", iconBg: "bg-blue-100 dark:bg-blue-900/40" },
  "text-green-500": { gradient: "from-green-600 to-emerald-600", border: "border-green-200 dark:border-green-800", bg: "bg-green-50 dark:bg-green-950/20", iconBg: "bg-green-100 dark:bg-green-900/40" },
  "text-purple-500": { gradient: "from-purple-600 to-violet-600", border: "border-purple-200 dark:border-purple-800", bg: "bg-purple-50 dark:bg-purple-950/20", iconBg: "bg-purple-100 dark:bg-purple-900/40" },
  "text-cyan-500": { gradient: "from-cyan-600 to-teal-600", border: "border-cyan-200 dark:border-cyan-800", bg: "bg-cyan-50 dark:bg-cyan-950/20", iconBg: "bg-cyan-100 dark:bg-cyan-900/40" },
  "text-yellow-500": { gradient: "from-yellow-500 to-amber-600", border: "border-yellow-200 dark:border-yellow-800", bg: "bg-yellow-50 dark:bg-yellow-950/20", iconBg: "bg-yellow-100 dark:bg-yellow-900/40" },
  "text-slate-600": { gradient: "from-slate-600 to-gray-700", border: "border-slate-200 dark:border-slate-800", bg: "bg-slate-50 dark:bg-slate-950/20", iconBg: "bg-slate-100 dark:bg-slate-900/40" },
  "text-teal-500": { gradient: "from-teal-600 to-cyan-600", border: "border-teal-200 dark:border-teal-800", bg: "bg-teal-50 dark:bg-teal-950/20", iconBg: "bg-teal-100 dark:bg-teal-900/40" },
  "text-lime-500": { gradient: "from-lime-600 to-green-600", border: "border-lime-200 dark:border-lime-800", bg: "bg-lime-50 dark:bg-lime-950/20", iconBg: "bg-lime-100 dark:bg-lime-900/40" },
  "text-indigo-500": { gradient: "from-indigo-600 to-blue-700", border: "border-indigo-200 dark:border-indigo-800", bg: "bg-indigo-50 dark:bg-indigo-950/20", iconBg: "bg-indigo-100 dark:bg-indigo-900/40" },
  "text-orange-500": { gradient: "from-orange-600 to-red-600", border: "border-orange-200 dark:border-orange-800", bg: "bg-orange-50 dark:bg-orange-950/20", iconBg: "bg-orange-100 dark:bg-orange-900/40" },
  "text-rose-500": { gradient: "from-rose-600 to-pink-700", border: "border-rose-200 dark:border-rose-800", bg: "bg-rose-50 dark:bg-rose-950/20", iconBg: "bg-rose-100 dark:bg-rose-900/40" },
  "text-red-600": { gradient: "from-red-600 to-rose-700", border: "border-red-200 dark:border-red-800", bg: "bg-red-50 dark:bg-red-950/20", iconBg: "bg-red-100 dark:bg-red-900/40" },
  "text-amber-600": { gradient: "from-amber-600 to-orange-700", border: "border-amber-200 dark:border-amber-800", bg: "bg-amber-50 dark:bg-amber-950/20", iconBg: "bg-amber-100 dark:bg-amber-900/40" },
  "text-fuchsia-500": { gradient: "from-fuchsia-600 to-purple-700", border: "border-fuchsia-200 dark:border-fuchsia-800", bg: "bg-fuchsia-50 dark:bg-fuchsia-950/20", iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/40" }
};

const ReviewArea = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Área de Revisão', path: '/review-area', icon: 'Library' });
  }, [addActivity]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* 1. Header Imersivo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 p-8 sm:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-indigo-200">
              <Library className="h-3 w-3" /> Resumos Estratégicos
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Área de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Revisão</span>
            </h1>
            <p className="text-indigo-100/80 text-sm sm:text-lg leading-relaxed">
              Material condensado e direto ao ponto. Revise os conceitos mais cobrados em provas e essenciais para a prática clínica.
            </p>
          </div>
          
          <div className="hidden md:block">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm rotate-3 hover:rotate-0 transition-transform duration-500">
               <Bookmark className="w-16 h-16 text-white/20" />
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/review-area"
              itemType="Guia"
              itemTitle="Área de Revisão"
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      {/* 2. Grid de Tópicos */}
      <div className="grid grid-cols-1 gap-6">
        {reviewTopics.map((topic, idx) => {
          const Icon = LucideIcons[topic.icon] as LucideIcons.LucideIcon;
          const style = TOPIC_STYLES[topic.color] || TOPIC_STYLES["text-slate-600"];
          const isOpen = activeTopic === topic.id;

          return (
            <div 
               key={topic.id} 
               className={cn(
                 "group rounded-2xl border transition-all duration-300 overflow-hidden",
                 isOpen ? "ring-2 ring-primary/20 shadow-lg bg-card" : "bg-card hover:border-primary/30 hover:shadow-md",
                 style.border
               )}
            >
              {/* Header do Card (Clicável para expandir se usar um state local ou apenas visual) */}
              <div className="relative">
                 <div className={cn("absolute inset-0 bg-gradient-to-r opacity-5", style.gradient)} />
                 <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center relative z-10">
                    <div className={cn("p-3 rounded-xl w-fit shadow-sm transition-transform group-hover:scale-105", style.iconBg)}>
                       <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", topic.color)} />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                       <div className="flex items-center justify-between">
                          <h2 className={cn("text-lg sm:text-xl font-bold tracking-tight", topic.color)}>
                             {topic.title}
                          </h2>
                          {profile && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <FavoriteButton
                                userId={profile.id}
                                itemId={`/review-area#${topic.id}`}
                                itemType="Tópico de Revisão"
                                itemTitle={topic.title}
                                className="h-8 w-8"
                              />
                            </div>
                          )}
                       </div>
                       <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                          {topic.summary}
                       </p>
                    </div>

                    <Badge variant="outline" className="w-fit h-fit self-start sm:self-center bg-background/50 backdrop-blur-sm">
                        {topic.details.length} seções
                    </Badge>
                 </div>
              </div>

              {/* Conteúdo (Acordeão) */}
              <div className="border-t bg-muted/5 px-2 sm:px-6 py-2">
                <Accordion type="single" collapsible className="w-full">
                  {topic.details.map((detail, index) => (
                    <AccordionItem 
                      value={`item-${topic.id}-${index}`} 
                      key={index} 
                      className="border-b last:border-0 border-border/50"
                    >
                      <AccordionTrigger className="hover:no-underline py-4 group/trigger">
                        <div className="flex items-center gap-3 text-left">
                           <div className={cn("h-2 w-2 rounded-full transition-colors group-hover/trigger:scale-125", style.bg.replace("bg-", "bg-").replace("/20", "").replace("dark:", ""))}></div>
                           <span className={cn("font-semibold text-sm sm:text-base group-hover/trigger:text-primary transition-colors", topic.color)}>
                              {detail.subtitle}
                           </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 pl-5 sm:pl-8 animate-accordion-down">
                        <div className="relative pl-4 border-l-2 border-muted">
                           <ul className="space-y-4">
                              {detail.points.map((point, pIndex) => (
                                 <li key={pIndex} className="text-sm sm:text-base text-foreground/80 leading-relaxed flex items-start gap-3 group/li">
                                    <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground/50 group-hover/li:text-primary transition-colors shrink-0" />
                                    <span dangerouslySetInnerHTML={{ __html: point }} />
                                 </li>
                              ))}
                           </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewArea;