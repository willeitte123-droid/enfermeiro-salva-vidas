import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Calculator from "./pages/Calculator";
import Emergency from "./pages/Emergency";
import Medications from "./pages/Medications";
import WoundCare from "./pages/WoundCare";
import Procedures from "./pages/Procedures";
import Questions from "./pages/Questions";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { supabase } from "./lib/supabase";
import { Session } from '@supabase/supabase-js';
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

interface Profile {
  id: string;
  role: string;
  status: string;
}

const AppContent = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Perform the initial, one-time session check.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Crucial: stop loading after the first check
    });

    // 2. Set up the listener for subsequent auth changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Clean up the listener on component unmount.
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('id, role, status')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error.message);
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } catch (e) {
          console.error("An unexpected error occurred while fetching profile:", e);
          setProfile(null);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [session]);

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (profile?.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Aguardando Aprovação</h1>
        <p className="text-muted-foreground mb-6 max-w-md">Sua conta foi criada e está aguardando a aprovação de um administrador. Por favor, verifique seu e-mail para confirmar o cadastro.</p>
        <Button onClick={() => supabase.auth.signOut()}>Sair</Button>
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation isAdmin={isAdmin} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
          <Route path="/" element={<Calculator />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/wound-care" element={<WoundCare />} />
          <Route path="/procedures" element={<Procedures />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/" />} />
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