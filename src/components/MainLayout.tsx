import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { GlobalSearch } from "./GlobalSearch";
import { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

interface MainLayoutProps {
  session: Session;
  profile: Profile | null;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const MainLayout = ({ session, profile }: MainLayoutProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isAdmin = profile?.role === 'admin';
  const user = profile ? { 
    first_name: profile.first_name, 
    last_name: profile.last_name,
    avatar_url: profile.avatar_url 
  } : null;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar isAdmin={isAdmin} user={user} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <main className="flex-1 flex flex-col">
        <Header onSearchClick={() => setIsSearchOpen(true)} isAdmin={isAdmin} user={user} />
        <GlobalSearch open={isSearchOpen} setOpen={setIsSearchOpen} />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet context={{ profile }} />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;