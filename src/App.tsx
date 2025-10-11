import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calculator from "./pages/Calculator";
import Emergency from "./pages/Emergency";
import Medications from "./pages/Medications";
import WoundCare from "./pages/WoundCare";
import Questions from "./pages/Questions";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import { supabase } from "./lib/supabase";
import { Session } from '@supabase/supabase-js';

const queryClient = new QueryClient();

const AppContent = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/wound-care" element={<WoundCare />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
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