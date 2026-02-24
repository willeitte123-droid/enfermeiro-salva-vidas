import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RotateCw, HelpCircle, Lightbulb } from "lucide-react";

interface FlashcardItemProps {
  front: string;
  back: string;
  category: string;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlashcardItem = ({ front, back, category, isFlipped, onFlip }: FlashcardItemProps) => {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto h-[400px] cursor-pointer group" onClick={onFlip}>
      <div
        className={cn(
          "relative w-full h-full transition-all duration-700 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* FRENTE (Pergunta) */}
        <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col justify-between border-0 shadow-2xl bg-card dark:bg-slate-900 rounded-3xl overflow-hidden ring-1 ring-border/50">
          {/* Pattern Decorativo */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <HelpCircle className="w-32 h-32" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

          <div className="p-6 flex justify-between items-center relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">{category}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 animate-pulse">
                <RotateCw className="h-3.5 w-3.5"/> Virar carta
            </span>
          </div>
          
          <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-snug font-serif tracking-tight">
              {front}
            </h3>
          </CardContent>
          
          <div className="p-6 text-center">
            <div className="h-1 w-16 bg-primary/20 rounded-full mx-auto" />
          </div>
        </Card>

        {/* VERSO (Resposta) */}
        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col justify-between border-0 shadow-2xl bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden ring-1 ring-indigo-500/30">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="p-6 flex justify-between items-center border-b border-border/40 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Resposta
            </span>
          </div>
          
          <CardContent className="flex-1 flex items-center justify-center p-8 text-center overflow-y-auto custom-scrollbar">
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-medium">
                {back}
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardItem;