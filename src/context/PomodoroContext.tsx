import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export type PomodoroMode = 'focus' | 'break';

export interface StudyBlockInfo {
  id: string;
  category_name: string;
  duration_minutes: number;
}

interface PomodoroContextType {
  timerSeconds: number;
  isTimerRunning: boolean;
  pomodoroMode: PomodoroMode;
  activeBlock: StudyBlockInfo | null;
  startPomodoro: (block: StudyBlockInfo) => void;
  togglePomodoro: () => void;
  resetPomodoro: () => void;
  stopPomodoro: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const STORAGE_KEY_POMODORO = 'enfermagem_pro_pomodoro_state';

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Carrega estado salvo para que resista a atualizações de página ou mudanças de tela
  const loadState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_POMODORO);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Se estava rodando, calcula quanto tempo passou enquanto estivemos "fora"
        if (parsed.isTimerRunning && parsed.lastTick) {
            const elapsedSeconds = Math.floor((Date.now() - parsed.lastTick) / 1000);
            parsed.timerSeconds = Math.max(0, parsed.timerSeconds - elapsedSeconds);
            if (parsed.timerSeconds === 0) {
               parsed.isTimerRunning = false; 
            }
        }
        return parsed;
      }
    } catch(e) {}
    
    return {
      timerSeconds: 25 * 60,
      isTimerRunning: false,
      pomodoroMode: 'focus' as PomodoroMode,
      activeBlock: null as StudyBlockInfo | null
    };
  };

  const initialState = loadState();

  const [timerSeconds, setTimerSeconds] = useState<number>(initialState.timerSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(initialState.isTimerRunning);
  const [pomodoroMode, setPomodoroMode] = useState<PomodoroMode>(initialState.pomodoroMode);
  const [activeBlock, setActiveBlock] = useState<StudyBlockInfo | null>(initialState.activeBlock);

  // Sincroniza com o cache do navegador sempre que o timer bate
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_POMODORO, JSON.stringify({
      timerSeconds,
      isTimerRunning,
      pomodoroMode,
      activeBlock,
      lastTick: isTimerRunning ? Date.now() : null
    }));
  }, [timerSeconds, isTimerRunning, pomodoroMode, activeBlock]);

  const handleSessionEnd = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (pomodoroMode === "focus") {
        toast.success("Sessão de Foco Concluída!", { description: "Iniciando pausa de 5 minutos." });
        
        if (activeBlock && userId) {
           await supabase.from('user_study_sessions').insert({
             user_id: userId,
             category_name: activeBlock.category_name,
             duration_seconds: activeBlock.duration_minutes * 60
           });
           await supabase.rpc('increment_user_activity', { seconds_to_add: activeBlock.duration_minutes * 60 });
           
           const now = new Date();
           const year = now.getFullYear();
           const month = String(now.getMonth() + 1).padStart(2, '0');
           const day = String(now.getDate()).padStart(2, '0');
           const today = `${year}-${month}-${day}`;
           
           const { data: currentDaily } = await supabase
             .from('daily_activity_time')
             .select('seconds')
             .eq('user_id', userId)
             .eq('activity_date', today)
             .maybeSingle();

           const currentSeconds = currentDaily?.seconds || 0;
           await supabase.from('daily_activity_time').upsert({
             user_id: userId,
             activity_date: today,
             seconds: currentSeconds + (activeBlock.duration_minutes * 60)
           }, { onConflict: 'user_id,activity_date' });
           
           // Atualiza os relatórios globalmente
           queryClient.invalidateQueries({ queryKey: ['dailyStudyTime'] });
           queryClient.invalidateQueries({ queryKey: ['userStudySessions'] });
        }

        setPomodoroMode("break");
        setTimerSeconds(5 * 60);
      } else {
        toast.info("Pausa terminada!", { description: "Pronto para o próximo bloco?" });
        setPomodoroMode("focus");
        setTimerSeconds(activeBlock ? activeBlock.duration_minutes * 60 : 25 * 60);
      }
  };

  useEffect(() => {
    let interval: any = null;
    
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev: number) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleSessionEnd();
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startPomodoro = (block: StudyBlockInfo) => {
    setActiveBlock(block);
    setPomodoroMode('focus');
    setTimerSeconds(block.duration_minutes * 60);
    setIsTimerRunning(true);
  };

  const togglePomodoro = () => setIsTimerRunning(prev => !prev);
  
  const resetPomodoro = () => {
    setIsTimerRunning(false);
    setTimerSeconds(pomodoroMode === 'focus' ? (activeBlock ? activeBlock.duration_minutes * 60 : 25 * 60) : 5 * 60);
  };

  const stopPomodoro = () => {
    setIsTimerRunning(false);
    setActiveBlock(null);
  };

  return (
    <PomodoroContext.Provider value={{
      timerSeconds,
      isTimerRunning,
      pomodoroMode,
      activeBlock,
      startPomodoro,
      togglePomodoro,
      resetPomodoro,
      stopPomodoro
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) throw new Error("usePomodoro deve ser usado dentro de um PomodoroProvider");
  return context;
};