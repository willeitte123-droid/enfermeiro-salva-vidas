import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface TimerContextType {
  seconds: number;
  isActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Refs para manter o controle do tempo sem causar re-renderizações desnecessárias
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const toggleTimer = () => {
    if (isActive) {
      // PAUSAR: Salva o tempo acumulado até agora
      setIsActive(false);
      accumulatedTimeRef.current = seconds;
    } else {
      // INICIAR/RETOMAR: Marca o timestamp de agora
      setIsActive(true);
      startTimeRef.current = Date.now();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    accumulatedTimeRef.current = 0;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      // Atualiza a cada segundo, mas calcula baseado no timestamp inicial
      // Isso garante precisão mesmo se a aba ficar em segundo plano
      intervalId = setInterval(() => {
        const now = Date.now();
        const elapsedSinceStart = Math.floor((now - startTimeRef.current) / 1000);
        setSeconds(accumulatedTimeRef.current + elapsedSinceStart);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive]);

  return (
    <TimerContext.Provider value={{ seconds, isActive, toggleTimer, resetTimer }}>
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