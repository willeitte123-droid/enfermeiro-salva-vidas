import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface TimerContextType {
  seconds: number;
  isActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  saveTime: () => Promise<void>;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const STORAGE_KEY_START_TIME = 'study_timer_start_time';
const STORAGE_KEY_ACCUMULATED = 'study_timer_accumulated';
const STORAGE_KEY_IS_ACTIVE = 'study_timer_is_active';

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_IS_ACTIVE) === 'true';
  });

  const [seconds, setSeconds] = useState(0);

  const startTimeRef = useRef<number>(parseInt(localStorage.getItem(STORAGE_KEY_START_TIME) || '0', 10));
  const accumulatedTimeRef = useRef<number>(parseInt(localStorage.getItem(STORAGE_KEY_ACCUMULATED) || '0', 10));

  const calculateTotalSeconds = () => {
    if (!isActive) return accumulatedTimeRef.current;
    
    const now = Date.now();
    const elapsed = Math.max(0, Math.floor((now - startTimeRef.current) / 1000));
    return accumulatedTimeRef.current + elapsed;
  };

  useEffect(() => {
    setSeconds(calculateTotalSeconds());
  }, []);

  const toggleTimer = () => {
    if (isActive) {
      const currentTotal = calculateTotalSeconds();
      setIsActive(false);
      localStorage.setItem(STORAGE_KEY_IS_ACTIVE, 'false');
      
      accumulatedTimeRef.current = currentTotal;
      localStorage.setItem(STORAGE_KEY_ACCUMULATED, currentTotal.toString());
      
      setSeconds(currentTotal);
    } else {
      setIsActive(true);
      localStorage.setItem(STORAGE_KEY_IS_ACTIVE, 'true');
      
      const now = Date.now();
      startTimeRef.current = now;
      localStorage.setItem(STORAGE_KEY_START_TIME, now.toString());
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
    
    localStorage.removeItem(STORAGE_KEY_IS_ACTIVE);
    localStorage.removeItem(STORAGE_KEY_START_TIME);
    localStorage.removeItem(STORAGE_KEY_ACCUMULATED);
  };

  const saveTime = async () => {
    const currentTotal = calculateTotalSeconds();
    
    if (currentTotal > 0) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      try {
        // Salva o tempo total e o tempo diário no banco de dados
        await supabase.rpc('increment_user_activity', { seconds_to_add: currentTotal });
        await supabase.rpc('increment_daily_activity', { seconds_to_add: currentTotal });
        
        // Após salvar com sucesso, reseta o cronômetro
        resetTimer();
      } catch (error) {
        console.error("Erro ao salvar tempo:", error);
        throw error;
      }
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      setSeconds(calculateTotalSeconds());

      intervalId = setInterval(() => {
        setSeconds(calculateTotalSeconds());
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive]);

  return (
    <TimerContext.Provider value={{ seconds, isActive, toggleTimer, resetTimer, saveTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer deve ser usado dentro de um TimerProvider');
  }
  return context;
};