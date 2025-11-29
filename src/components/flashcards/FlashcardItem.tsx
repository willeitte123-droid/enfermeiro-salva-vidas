import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCw, Eye, EyeOff } from "lucide-react";

interface FlashcardItemProps {
  front: string;
  back: string;
  category: string;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlashcardItem = ({ front, back, category, isFlipped, onFlip }: FlashcardItemProps) => {
  return (
    <div className="perspective-1000 w-full max-w-xl mx-auto h-80 cursor-pointer group" onClick={onFlip}>
      <div
        className={cn(
          "relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-xl",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* FRENTE (Pergunta) */}
        <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col justify-between border-2 border-primary/20 bg-gradient-to-br from-card to-secondary/5">
          <div className="p-4 flex justify-between items-center border-b border-border/50">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{category}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><RotateCw className="h-3 w-3"/> Clique para virar</span>
          </div>
          <CardContent className="flex-1 flex items-center justify-center p-8 text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
              {front}
            </h3>
          </CardContent>
          <div className="p-4 text-center text-sm text-primary font-medium opacity-50 group-hover:opacity-100 transition-opacity">
            Mostrar Resposta
          </div>
        </Card>

        {/* VERSO (Resposta) */}
        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col justify-between border-2 border-green-500/20 bg-green-50 dark:bg-green-950/20">
          <div className="p-4 flex justify-between items-center border-b border-green-200/30 dark:border-green-800/30">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">Resposta</span>
          </div>
          <CardContent className="flex-1 flex items-center justify-center p-8 text-center overflow-y-auto">
            <p className="text-lg md:text-xl text-foreground leading-relaxed">
              {back}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardItem;