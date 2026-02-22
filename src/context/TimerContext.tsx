import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface TimerContextType {
  seconds: number;
  isActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const STORAGE_KEY_START_TIME = 'study_timer_start_time';
const STORAGE_KEY_ACCUMULATED = 'study_timer_accumulated';
const STORAGE_KEY_IS_ACTIVE = 'study_timer_is_active';

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa lendo do localStorage para manter o estado se a página recarregar
  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_IS_ACTIVE) === 'true';
  });

  const [seconds, setSeconds] = useState(0);

  // Refs mantêm os valores base sem causar re-renderizações desnecessárias
  // Se não houver nada no storage, começa com 0
  const startTimeRef = useRef<number>(parseInt(localStorage.getItem(STORAGE_KEY_START_TIME) || '0', 10));
  const accumulatedTimeRef = useRef<number>(parseInt(localStorage.getItem(STORAGE_KEY_ACCUMULATED) || '0', 10));

  // Função central que calcula o tempo real baseado no timestamp
  const calculateTotalSeconds = () => {
    if (!isActive) return accumulatedTimeRef.current;
    
    const now = Date.now();
    // Calcula quanto tempo passou desde o 'start' e soma ao que já tinha acumulado antes
    const elapsed = Math.max(0, Math.floor((now - startTimeRef.current) / 1000));
    return accumulatedTimeRef.current + elapsed;
  };

  // Sincroniza o visual assim que o componente monta
  useEffect(() => {
    setSeconds(calculateTotalSeconds());
  }, []);

  const toggleTimer = () => {
    if (isActive) {
      // PAUSAR
      const currentTotal = calculateTotalSeconds();
      setIsActive(false);
      localStorage.setItem(STORAGE_KEY_IS_ACTIVE, 'false');
      
      // Salva o tempo total até agora como acumulado
      accumulatedTimeRef.current = currentTotal;
      localStorage.setItem(STORAGE_KEY_ACCUMULATED, currentTotal.toString());
      
      setSeconds(currentTotal);
    } else {
      // INICIAR / RETOMAR
      setIsActive(true);
      localStorage.setItem(STORAGE_KEY_IS_ACTIVE, 'true');
      
      // Marca o timestamp de agora como início do novo ciclo
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
    
    // Limpa o storage
    localStorage.removeItem(STORAGE_KEY_IS_ACTIVE);
    localStorage.removeItem(STORAGE_KEY_START_TIME);
    localStorage.removeItem(STORAGE_KEY_ACCUMULATED);
  };

  // Efeito do Intervalo (apenas visual)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      // Atualiza imediatamente para não ter delay no clique
      setSeconds(calculateTotalSeconds());

      // O intervalo apenas atualiza a tela, o cálculo é feito com base no Date.now()
      // Isso impede que o tempo "atrase" se o navegador ficar lento
      intervalId = setInterval(() => {
        setSeconds(calculateTotalSeconds());
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