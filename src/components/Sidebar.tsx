import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  Calculator, Siren, Syringe, Bandage, FileQuestion, LogOut, ClipboardList, Shield,
  LayoutDashboard, ChevronsUpDown, Stethoscope, BookHeart, ListChecks, FileSearch, HandHeart,
  FlaskConical, FileText, NotebookText, Sun, Moon, Timer, ChevronsLeft, ChevronsRight, Library, Star,
  Calculator as CalculatorIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "./ThemeProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface SidebarProps {
  isAdmin: boolean;
  user: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  } | null;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isAdmin, user, isCollapsed, onToggle }: SidebarProps) => {
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

  const handleLinkClick = () => {
    if (isCollapsed) {
      onToggle();
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-hover",
      isActive && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active/90"
    );

  const sectionHeaderClass = "flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-sidebar-hover mt-4";

  return (
    <aside className={cn(
      "hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-border/10 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <Button
        variant="primary"
        size="icon"
        className="absolute -right-4 top-16 z-10 h-8 w-8 rounded-full shadow-md"
        onClick={onToggle}
      >
        {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>

      <div className="flex h-16 items-center border-b border-border/10 px-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-7 w-7 text-primary flex-shrink-0" />
          <h1 className={cn("text-xl font-bold text-white", isCollapsed && "hidden")}>Enfermagem Pro</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={navLinkClass} onClick={handleLinkClick}>
            <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Dashboard</span>
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass} onClick={handleLinkClick}>
            <Star className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Meus Favoritos</span>
          </NavLink>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className={sectionHeaderClass}>
              <span className={cn(isCollapsed && "hidden")}>Ferramentas</span>
              <ChevronsUpDown className={cn("h-4 w-4 text-sidebar-foreground/50", isCollapsed && "hidden")} />
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pt-1", !isCollapsed && "pl-4")}>
              <NavLink to="/calculator" className={navLinkClass} onClick={handleLinkClick}>
                <Calculator className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Gotejamento</span>
              </NavLink>
              <NavLink to="/scales" className={navLinkClass} onClick={handleLinkClick}>
                <ListChecks className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Escalas Clínicas</span>
              </NavLink>
              <NavLink to="/tools/dose-calculator" className={navLinkClass} onClick={handleLinkClick}>
                <FlaskConical className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Calculadora de Doses</span>
              </NavLink>
              <NavLink to="/tools/integrated-calculators" className={navLinkClass} onClick={handleLinkClick}>
                <CalculatorIcon className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>DUM e IMC</span>
              </NavLink>
              <NavLink to="/tools/lab-values" className={navLinkClass} onClick={handleLinkClick}>
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Valores Laboratoriais</span>
              </NavLink>
              <NavLink to="/tools/bloco-de-notas" className={navLinkClass} onClick={handleLinkClick}>
                <NotebookText className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Bloco de Anotações</span>
              </NavLink>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className={sectionHeaderClass}>
              <span className={cn(isCollapsed && "hidden")}>Consulta e Estudo</span>
              <ChevronsUpDown className={cn("h-4 w-4 text-sidebar-foreground/50", isCollapsed && "hidden")} />
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pt-1", !isCollapsed && "pl-4")}>
              <NavLink to="/questions" className={navLinkClass} onClick={handleLinkClick}>
                <FileQuestion className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Banca de Questões</span>
              </NavLink>
              <NavLink to="/simulado" className={navLinkClass} onClick={handleLinkClick}>
                <Timer className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Área de Simulado</span>
              </NavLink>
              <NavLink to="/review-area" className={navLinkClass} onClick={handleLinkClick}>
                <Library className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Área de Revisão</span>
              </NavLink>
              <NavLink to="/procedures" className={navLinkClass} onClick={handleLinkClick}>
                <ClipboardList className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Procedimentos</span>
              </NavLink>
              <NavLink to="/medications" className={navLinkClass} onClick={handleLinkClick}>
                <Syringe className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Medicamentos</span>
              </NavLink>
              <NavLink to="/emergency" className={navLinkClass} onClick={handleLinkClick}>
                <Siren className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Emergências</span>
              </NavLink>
              <NavLink to="/wound-care" className={navLinkClass} onClick={handleLinkClick}>
                <Bandage className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Curativos</span>
              </NavLink>
              <NavLink to="/semiology" className={navLinkClass} onClick={handleLinkClick}>
                <FileSearch className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Semiologia</span>
              </NavLink>
              <NavLink to="/semiotechnique" className={navLinkClass} onClick={handleLinkClick}>
                <HandHeart className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Semiotécnica</span>
              </NavLink>
               <NavLink to="/ecg" className={navLinkClass} onClick={handleLinkClick}>
                <BookHeart className="h-4 w-4 flex-shrink-0" />
                <span className={cn(isCollapsed && "hidden")}>Guia de ECG</span>
              </NavLink>
            </CollapsibleContent>
          </Collapsible>

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => cn(navLinkClass({ isActive }), "mt-4")} onClick={handleLinkClick}>
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className={cn(isCollapsed && "hidden")}>Painel Admin</span>
            </NavLink>
          )}
        </nav>
      </div>
      <div className="mt-auto border-t border-border/10 p-4 space-y-2">
        <DropdownMenu>
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

        <Link to="/profile" className={cn("flex items-center justify-between p-2 rounded-md hover:bg-sidebar-hover group", isCollapsed && "justify-center")}>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage src={user?.avatar_url} alt={`${user?.first_name} ${user?.last_name}`} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className={cn(isCollapsed && "hidden")}>
              <p className="text-sm font-medium text-white">{`${user?.first_name || 'Usuário'} ${user?.last_name || ''}`}</p>
              <p className="text-xs text-sidebar-foreground">{isAdmin ? 'Administrador' : 'Usuário'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className={cn("text-sidebar-foreground transition-opacity hover:bg-sidebar-hover hover:text-white", isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100")} title="Sair">
            <LogOut className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;