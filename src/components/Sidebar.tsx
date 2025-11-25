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
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ isAdmin, user, isMobile = false, isCollapsed: propIsCollapsed, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { themeSettings } = useThemeCustomization();
  const [isHovered, setIsHovered] = useState(false);
  const [isLockedOpen, setIsLockedOpen] = useState(false);

  // Lógica para colapso: se for mobile, nunca colapsa visualmente (fica dentro do sheet).
  // Se for desktop, usa a prop ou o hover.
  const isCollapsed = isMobile ? false : (propIsCollapsed !== undefined ? propIsCollapsed : !(isHovered || isLockedOpen));

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
        <div className={cn(isCollapsed && "hidden")}>
          <p className="text-sm font-medium text-white">{`${user?.first_name || 'Usuário'} ${user?.last_name || ''}`}</p>
          <p className="text-xs text-sidebar-foreground">{isAdmin ? 'Administrador' : (user?.plan || 'Usuário')}</p>
        </div>
      </div>
      {!isMobile && (
        <Button variant="ghost" size="icon" onClick={handleLogout} className={cn("text-sidebar-foreground transition-opacity hover:bg-sidebar-hover hover:text-white", isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100")} title="Sair">
          <LogOut className="h-5 w-5" />
        </Button>
      )}
    </Link>
  );

  return (
    <aside 
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        isMobile ? "h-full w-full" : "hidden md:flex border-r border-border/10 relative",
        !isMobile && (isCollapsed ? "w-20" : "w-64")
      )}
      onMouseEnter={() => !isMobile && onToggle && !propIsCollapsed && setIsHovered(true)}
      onMouseLeave={() => !isMobile && onToggle && !propIsCollapsed && setIsHovered(false)}
    >
      <div className="flex h-16 items-center border-b border-border/10 px-6 justify-between">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
          {themeSettings.logo_url && themeSettings.logo_url !== '/logo.svg' ? (
            <img src={themeSettings.logo_url} alt="Logo" className={cn("h-8 transition-all", isCollapsed ? "w-8" : "w-auto")} />
          ) : (
            <Stethoscope className="h-7 w-7 text-primary flex-shrink-0" />
          )}
          <h1 className={cn("text-xl font-bold text-white", isCollapsed && "hidden")}>Enfermagem Pro</h1>
        </div>
        {!isMobile && onToggle && (
           <button onClick={onToggle} className="text-sidebar-foreground hover:text-white focus:outline-none md:hidden">
             {/* Botão de toggle manual se necessário */}
           </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-sidebar-hover scrollbar-track-transparent">
        <SidebarNav isAdmin={isAdmin} userPlan={user?.plan} isCollapsed={isCollapsed} isMobile={isMobile} />
      </div>
      <div className="mt-auto border-t border-border/10 p-4 space-y-2">
        <DropdownMenu onOpenChange={setIsLockedOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-hover hover:text-white", isCollapsed && "justify-center")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 flex-shrink-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 flex-shrink-0" />
              <span className={cn("text-sm font-medium", isCollapsed && "hidden")}>Alterar Tema</span>
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