import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { ThemeCustomizationProvider } from "./context/ThemeCustomizationContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ThemeCustomizationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeCustomizationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
  // Registra imediatamente se a página já estiver carregada, ou aguarda o load
  const registerSW = () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado: ', registration.scope);
      })
      .catch(err => {
        console.log('Falha no registro do SW: ', err);
      });
  };

  if (document.readyState === 'complete') {
    registerSW();
  } else {
    window.addEventListener('load', registerSW);
  }
}