import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
}

interface MainLayoutProps {
  session: Session;
  profile: Profile | null;
}

const MainLayout = ({ session, profile }: MainLayoutProps) => {
  const isAdmin = profile?.role === 'admin';
  const user = profile ? { first_name: profile.first_name, last_name: profile.last_name } : null;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar isAdmin={isAdmin} user={user} />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet context={{ profile }} />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;