import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { ThemeCustomizationProvider } from "./context/ThemeCustomizationContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <ThemeCustomizationProvider>
      <App />
    </ThemeCustomizationProvider>
  </ThemeProvider>
);