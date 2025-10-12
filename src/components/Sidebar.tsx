import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  Calculator, Siren, Syringe, Bandage, FileQuestion, LogOut, ClipboardList, Shield,
  LayoutDashboard, ChevronsUpDown, Stethoscope, BookHeart, ListChecks, FileSearch, HandHeart,
  FlaskConical, FileText, NotebookText, Sun, Moon, Timer
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
}

const Sidebar = ({ isAdmin, user }: SidebarProps) => {
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-hover",
      isActive && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active/90"
    );

  const sectionHeaderClass = "flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-sidebar-hover mt-4";

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-border/10">
      <div className="flex h-16 items-center border-b border-border/10 px-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-white">Enfermagem Pro</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className={sectionHeaderClass}>
              Ferramentas
              <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-1 pl-4">
              <NavLink to="/calculator" className={navLinkClass}>
                <Calculator className="h-4 w-4" />
                Gotejamento
              </NavLink>
              <NavLink to="/scales" className={navLinkClass}>
                <ListChecks className="h-4 w-4" />
                Escalas Clínicas
              </NavLink>
              <NavLink to="/tools/dose-calculator" className={navLinkClass}>
                <FlaskConical className="h-4 w-4" />
                Calculadora de Doses
              </NavLink>
              <NavLink to="/tools/lab-values" className={navLinkClass}>
                <FileText className="h-4 w-4" />
                Valores Laboratoriais
              </NavLink>
              <NavLink to="/tools/bloco-de-notas" className={navLinkClass}>
                <NotebookText className="h-4 w-4" />
                Bloco de Anotações
              </NavLink>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className={sectionHeaderClass}>
              Consulta e Estudo
              <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-1 pl-4">
              <NavLink to="/questions" className={navLinkClass}>
                <FileQuestion className="h-4 w-4" />
                Banca de Questões
              </NavLink>
              <NavLink to="/simulado" className={navLinkClass}>
                <Timer className="h-4 w-4" />
                Área de Simulado
              </NavLink>
              <NavLink to="/procedures" className={navLinkClass}>
                <ClipboardList className="h-4 w-4" />
                Procedimentos
              </NavLink>
              <NavLink to="/medications" className={navLinkClass}>
                <Syringe className="h-4 w-4" />
                Medicamentos
              </NavLink>
              <NavLink to="/emergency" className={navLinkClass}>
                <Siren className="h-4 w-4" />
                Emergências
              </NavLink>
              <NavLink to="/wound-care" className={navLinkClass}>
                <Bandage className="h-4 w-4" />
                Curativos
              </NavLink>
              <NavLink to="/semiology" className={navLinkClass}>
                <FileSearch className="h-4 w-4" />
                Semiologia
              </NavLink>
              <NavLink to="/semiotechnique" className={navLinkClass}>
                <HandHeart className="h-4 w-4" />
                Semiotécnica
              </NavLink>
               <NavLink to="/ecg" className={navLinkClass}>
                <BookHeart className="h-4 w-4" />
                Guia de ECG
              </NavLink>
            </CollapsibleContent>
          </Collapsible>

          {isAdmin && (
            <NavLink to="/admin" className={cn(navLinkClass, "mt-4")}>
              <Shield className="h-4 w-4" />
              Painel Admin
            </NavLink>
          )}
        </nav>
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
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-sidebar-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sidebar-hover hover:text-white" title="Sair">
            <LogOut className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;