import { NavLink, useNavigate } from "react-router-dom";
import {
  Calculator, Siren, Syringe, Bandage, FileQuestion, LogOut, ClipboardList, Shield,
  LayoutDashboard, ChevronsUpDown, Stethoscope, BookHeart, Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  isAdmin: boolean;
  user: {
    first_name?: string;
    last_name?: string;
  } | null;
}

const Sidebar = ({ isAdmin, user }: SidebarProps) => {
  const navigate = useNavigate();

  const getInitials = () => {
    const firstName = user?.first_name?.[0] || '';
    const lastName = user?.last_name?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-hover",
      isActive && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active/90"
    );

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-border/10">
      <div className="flex h-16 items-center border-b border-border/10 px-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-white">Enfermagem Pro</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-2">
          <NavLink to="/" end className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-sidebar-hover">
              Ferramentas
              <ChevronsUpDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-2 pl-4">
              <NavLink to="/calculator" className={navLinkClass}>
                <Calculator className="h-4 w-4" />
                Gotejamento
              </NavLink>
              <NavLink to="/scales" className={navLinkClass}>
                <Scale className="h-4 w-4" />
                Escalas Clínicas
              </NavLink>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-sidebar-hover">
              Consulta e Estudo
              <ChevronsUpDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-2 pl-4">
              <NavLink to="/questions" className={navLinkClass}>
                <FileQuestion className="h-4 w-4" />
                Banca de Questões
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
               <NavLink to="/ecg" className={navLinkClass}>
                <BookHeart className="h-4 w-4" />
                Guia de ECG
              </NavLink>
            </CollapsibleContent>
          </Collapsible>

          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <Shield className="h-4 w-4" />
              Painel Admin
            </NavLink>
          )}
        </nav>
      </div>
      <div className="mt-auto border-t border-border/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">{`${user?.first_name || ''} ${user?.last_name || ''}`}</p>
              <p className="text-xs text-sidebar-foreground">{isAdmin ? 'Administrador' : 'Usuário'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-sidebar-foreground hover:bg-sidebar-hover hover:text-white" title="Sair">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;