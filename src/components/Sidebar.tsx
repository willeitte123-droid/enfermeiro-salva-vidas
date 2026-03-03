import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Sun, Moon, Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useTheme } from "./ThemeProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import SidebarNav from "./SidebarNav";
import { useThemeCustomization } from "@/context/ThemeCustomizationContext";
import { SheetClose } from "@/components/ui/sheet";

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

const Sidebar = ({ isAdmin, user, isMobile = false }: SidebarProps) => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { themeSettings } = useThemeCustomization();
  const [isLockedOpen, setIsLockedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // No desktop, a sidebar expande se o mouse estiver em cima OU se o menu de tema estiver aberto.
  const isExpanded = isMobile ? true : (isHovered || isLockedOpen);
  const isCollapsed = !isExpanded;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // O redirecionamento será tratado automaticamente pelo AuthContext/Routes
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const LogoutButton = (
    <Button 
      variant="ghost" 
      onClick={handleLogout} 
      className={cn("w-full justify-start gap-3 px-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all", isCollapsed && "justify-center px-0")}
      title="Sair"
    >
      <LogOut className="h-5 w-5 flex-shrink-0" />
      <span className={cn("text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
        Sair
      </span>
    </Button>
  );

  return (
    <aside 
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-sidebar-border transition-all duration-300 ease-in-out",
        isMobile ? "h-full w-full" : "hidden md:flex border-r relative z-50",
        !isMobile && (isExpanded ? "w-64" : "w-20")
      )}
    >
      {/* Ajuste de padding (px-4 em vez de px-6) para garantir espaço para o título */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 justify-between relative overflow-hidden shrink-0">
        <div className={cn("flex items-center gap-3 transition-all duration-300 w-full", isCollapsed && "justify-center")}>
          {themeSettings.logo_url ? (
            <img src={themeSettings.logo_url} alt="Logo" className={cn("h-8 transition-all object-contain", isCollapsed ? "w-8" : "w-auto")} />
          ) : (
            <Stethoscope className="h-7 w-7 text-primary flex-shrink-0" />
          )}
          
          <h1 className={cn("text-lg font-bold text-sidebar-foreground whitespace-nowrap overflow-hidden transition-all duration-300 flex items-center", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-1")}>
            Enfermagem <span className="text-primary font-black ml-1">Pro</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-sidebar-hover scrollbar-track-transparent overflow-x-hidden">
        <SidebarNav isAdmin={isAdmin} userPlan={user?.plan} isCollapsed={isCollapsed} isMobile={isMobile} />
      </div>

      <div className="mt-auto border-t border-sidebar-border p-4 space-y-2 shrink-0">
        <DropdownMenu onOpenChange={setIsLockedOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-hover hover:text-white transition-all", isCollapsed && "justify-center px-0")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 flex-shrink-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                {!isCollapsed && "Alterar Tema"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isMobile ? (
          <SheetClose asChild>
            {LogoutButton}
          </SheetClose>
        ) : (
          LogoutButton
        )}
      </div>
    </aside>
  );
};

export default Sidebar;