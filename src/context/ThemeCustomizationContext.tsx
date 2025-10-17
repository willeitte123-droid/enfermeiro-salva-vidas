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
  const { data: themeSettings = {}, isLoading } = useQuery<ThemeSettings>({
    queryKey: ['themeSettings'],
    queryFn: fetchThemeSettings,
    staleTime: Infinity, // Theme settings don't change often
  });

  useEffect(() => {
    if (!isLoading && themeSettings) {
      // Apply font
      if (themeSettings.font_family) {
        document.body.style.fontFamily = themeSettings.font_family;
      }

      // Apply colors
      const root = document.documentElement;
      const lightVars: string[] = [];
      const darkVars: string[] = [];

      for (const key in themeSettings) {
        if (key.startsWith('--')) {
          if (key.startsWith('--dark-')) {
            const darkVarName = key.replace('--dark-', '--');
            darkVars.push(`${darkVarName}: ${themeSettings[key]};`);
          } else {
            lightVars.push(`${key}: ${themeSettings[key]};`);
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
  }, [themeSettings, isLoading]);

  return (
    <ThemeCustomizationContext.Provider value={{ themeSettings, isLoading }}>
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