import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
}

interface MainLayoutProps {
  session: Session;
}

const MainLayout = ({ session }: MainLayoutProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (session.user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile for layout:", error.message);
        } else {
          setProfile(data);
        }
      };
      fetchProfile();
    }
  }, [session]);

  const isAdmin = profile?.role === 'admin';
  const user = profile ? { first_name: profile.first_name, last_name: profile.last_name } : null;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar isAdmin={isAdmin} user={user} />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;