import { usePomodoro } from "@/context/PomodoroContext";
import { Play, Pause, X, Minimize2, Maximize2, Flame, Coffee } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function FloatingPomodoro() {
  const { timerSeconds, isTimerRunning, pomodoroMode, activeBlock, togglePomodoro, stopPomodoro } = usePomodoro();
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Não exibe se não houver um bloco ativo ou se estivermos na tela do Planner onde ele já existe grande
  if (!activeBlock || location.pathname === '/planner') return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isMinimized) {
    return (
      <div 
        className={cn(
          "fixed bottom-6 right-6 z-[99999] rounded-full shadow-2xl p-1 cursor-pointer hover:scale-105 transition-transform border-4 backdrop-blur-md",
          pomodoroMode === 'focus' ? "bg-primary border-primary/20 text-white" : "bg-emerald-500 border-emerald-500/20 text-white",
          isTimerRunning && "animate-pulse-subtle"
        )}
        onClick={() => setIsMinimized(false)}
        title="Abrir Timer"
      >
        <div className="w-14 h-14 rounded-full bg-black/10 flex flex-col items-center justify-center font-bold">
           {pomodoroMode === 'focus' ? <Flame className="w-4 h-4 mb-0.5" /> : <Coffee className="w-4 h-4 mb-0.5" />}
           <span className="text-xs tracking-tighter">{formatTime(timerSeconds)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[99999] w-72 bg-card/95 backdrop-blur-lg border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]">
      <div className={cn("px-4 py-2 flex items-center justify-between text-white text-xs font-bold uppercase tracking-wider", pomodoroMode === 'focus' ? "bg-primary" : "bg-emerald-500")}>
        <div className="flex items-center gap-1.5 truncate">
          {pomodoroMode === 'focus' ? <Flame className="w-3.5 h-3.5 shrink-0" /> : <Coffee className="w-3.5 h-3.5 shrink-0" />}
          <span className="truncate">{pomodoroMode === 'focus' ? "Foco Total" : "Pausa"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={() => setIsMinimized(true)}>
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={stopPomodoro} title="Encerrar Sessão">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col items-center">
        <span className="text-xs text-muted-foreground font-semibold mb-1 truncate w-full text-center" title={activeBlock.category_name}>
          {activeBlock.category_name}
        </span>
        
        <div className="text-5xl font-black font-mono tracking-tighter text-foreground mb-4">
          {formatTime(timerSeconds)}
        </div>

        <div className="flex gap-2 w-full">
           <Button 
             variant={isTimerRunning ? "outline" : "default"} 
             className={cn("flex-1 h-10 font-bold", !isTimerRunning && pomodoroMode === 'focus' ? "bg-primary" : !isTimerRunning && pomodoroMode === 'break' ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "")}
             onClick={togglePomodoro}
           >
             {isTimerRunning ? <><Pause className="w-4 h-4 mr-1.5"/> Pausar</> : <><Play className="w-4 h-4 mr-1.5"/> Continuar</>}
           </Button>
           
           <Button variant="outline" className="h-10 px-3 shrink-0" onClick={() => navigate('/planner')} title="Voltar ao Cronograma">
             <Maximize2 className="h-4 w-4 text-muted-foreground" />
           </Button>
        </div>
      </div>
    </div>
  );
}