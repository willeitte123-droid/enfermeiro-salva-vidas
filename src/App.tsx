import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Emergency from "./pages/Emergency";
import Medications from "./pages/Medications";
import WoundCare from "./pages/WoundCare";
import Procedures from "./pages/Procedures";
import Questions from "./pages/Questions";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Scales from "./pages/Scales";
import GlasgowScale from "./pages/scales/GlasgowScale";
import BradenScale from "./pages/scales/BradenScale";
import RassScale from "./pages/scales/RassScale";
import WongBakerScale from "./pages/scales/WongBakerScale";
import FugulinScale from "./pages/scales/FugulinScale";
import MorseScale from "./pages/scales/MorseScale";
import AldreteScale from "./pages/scales/AldreteScale";
import ApgarScale from "./pages/scales/ApgarScale";
import EcgGuide from "./pages/EcgGuide";
import ProfilePage from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Semiology from "./pages/Semiology";
import SemioTechnique from "./pages/Semiotechnique";
import { supabase } from "./lib/supabase";
import { Session } from '@supabase/supabase-js';
import { Button } from "./components/ui/button";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

const ProtectedRoute = ({ session, profile, isAdmin }: { session: Session | null, profile: Profile | null, isAdmin: boolean }) => {
  if (!session) {
    return <Navigate to="/login" />;
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

  return (
    <Routes>
      <Route path="/" element={<MainLayout session={session} profile={profile} />}>
        <Route index element={<Dashboard />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="medications" element={<Medications />} />
        <Route path="wound-care" element={<WoundCare />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="questions" element={<Questions />} />
        <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="/" />} />
        <Route path="scales" element={<Scales />} />
        <Route path="scales/glasgow" element={<GlasgowScale />} />
        <Route path="scales/braden" element={<BradenScale />} />
        <Route path="scales/rass" element={<RassScale />} />
        <Route path="scales/wong-baker" element={<WongBakerScale />} />
        <Route path="scales/fugulin" element={<FugulinScale />} />
        <Route path="scales/morse" element={<MorseScale />} />
        <Route path="scales/aldrete" element={<AldreteScale />} />
        <Route path="scales/apgar" element={<ApgarScale />} />
        <Route path="ecg" element={<EcgGuide />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="user/:userId" element={<PublicProfile />} />
        <Route path="semiology" element={<Semiology />} />
        <Route path="semiotechnique" element={<SemioTechnique />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const AppContent = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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

  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!error) {
          setProfile(data);
        }
      };
      fetchProfile();

      const profileChannel = supabase
        .channel('public:profiles')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` },
          (payload) => {
            setProfile(payload.new as Profile);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(profileChannel);
      };
    } else {
      setProfile(null);
    }
  }, [session]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={session ? <Navigate to="/" /> : <Register />} />
      <Route path="/*" element={<ProtectedRoute session={session} profile={profile} isAdmin={isAdmin} />} />
    </Routes>
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