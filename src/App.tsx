import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { Session } from '@supabase/supabase-js';
import { Loader2 } from "lucide-react";
import { SuspendedAppRoutes } from "./routes";

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const AppContent = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoadingSession(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return <LoadingFallback />;
  }

  // Passa a sessão para as rotas, que decidirão o que renderizar.
  // Não espera mais pelo perfil aqui.
  return <SuspendedAppRoutes session={session} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;