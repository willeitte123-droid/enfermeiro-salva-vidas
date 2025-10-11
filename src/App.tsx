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
import { Loader2 } from "lucide-react";
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('id, role, status')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile on auth change:", error);
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } catch (e) {
          console.error("Unhandled error fetching profile:", e);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-4 text-muted-foreground">Carregando...</span>
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
        <p className="text-muted-foreground mb-6 max-w-md">Sua conta foi criada e está aguardando a aprovação de um administrador. Você receberá um e-mail quando seu acesso for liberado.</p>
        <Button onClick={() => supabase.auth.signOut()}>Sair</Button>
      </div>
    );
  }

  if (session && !profile) {
    return (
     <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
       <h1 className="text-2xl font-bold mb-4 text-destructive">Erro ao Carregar Perfil</h1>
       <p className="text-muted-foreground mb-6 max-w-md">Não foi possível carregar os dados do seu perfil. Isso pode acontecer se o seu cadastro ainda não foi processado. Por favor, tente novamente mais tarde ou entre em contato com o suporte.</p>
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
          <Route path="/" element={<Calculator />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/wound-care" element={<WoundCare />} />
          <Route path="/procedures" element={<Procedures />} />
          <Route path="/questions" element={<Questions />} />
          {isAdmin && <Route path="/admin" element={<Admin />} />}
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