import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { GlobalSearch } from "./GlobalSearch";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import SuspendedAccount from "@/pages/SuspendedAccount";
import { TimeTracker } from "@/components/TimeTracker";
import { IpTracker } from "@/components/IpTracker";

const ContentLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const MainLayout = () => {
  const { session } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } = useProfile(session);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

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
      
      {/* CORREÇÃO: min-w-0 impede que filhos (como tabelas/videos) estourem a largura do flex */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out h-screen">
        <Header onSearchClick={() => setIsSearchOpen(true)} isAdmin={isAdmin} user={user} />
        <GlobalSearch open={isSearchOpen} setOpen={setIsSearchOpen} />
        
        {/* CORREÇÃO: overflow-x-hidden garante que nada saia lateralmente deste container */}
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