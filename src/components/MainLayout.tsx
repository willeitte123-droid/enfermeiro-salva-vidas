import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { GlobalSearch } from "./GlobalSearch";
import { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

interface MainLayoutProps {
  session: Session;
}

const ContentLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const MainLayout = ({ session }: MainLayoutProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // O perfil é carregado aqui, dentro do layout que já está visível.
  const { data: profile, isLoading: isLoadingProfile } = useProfile(session);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const isAdmin = profile?.role === 'admin';
  const user = profile ? { 
    first_name: profile.first_name, 
    last_name: profile.last_name,
    avatar_url: profile.avatar_url 
  } : null;

  // A "casca" do aplicativo (Sidebar, Header) é renderizada imediatamente.
  // Apenas a área de conteúdo principal (main) aguarda os dados.
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar isAdmin={isAdmin} user={user} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <main className="flex-1 flex flex-col">
        <Header onSearchClick={() => setIsSearchOpen(true)} isAdmin={isAdmin} user={user} />
        <GlobalSearch open={isSearchOpen} setOpen={setIsSearchOpen} />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {isLoadingProfile ? (
            <ContentLoader />
          ) : profile?.status === 'pending' ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <h1 className="text-2xl font-bold mb-4">Aguardando Aprovação</h1>
              <p className="text-muted-foreground mb-6 max-w-md">Sua conta foi criada e está aguardando a aprovação de um administrador.</p>
              <Button onClick={() => supabase.auth.signOut()}>Sair</Button>
            </div>
          ) : (
            // Suspense garante que o código da página e os dados carreguem em paralelo.
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