import { NavLink } from "react-router-dom";
import {
  Calculator, Siren, Syringe, Bandage, FileQuestion, Shield,
  LayoutDashboard, ChevronsUpDown, ListChecks, FileSearch, HandHeart,
  FlaskConical, FileText, NotebookText, Timer, Library, Star,
  Calculator as CalculatorIcon, BookHeart, ClipboardList, Palette, BookText, BookA, Activity, GraduationCap, Lock, Brain, Trophy, PieChart, Map, User, BookOpen, Stethoscope, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SheetClose } from "./ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavProps {
  isAdmin: boolean;
  userPlan?: string;
  isCollapsed?: boolean;
  isMobile?: boolean;
}

const SidebarNav = ({ isAdmin, userPlan, isCollapsed = false, isMobile = false }: SidebarNavProps) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-hover",
      isActive && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active/90"
    );

  const sectionHeaderClass = "flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary mt-4";
  
  const navItems = {
    main: [
      { to: "/", end: true, icon: LayoutDashboard, label: "Dashboard" },
      { to: "/profile", icon: User, label: "Meu Perfil" },
      { to: "/favorites", icon: Star, label: "Meus Favoritos" },
      { to: "/ranking", icon: Trophy, label: "Ranking Geral" },
    ],
    tools: [
      { to: "/tools/performance", icon: PieChart, label: "Meu Desempenho" },
      { to: "/tools/bloco-de-notas", icon: NotebookText, label: "Bloco de Anotações" },
      { to: "/calculator", icon: Calculator, label: "Gotejamento" },
      { to: "/scales", icon: ListChecks, label: "Escalas Clínicas" },
      { to: "/tools/dose-calculator", icon: FlaskConical, label: "Calculadora de Doses" },
      { to: "/tools/integrated-calculators", icon: CalculatorIcon, label: "DUM e IMC" },
      { to: "/tools/lab-values", icon: FileText, label: "Valores Laboratoriais" },
    ],
    study: [
      { to: "/concursos", icon: Briefcase, label: "Mural de Concursos" },
      { to: "/clinical-cases", icon: Stethoscope, label: "Casos Clínicos" },
      { to: "/questions", icon: FileQuestion, label: "Banca de Questões" },
      { to: "/simulado", icon: Timer, label: "Área de Simulado" },
      { to: "/study-tracks", icon: Map, label: "Trilha de Estudos" },
      { to: "/concurseiro", icon: GraduationCap, label: "Área do Concurseiro" },
      { to: "/library", icon: BookOpen, label: "Biblioteca Digital" },
      { to: "/flashcards", icon: Brain, label: "Flashcards" },
      { to: "/review-area", icon: Library, label: "Área de Revisão" },
      { to: "/anatomy", icon: Activity, label: "Anatomia e Fisiologia" },
      { to: "/procedures", icon: ClipboardList, label: "Procedimentos" },
      { to: "/medications", icon: Syringe, label: "Medicamentos" },
      { to: "/emergency", icon: Siren, label: "Emergências" },
      { to: "/wound-care", icon: Bandage, label: "Curativos e Tratamento de Feridas" },
      { to: "/semiology", icon: FileSearch, label: "Semiologia" },
      { to: "/semiotechnique", icon: HandHeart, label: "Semiotécnica" },
      { to: "/ecg", icon: BookHeart, label: "Guia de ECG" },
      { to: "/nursing-notes", icon: BookText, label: "Anotações e Evolução" },
      { to: "/technical-terms", icon: BookA, label: "Termos Técnicos" },
    ],
    admin: [
      { to: "/admin", icon: Shield, label: "Painel Admin" },
      { to: "/admin/theme", icon: Palette, label: "Aparência" },
    ]
  };

  const isLinkLocked = (path: string) => {
    // 1. Admin tem acesso total
    if (isAdmin) return false;

    const plan = userPlan ? userPlan.toLowerCase() : 'free';

    // 2. Se o plano NÃO for 'free' (ou seja, é pago: Essencial, Pro, Premium, etc.), tem acesso TOTAL.
    if (plan !== 'free') {
      return false;
    }

    // 3. Regras para Plano FREE (Restrito)
    // Rotas permitidas: Dashboard e Perfil
    const allowedPathsForFree = ['/', '/profile'];
    
    // Se o path estiver na lista de permitidos, não bloqueia
    if (allowedPathsForFree.includes(path)) {
      return false;
    }

    // Bloqueia todo o resto para usuários Free
    return true; 
  };

  const renderNavLink = (item: { to: string; end?: boolean; icon: React.ElementType; label: string }) => {
    const Icon = item.icon;
    const locked = isLinkLocked(item.to);

    const content = (
      <div className={cn("flex items-center justify-between w-full", locked && "opacity-60")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className={cn(isCollapsed && "hidden", "truncate")}>{item.label}</span>
        </div>
        {locked && !isCollapsed && <Lock className="h-3 w-3 ml-2 flex-shrink-0" />}
      </div>
    );

    if (locked) {
      return (
        <TooltipProvider key={item.to} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(navLinkClass({ isActive: false }), "cursor-not-allowed relative group")}>
                {content}
                {/* Ícone de cadeado centralizado quando colapsado */}
                {isCollapsed && locked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-sidebar/50 rounded-md">
                    <Lock className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-primary text-primary-foreground border-primary">
              <p className="font-semibold">Funcionalidade exclusiva para assinantes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    const link = (
      <NavLink to={item.to} end={item.end} className={navLinkClass}>
        {content}
      </NavLink>
    );

    return isMobile ? <SheetClose asChild key={item.to}>{link}</SheetClose> : <div key={item.to}>{link}</div>;
  };

  return (
    <nav className="flex flex-col gap-1">
      {navItems.main.map(renderNavLink)}

      <Collapsible defaultOpen>
        <CollapsibleTrigger className={cn(sectionHeaderClass, "hover:bg-sidebar-hover", isCollapsed && "justify-center")} disabled={isCollapsed}>
          <span className={cn(isCollapsed && "hidden")}>Consulta e Estudo</span>
          {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50" />}
        </CollapsibleTrigger>
        <CollapsibleContent className={cn("space-y-1 pt-1", !isCollapsed && !isMobile && "pl-4")}>
          {navItems.study.map(renderNavLink)}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className={cn(sectionHeaderClass, "hover:bg-sidebar-hover", isCollapsed && "justify-center")} disabled={isCollapsed}>
          <span className={cn(isCollapsed && "hidden")}>Ferramentas</span>
          {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50" />}
        </CollapsibleTrigger>
        <CollapsibleContent className={cn("space-y-1 pt-1", !isCollapsed && !isMobile && "pl-4")}>
          {navItems.tools.map(renderNavLink)}
        </CollapsibleContent>
      </Collapsible>

      {isAdmin && (
        <>
          <div className="my-4 border-t border-border/10"></div>
          {navItems.admin.map(renderNavLink)}
        </>
      )}
    </nav>
  );
};

export default SidebarNav;