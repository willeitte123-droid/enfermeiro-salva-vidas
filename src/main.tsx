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

// Lógica de Service Worker
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // Registro apenas em PRODUÇÃO
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado em produção: ', registration.scope);
        })
        .catch(err => {
          console.log('Falha no registro do SW: ', err);
        });
    });
  } else {
    // Em DESENVOLVIMENTO: Desregistra qualquer worker ativo para evitar erros 503
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
        console.log('SW antigo removido para evitar conflitos em dev.');
      }
    });
  }
}