import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Timer, Play, Pause, RotateCcw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function StudyTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return {
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      h: hours.toString().padStart(2, '0'),
      m: minutes.toString().padStart(2, '0'),
      s: secs.toString().padStart(2, '0')
    };
  };

  const timeObj = formatTime(seconds);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "relative gap-2 px-4 h-9 transition-all duration-300 border rounded-full font-medium shadow-sm",
            isActive 
              ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:text-white shadow-indigo-500/20" 
              : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400"
          )}
        >
          {isActive ? (
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          ) : (
            <Clock className="h-4 w-4" />
          )}
          
          <span className="hidden md:inline font-mono font-semibold tabular-nums min-w-[4.5rem] text-left">
             {isActive || seconds > 0 ? timeObj.formatted : "Tempo de estudo"}
          </span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 mr-4 shadow-xl border-border/50 rounded-xl overflow-hidden" align="end">
        {/* Header com Gradiente */}
        <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
             <Timer className="w-20 h-20 -rotate-12" />
          </div>
          
          <div className="relative z-10 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                   <Clock className="h-4 w-4 text-yellow-300" />
                </div>
                <span className="font-bold text-sm tracking-wide">Tempo de estudo</span>
             </div>
             {isActive && <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 text-[10px] animate-pulse">Rodando</Badge>}
          </div>
        </div>

        {/* Display do Tempo */}
        <div className="flex flex-col items-center justify-center p-6 bg-background">
           <div className="flex items-baseline gap-1 text-foreground font-mono font-black tracking-tighter">
              <div className="flex flex-col items-center">
                 <span className="text-5xl tabular-nums">{timeObj.h}</span>
                 <span className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Hrs</span>
              </div>
              <span className="text-3xl text-muted-foreground/30 pb-4">:</span>
              <div className="flex flex-col items-center">
                 <span className="text-5xl tabular-nums">{timeObj.m}</span>
                 <span className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Min</span>
              </div>
              <span className="text-3xl text-muted-foreground/30 pb-4">:</span>
              <div className="flex flex-col items-center">
                 <span className="text-5xl tabular-nums text-indigo-600 dark:text-indigo-400">{timeObj.s}</span>
                 <span className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Seg</span>
              </div>
           </div>
        </div>

        <Separator />

        {/* Controles */}
        <div className="p-4 bg-muted/30 flex gap-3">
          <Button 
              className={cn(
                "flex-1 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]", 
                isActive 
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              )}
              onClick={toggleTimer}
          >
            {isActive ? (
              <><Pause className="h-4 w-4 mr-2 fill-current" /> Pausar</>
            ) : (
              <><Play className="h-4 w-4 mr-2 fill-current" /> {seconds > 0 ? "Continuar" : "Iniciar"}</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetTimer} 
            disabled={seconds === 0 && !isActive} 
            title="Reiniciar"
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}