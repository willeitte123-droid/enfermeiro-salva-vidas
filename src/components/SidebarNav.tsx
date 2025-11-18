import { NavLink } from "react-router-dom";
import {
  Calculator, Siren, Syringe, Bandage, FileQuestion, Shield,
  LayoutDashboard, ChevronsUpDown, ListChecks, FileSearch, HandHeart,
  FlaskConical, FileText, NotebookText, Timer, Library, Star,
  Calculator as CalculatorIcon, BookHeart, ClipboardList, Webhook, Palette, BookText, BookA
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SheetClose } from "./ui/sheet";

interface SidebarNavProps {
  isAdmin: boolean;
  isCollapsed?: boolean;
  isMobile?: boolean;
}

const SidebarNav = ({ isAdmin, isCollapsed = false, isMobile = false }: SidebarNavProps) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-hover",
      isActive && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active/90"
    );

  const sectionHeaderClass = "flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary mt-4";
  
  const navItems = {
    main: [
      { to: "/", end: true, icon: LayoutDashboard, label: "Dashboard" },
      { to: "/favorites", icon: Star, label: "Meus Favoritos" },
    ],
    tools: [
      { to: "/calculator", icon: Calculator, label: "Gotejamento" },
      { to: "/scales", icon: ListChecks, label: "Escalas Clínicas" },
      { to: "/tools/dose-calculator", icon: FlaskConical, label: "Calculadora de Doses" },
      { to: "/tools/integrated-calculators", icon: CalculatorIcon, label: "DUM e IMC" },
      { to: "/tools/lab-values", icon: FileText, label: "Valores Laboratoriais" },
      { to: "/tools/bloco-de-notas", icon: NotebookText, label: "Bloco de Anotações" },
    ],
    study: [
      { to: "/questions", icon: FileQuestion, label: "Banca de Questões" },
      { to: "/simulado", icon: Timer, label: "Área de Simulado" },
      { to: "/review-area", icon: Library, label: "Área de Revisão" },
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

  const renderNavLink = (item: { to: string; end?: boolean; icon: React.ElementType; label: string }) => {
    const Icon = item.icon;
    const linkContent = (
      <>
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className={cn(isCollapsed && "hidden")}>{item.label}</span>
      </>
    );

    const link = (
      <NavLink to={item.to} end={item.end} className={navLinkClass}>
        {linkContent}
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