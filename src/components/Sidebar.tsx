import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LogOut, Sun, Moon, Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "./ThemeProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import SidebarNav from "./SidebarNav";
import { SheetClose } from "./ui/sheet";
import { useThemeCustomization } from "@/context/ThemeCustomizationContext";

interface SidebarProps {
  isAdmin: boolean;
  user: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    plan?: string;
  } | null;
  isMobile?: boolean;
  isCollapsed?: boolean; // Mantido para compatibilidade
  onToggle?: () => void; // Mantido para compatibilidade
}

const Sidebar = ({ isAdmin, user, isMobile = false }: SidebarProps) => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { themeSettings } = useThemeCustomization();
  const [isLockedOpen, setIsLockedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // No desktop, a sidebar expande se o mouse estiver em cima OU se o menu de tema estiver aberto.
  // Isso impede que a sidebar feche quando o usuário move o mouse para o dropdown do tema.
  const isExpanded = isMobile ? true : (isHovered || isLockedOpen);
  const isCollapsed = !isExpanded;

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

  const UserProfileLink = (
    <Link to="/profile" className={cn("flex items-center justify-between p-2 rounded-md hover:bg-sidebar-hover group", isCollapsed && "justify-center")}>
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={user?.avatar_url} alt={`${user?.first_name} ${user?.last_name}`} className="object-cover" />
          <AvatarFallback className="bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
        </Avatar>
        <div className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
          <p className="text-sm font-medium text-white truncate">{`${user?.first_name || 'Usuário'} ${user?.last_name || ''}`}</p>
          <p className="text-xs text-sidebar-foreground truncate">{isAdmin ? 'Administrador' : (user?.plan || 'Usuário')}</p>
        </div>
      </div>
      {!isMobile && (
        <Button variant="ghost" size="icon" onClick={handleLogout} className={cn("text-sidebar-foreground transition-opacity hover:bg-sidebar-hover hover:text-white", isCollapsed ? "hidden" : "opacity-0 group-hover:opacity-100")} title="Sair">
          <LogOut className="h-5 w-5" />
        </Button>
      )}
    </Link>
  );

  return (
    <aside 
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        isMobile ? "h-full w-full" : "hidden md:flex border-r border-border/10 relative z-50",
        // Largura baseada no estado de expansão (hover ou menu aberto)
        !isMobile && (isExpanded ? "w-64" : "w-20")
      )}
    >
      <div className="flex h-16 items-center border-b border-border/10 px-6 justify-between relative overflow-hidden shrink-0">
        <div className={cn("flex items-center gap-3 transition-all duration-300", isCollapsed && "justify-center w-full")}>
          {themeSettings.logo_url ? (
            <img src={themeSettings.logo_url} alt="Logo" className={cn("h-8 transition-all object-contain", isCollapsed ? "w-8" : "w-auto")} />
          ) : (
            <Stethoscope className="h-7 w-7 text-primary flex-shrink-0" />
          )}
          <h1 className={cn("text-xl font-bold text-white whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-2")}>Enfermagem Pro</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-sidebar-hover scrollbar-track-transparent overflow-x-hidden">
        <SidebarNav isAdmin={isAdmin} userPlan={user?.plan} isCollapsed={isCollapsed} isMobile={isMobile} />
      </div>

      <div className="mt-auto border-t border-border/10 p-4 space-y-2 shrink-0">
        <DropdownMenu onOpenChange={setIsLockedOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-hover hover:text-white transition-all", isCollapsed && "justify-center px-0")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 flex-shrink-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 flex-shrink-0" />
              <span className={cn("text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>Alterar Tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isMobile ? <SheetClose asChild>{UserProfileLink}</SheetClose> : UserProfileLink}
        
        {isMobile && (
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-hover hover:text-white">
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;