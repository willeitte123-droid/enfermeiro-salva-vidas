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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Service Worker registrado com sucesso: ', registration);
    }).catch(registrationError => {
      console.log('Falha no registro do Service Worker: ', registrationError);
    });
  });
}