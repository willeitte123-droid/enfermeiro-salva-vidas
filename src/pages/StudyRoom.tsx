import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, Pause, RotateCcw, Volume2, 
  CloudRain, Coffee, Wind, CheckCircle2, 
  Plus, X, Focus, Headphones, Maximize2, Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivityTracker } from "@/hooks/useActivityTracker";

// Sons (Links de exemplo de áudio livres ou placeholders funcionais)
const SOUNDS = [
  { id: "rain", name: "Chuva Suave", icon: CloudRain, url: "https://assets.mixkit.co/active_storage/sfx/2464/2464-preview.mp3" },
  { id: "white", name: "Ruído Branco", icon: Wind, url: "https://assets.mixkit.co/active_storage/sfx/2099/2099-preview.mp3" },
  { id: "cafe", name: "Cafeteria", icon: Coffee, url: "https://assets.mixkit.co/active_storage/sfx/2486/2486-preview.mp3" },
];

const StudyRoom = () => {
  const { addActivity } = useActivityTracker();
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "short" | "long">("focus");
  const [sessionCount, setSessionCount] = useState(0);

  // Audio State
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState([50]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Tasks State
  const [tasks, setTasks] = useState<{id: string, text: string, done: boolean}[]>([]);
  const [newTask, setNewTask] = useState("");

  // Fullscreen State
  const [isZenMode, setIsZenMode] = useState(false);

  useEffect(() => {
    addActivity({ type: 'Ferramenta', title: 'Sala de Estudos', path: '/study-room', icon: 'Headphones' });
  }, [addActivity]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === "focus") setSessionCount(c => c + 1);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1393/1393-preview.mp3"); // Notification
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      audioRef.current?.pause();
      setActiveSound(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const sound = SOUNDS.find(s => s.id === soundId);
      if (sound) {
        audioRef.current = new Audio(sound.url);
        audioRef.current.loop = true;
        audioRef.current.volume = volume[0] / 100;
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
        setActiveSound(soundId);
      }
    }
  };

  const handleTimerMode = (newMode: "focus" | "short" | "long") => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === "focus") setTimeLeft(25 * 60);
    if (newMode === "short") setTimeLeft(5 * 60);
    if (newMode === "long") setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleZenMode = () => {
    const sidebar = document.querySelector('aside');
    const header = document.querySelector('header');
    
    if (!isZenMode) {
      if (sidebar) sidebar.style.display = 'none';
      if (header) header.style.display = 'none';
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (sidebar) sidebar.style.display = 'flex';
      if (header) header.style.display = 'flex';
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }
    setIsZenMode(!isZenMode);
  };

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] flex flex-col gap-6 animate-in fade-in duration-700",
      isZenMode ? "fixed inset-0 z-50 bg-background p-8" : ""
    )}>
      
      {/* Header da Sala */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            Sala de Estudos
          </h1>
          <p className="text-muted-foreground text-sm">Ambiente de foco profundo e produtividade.</p>
        </div>
        <Button variant="outline" size="icon" onClick={toggleZenMode} title={isZenMode ? "Sair do Modo Zen" : "Modo Zen (Tela Cheia)"}>
          {isZenMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        
        {/* Coluna Principal: Timer */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col items-center justify-center p-10 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-none shadow-2xl relative overflow-hidden">
            
            {/* Background Animation */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse-subtle"></div>
            <div className={cn(
              "absolute w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000",
              isActive ? "bg-indigo-500/20" : "bg-transparent"
            )} />

            {/* Timer Controls */}
            <div className="relative z-10 flex gap-2 mb-8 bg-white/10 p-1 rounded-full backdrop-blur-md">
              <button 
                onClick={() => handleTimerMode("focus")}
                className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-all", mode === "focus" ? "bg-indigo-500 text-white shadow-lg" : "text-slate-300 hover:text-white")}
              >
                Foco (25)
              </button>
              <button 
                onClick={() => handleTimerMode("short")}
                className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-all", mode === "short" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-300 hover:text-white")}
              >
                Pausa Curta (5)
              </button>
              <button 
                onClick={() => handleTimerMode("long")}
                className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-all", mode === "long" ? "bg-blue-500 text-white shadow-lg" : "text-slate-300 hover:text-white")}
              >
                Pausa Longa (15)
              </button>
            </div>

            {/* Big Timer */}
            <div className="relative z-10 text-[8rem] sm:text-[10rem] font-black leading-none tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl">
              {formatTime(timeLeft)}
            </div>

            {/* Status */}
            <div className="relative z-10 text-lg font-medium text-indigo-200 mt-4 mb-8">
              {isActive ? (mode === "focus" ? "Mantenha o foco total..." : "Relaxe e respire...") : "Pronto para começar?"}
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex gap-4">
              <Button 
                size="lg" 
                className={cn("h-14 px-8 rounded-full text-lg font-bold shadow-xl transition-all hover:scale-105", isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-white text-indigo-900 hover:bg-indigo-50")}
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? <><Pause className="mr-2 h-5 w-5 fill-current" /> Pausar</> : <><Play className="mr-2 h-5 w-5 fill-current" /> Iniciar</>}
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-14 w-14 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white"
                onClick={() => handleTimerMode(mode)}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* Session Counter */}
            <div className="absolute bottom-6 left-6 text-xs font-medium text-slate-400">
              Ciclos completados hoje: <span className="text-white font-bold">{sessionCount}</span>
            </div>
          </Card>

          {/* Sound Controls */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Headphones className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Ambiente Sonoro</h3>
            </div>
            <div className="flex flex-wrap gap-4 mb-6">
              {SOUNDS.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => toggleSound(sound.id)}
                  className={cn(
                    "flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all hover:scale-105",
                    activeSound === sound.id 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <sound.icon className={cn("h-8 w-8 mb-2", activeSound === sound.id && "animate-bounce")} />
                  <span className="text-xs font-bold">{sound.name}</span>
                  {activeSound === sound.id && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <Slider 
                value={volume} 
                onValueChange={setVolume} 
                max={100} 
                step={1} 
                className="flex-1"
                disabled={!activeSound}
              />
            </div>
          </Card>
        </div>

        {/* Coluna Lateral: Tarefas */}
        <div className="flex flex-col h-full">
          <Card className="flex-1 flex flex-col h-full border-t-4 border-t-primary shadow-lg">
            <div className="p-6 border-b bg-muted/20">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Focus className="h-5 w-5 text-primary" /> Metas da Sessão
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Liste o que você vai estudar agora.</p>
              
              <form onSubmit={addTask} className="mt-4 flex gap-2">
                <Input 
                  placeholder="Ex: Ler Lei 8.080..." 
                  value={newTask} 
                  onChange={e => setNewTask(e.target.value)}
                  className="bg-background"
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <ScrollArea className="flex-1 p-4">
              {tasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 gap-2 min-h-[200px]">
                  <CheckCircle2 className="h-12 w-12" />
                  <p className="text-sm">Nenhuma tarefa adicionada.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "group flex items-center gap-3 p-3 rounded-lg border transition-all",
                        task.done ? "bg-muted/50 border-transparent opacity-60" : "bg-card hover:border-primary/50"
                      )}
                    >
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                          task.done ? "bg-green-500 border-green-500" : "border-muted-foreground hover:border-primary"
                        )}
                      >
                        {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <span className={cn("flex-1 text-sm font-medium", task.done && "line-through")}>
                        {task.text}
                      </span>
                      <button 
                        onClick={() => removeTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;