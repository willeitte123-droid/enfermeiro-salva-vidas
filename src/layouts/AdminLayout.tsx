import { Suspense, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role, status, first_name, last_name, avatar_url")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

const ContentLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const AdminLayout = () => {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: () => fetchProfile(session.user.id),
    enabled: !!session?.user,
  });

  if (loadingSession || isLoadingProfile) {
    return <ContentLoader />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const user = profile ? { 
    first_name: profile.first_name, 
    last_name: profile.last_name,
    avatar_url: profile.avatar_url 
  } : null;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar 
        isAdmin={true} 
        user={user} 
      />
      <div className="flex flex-1 flex-col">
        <Header onSearchClick={() => setIsSearchOpen(true)} isAdmin={true} user={user} />
        <GlobalSearch open={isSearchOpen} setOpen={setIsSearchOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Suspense fallback={<ContentLoader />}>
            <Outlet context={{ profile }} />
          </Suspense>
        </main>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default AdminLayout;