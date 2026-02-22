import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Timer, Play, Pause, RotateCcw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("relative gap-2 px-2 md:px-3", isActive && "text-primary bg-primary/10")}>
          <Timer className={cn("h-5 w-5", isActive && "animate-pulse")} />
          <span className="hidden md:inline font-mono font-medium min-w-[4.5rem] text-left">
             {isActive || seconds > 0 ? formatTime(seconds) : "Cronômetro"}
          </span>
          {isActive && (
             <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse md:hidden" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 mr-4" align="end">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
             <Clock className="h-4 w-4" />
             <h4 className="font-semibold text-sm uppercase tracking-wide">Tempo de Estudo</h4>
          </div>
          
          <div className="text-5xl font-mono font-black tabular-nums text-foreground tracking-tight">
            {formatTime(seconds)}
          </div>
          
          <div className="flex gap-2 w-full mt-2">
            <Button 
                variant={isActive ? "secondary" : "default"} 
                className={cn("flex-1 font-bold", isActive ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400" : "bg-green-600 hover:bg-green-700 text-white")}
                onClick={toggleTimer}
            >
              {isActive ? <><Pause className="h-4 w-4 mr-2 fill-current" /> Pausar</> : <><Play className="h-4 w-4 mr-2 fill-current" /> {seconds > 0 ? "Retomar" : "Iniciar"}</>}
            </Button>
            <Button variant="outline" size="icon" onClick={resetTimer} disabled={seconds === 0 && !isActive} title="Zerar">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {seconds > 0 && !isActive && (
             <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px]">
                Pausado
             </Badge>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}