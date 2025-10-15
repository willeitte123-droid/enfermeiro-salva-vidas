import React, { useState, useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { Session } from '@supabase/supabase-js';
import { Button } from "./components/ui/button";
import MainLayout from "./components/MainLayout";
import { useProfile } from "./hooks/useProfile";
import { Loader2 } from "lucide-react";

// Dynamic Imports for Code Splitting
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Calculator = React.lazy(() => import("./pages/Calculator"));
const Emergency = React.lazy(() => import("./pages/Emergency"));
const Medications = React.lazy(() => import("./pages/Medications"));
const WoundCare = React.lazy(() => import("./pages/WoundCare"));
const Procedures = React.lazy(() => import("./pages/Procedures"));
const Questions = React.lazy(() => import("./pages/Questions"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Scales = React.lazy(() => import("./pages/Scales"));
const GlasgowScale = React.lazy(() => import("./pages/scales/GlasgowScale"));
const BradenScale = React.lazy(() => import("./pages/scales/BradenScale"));
const RassScale = React.lazy(() => import("./pages/scales/RassScale"));
const WongBakerScale = React.lazy(() => import("./pages/scales/WongBakerScale"));
const FugulinScale = React.lazy(() => import("./pages/scales/FugulinScale"));
const MorseScale = React.lazy(() => import("./pages/scales/MorseScale"));
const AldreteScale = React.lazy(() => import("./pages/scales/AldreteScale"));
const ApgarScale = React.lazy(() => import("./pages/scales/ApgarScale"));
const ManchesterScale = React.lazy(() => import("./pages/scales/ManchesterScale"));
const ParklandScale = React.lazy(() => import("./pages/scales/ParklandScale"));
const AsaScale = React.lazy(() => import("./pages/scales/AsaScale"));
const EcgGuide = React.lazy(() => import("./pages/EcgGuide"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const PublicProfile = React.lazy(() => import("./pages/PublicProfile"));
const Semiology = React.lazy(() => import("./pages/Semiology"));
const SemioTechnique = React.lazy(() => import("./pages/Semiotechnique"));
const DoseCalculator = React.lazy(() => import("./pages/tools/DoseCalculator"));
const LabValues = React.lazy(() => import("./pages/tools/LabValues"));
const BlocoDeNotas = React.lazy(() => import("./pages/tools/BlocoDeNotas"));
const IntegratedCalculators = React.lazy(() => import("./pages/tools/IntegratedCalculators"));
const SimuladoLobby = React.lazy(() => import("./pages/simulado/SimuladoLobby"));
const Simulado = React.lazy(() => import("./pages/simulado/Simulado"));
const SimuladoResultado = React.lazy(() => import("./pages/simulado/SimuladoResultado"));
const ReviewArea = React.lazy(() => import("./pages/ReviewArea"));
const FavoritesPage = React.lazy(() => import("./pages/FavoritesPage"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <Loader2 className="h-8 w-8 animate-spin" />
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

  const { data: profile, isLoading: isLoadingProfile } = useProfile(session);

  if (loadingSession || (session && isLoadingProfile)) {
    return <LoadingFallback />;
  }

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
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
        <Route path="scales/manchester" element={<ManchesterScale />} />
        <Route path="scales/parkland" element={<ParklandScale />} />
        <Route path="scales/asa" element={<AsaScale />} />
        <Route path="ecg" element={<EcgGuide />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="user/:userId" element={<PublicProfile />} />
        <Route path="semiology" element={<Semiology />} />
        <Route path="semiotechnique" element={<SemioTechnique />} />
        <Route path="tools/dose-calculator" element={<DoseCalculator />} />
        <Route path="tools/lab-values" element={<LabValues />} />
        <Route path="tools/bloco-de-notas" element={<BlocoDeNotas />} />
        <Route path="tools/integrated-calculators" element={<IntegratedCalculators />} />
        <Route path="simulado" element={<SimuladoLobby />} />
        <Route path="review-area" element={<ReviewArea />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/simulado/start" element={<Simulado />} />
      <Route path="/simulado/resultado" element={<SimuladoResultado />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AppContent />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;