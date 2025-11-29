import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ThemeSettings {
  logo_url?: string;
  font_family?: string;
  [key: string]: any; // For CSS variables
}

interface ThemeCustomizationContextType {
  themeSettings: ThemeSettings;
  isLoading: boolean;
}

const ThemeCustomizationContext = createContext<ThemeCustomizationContextType | undefined>(undefined);

const THEME_SETTINGS_KEY = 'enfermagem_pro_theme_settings';

const fetchThemeSettings = async () => {
  const { data, error } = await supabase
    .from('app_theme')
    .select('settings')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    throw new Error(error.message);
  }
  return data?.settings || {};
};

export const ThemeCustomizationProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa o estado com o valor do localStorage se existir, para ser instantâneo
  const [cachedSettings, setCachedSettings] = useState<ThemeSettings>(() => {
    try {
      const stored = localStorage.getItem(THEME_SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const { data: serverSettings, isLoading } = useQuery<ThemeSettings>({
    queryKey: ['themeSettings'],
    queryFn: fetchThemeSettings,
    staleTime: Infinity, // Theme settings don't change often
  });

  // Atualiza o cache e o localStorage quando os dados do servidor chegam
  useEffect(() => {
    if (serverSettings) {
      setCachedSettings(serverSettings);
      localStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(serverSettings));
    }
  }, [serverSettings]);

  // Usa as configurações do servidor se disponíveis (mais atuais), senão usa o cache
  const activeSettings = serverSettings || cachedSettings;

  // Aplica as configurações de CSS e Fonte
  useEffect(() => {
    if (activeSettings && Object.keys(activeSettings).length > 0) {
      // Apply font
      if (activeSettings.font_family) {
        document.body.style.fontFamily = activeSettings.font_family;
      }

      // Apply colors
      const lightVars: string[] = [];
      const darkVars: string[] = [];

      for (const key in activeSettings) {
        if (key.startsWith('--')) {
          if (key.startsWith('--dark-')) {
            const darkVarName = key.replace('--dark-', '--');
            darkVars.push(`${darkVarName}: ${activeSettings[key]};`);
          } else {
            lightVars.push(`${key}: ${activeSettings[key]};`);
          }
        }
      }

      // Inject style tags
      let lightStyleTag = document.getElementById('light-theme-overrides');
      if (!lightStyleTag) {
        lightStyleTag = document.createElement('style');
        lightStyleTag.id = 'light-theme-overrides';
        document.head.appendChild(lightStyleTag);
      }
      lightStyleTag.innerHTML = `:root { ${lightVars.join(' ')} }`;

      let darkStyleTag = document.getElementById('dark-theme-overrides');
      if (!darkStyleTag) {
        darkStyleTag = document.createElement('style');
        darkStyleTag.id = 'dark-theme-overrides';
        document.head.appendChild(darkStyleTag);
      }
      darkStyleTag.innerHTML = `.dark { ${darkVars.join(' ')} }`;
    }
  }, [activeSettings]);

  return (
    <ThemeCustomizationContext.Provider 
      value={{ 
        themeSettings: activeSettings, 
        isLoading: isLoading && Object.keys(cachedSettings).length === 0 
      }}
    >
      {children}
    </ThemeCustomizationContext.Provider>
  );
};

export const useThemeCustomization = () => {
  const context = useContext(ThemeCustomizationContext);
  if (context === undefined) {
    throw new Error('useThemeCustomization must be used within a ThemeCustomizationProvider');
  }
  return context;
};