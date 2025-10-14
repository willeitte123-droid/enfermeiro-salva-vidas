import { useNavigate, Link } from "react-router-dom";
import { Stethoscope, LogOut, Sun, Moon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SidebarNav from "./SidebarNav";
import { SheetClose } from "./ui/sheet";
import { useTheme } from "./ThemeProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface MobileSidebarProps {
  isAdmin: boolean;
  user: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  } | null;
}

const MobileSidebar = ({ isAdmin, user }: MobileSidebarProps) => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const getInitials = () => {
    const firstName = user?.first_name?.[0] || '';
    const lastName = user?.last_name?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-border/10 px-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-white">Enfermagem Pro</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarNav isAdmin={isAdmin} isMobile={true} />
      </div>
      <div className="mt-auto border-t border-border/10 p-4 space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-hover hover:text-white">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="text-sm font-medium">Alterar Tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <SheetClose asChild>
          <Link to="/profile" className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-hover group">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar_url} alt={`${user?.first_name} ${user?.last_name}`} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{`${user?.first_name || 'Usuário'} ${user?.last_name || ''}`}</p>
                <p className="text-xs text-sidebar-foreground">{isAdmin ? 'Administrador' : 'Usuário'}</p>
              </div>
            </div>
          </Link>
        </SheetClose>
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-hover hover:text-white">
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default MobileSidebar;