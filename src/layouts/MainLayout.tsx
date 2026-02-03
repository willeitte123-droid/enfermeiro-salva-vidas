import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { GlobalSearch } from "../components/GlobalSearch";
import { Loader2, Wrench, AlertTriangle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "../components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import SuspendedAccount from "@/pages/SuspendedAccount";
import { TimeTracker } from "@/components/TimeTracker";
import { IpTracker } from "@/components/IpTracker";
import { toast } from "sonner";

const ContentLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const MainLayout = () => {
  const { session } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  const { data: profile, isLoading: isLoadingProfile, error, refetch } = useProfile(session);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleRepairAccount = async () => {
    setIsRepairing(true);
    const toastId = toast.loading("Reparando conta e criando perfil...");
    try {
      const { data, error } = await supabase.functions.invoke('setup-database');
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      toast.success("Conta reparada! Recarregando...", { id: toastId });
      setTimeout(() => {
        refetch();
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      toast.error("Erro ao reparar: " + err.message, { id: toastId });
      setIsRepairing(false);
    }
  };

  // Se houver erro no perfil (perfil não encontrado), mostramos a tela de reparo
  if (error || (session && !isLoadingProfile && !profile)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6 border p-8 rounded-xl shadow-lg bg-card">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Perfil Não Encontrado</h1>
            <p className="text-muted-foreground mt-2">
              Detectamos seu login ({session?.user.email}), mas seu perfil de usuário não existe no banco de dados. Isso impede o acesso ao sistema.
            </p>
          </div>
          <Button 
            onClick={handleRepairAccount} 
            disabled={isRepairing} 
            size="lg" 
            className="w-full gap-2 font-bold"
          >
            {isRepairing ? <Loader2 className="animate-spin" /> : <Wrench />}
            {isRepairing ? "Corrigindo..." : "Criar Perfil de Admin Agora"}
          </Button>
          <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="text-sm">
            Sair e tentar outra conta
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin';
  const user = profile ? { 
    first_name: profile.first_name, 
    last_name: profile.last_name,
    avatar_url: profile.avatar_url,
    plan: profile.plan
  } : null;

  return (
    <div className="flex min-h-screen w-full bg-muted/40 overflow-hidden">
      <TimeTracker />
      <IpTracker />
      <Sidebar isAdmin={isAdmin} user={user} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out h-screen">
        <Header onSearchClick={() => setIsSearchOpen(true)} isAdmin={isAdmin} user={user} />
        <GlobalSearch open={isSearchOpen} setOpen={setIsSearchOpen} />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 w-full scroll-smooth">
          {isLoadingProfile ? (
            <ContentLoader />
          ) : profile?.status === 'pending' ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <h1 className="text-2xl font-bold mb-4">Aguardando Aprovação</h1>
              <p className="text-muted-foreground mb-6 max-w-md">Sua conta foi criada e está aguardando a aprovação de um administrador.</p>
              <Button onClick={() => supabase.auth.signOut()}>Sair</Button>
            </div>
          ) : profile?.status === 'suspended' || profile?.status === 'inactive' ? (
            <SuspendedAccount />
          ) : (
            <Suspense fallback={<ContentLoader />}>
              <Outlet context={{ profile }} />
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;