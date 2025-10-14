import { NavLink, NavLinkProps } from "react-router-dom";
import {
  Calculator, Siren, Syringe, Bandage, FileQuestion, Shield,
  LayoutDashboard, ChevronsUpDown, ListChecks, FileSearch, HandHeart,
  FlaskConical, FileText, NotebookText, Timer, Library, Star,
  Calculator as CalculatorIcon, BookHeart, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SheetClose } from "@/components/ui/sheet";

interface SidebarNavProps {
  isAdmin: boolean;
  isCollapsed?: boolean;
  isMobile?: boolean;
}

const NavItem: React.FC<React.PropsWithChildren<NavLinkProps & { isMobile: boolean }>> = ({ isMobile, children, ...props }) => {
  const LinkComponent = <NavLink {...props}>{children}</NavLink>;
  return isMobile ? <SheetClose asChild>{LinkComponent}</SheetClose> : LinkComponent;
};

const SidebarNav = ({ isAdmin, isCollapsed = false, isMobile = false }: SidebarNavProps) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-hover",
      isActive && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active/90"
    );

  const sectionHeaderClass = "flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-sidebar-hover mt-4";

  return (
    <nav className="flex flex-col gap-1">
      <NavItem to="/" end className={navLinkClass} isMobile={isMobile}>
        <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
        <span className={cn(isCollapsed && "hidden")}>Dashboard</span>
      </NavItem>
      <NavItem to="/favorites" className={navLinkClass} isMobile={isMobile}>
        <Star className="h-4 w-4 flex-shrink-0" />
        <span className={cn(isCollapsed && "hidden")}>Meus Favoritos</span>
      </NavItem>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className={sectionHeaderClass} disabled={isCollapsed}>
          <span className={cn(isCollapsed && "hidden")}>Ferramentas</span>
          {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50" />}
        </CollapsibleTrigger>
        <CollapsibleContent className={cn("space-y-1 pt-1", !isCollapsed && "pl-4")}>
          <NavItem to="/calculator" className={navLinkClass} isMobile={isMobile}>
            <Calculator className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Gotejamento</span>
          </NavItem>
          <NavItem to="/scales" className={navLinkClass} isMobile={isMobile}>
            <ListChecks className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Escalas Clínicas</span>
          </NavItem>
          <NavItem to="/tools/dose-calculator" className={navLinkClass} isMobile={isMobile}>
            <FlaskConical className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Calculadora de Doses</span>
          </NavItem>
          <NavItem to="/tools/integrated-calculators" className={navLinkClass} isMobile={isMobile}>
            <CalculatorIcon className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>DUM e IMC</span>
          </NavItem>
          <NavItem to="/tools/lab-values" className={navLinkClass} isMobile={isMobile}>
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Valores Laboratoriais</span>
          </NavItem>
          <NavItem to="/tools/bloco-de-notas" className={navLinkClass} isMobile={isMobile}>
            <NotebookText className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Bloco de Anotações</span>
          </NavItem>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className={sectionHeaderClass} disabled={isCollapsed}>
          <span className={cn(isCollapsed && "hidden")}>Consulta e Estudo</span>
          {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50" />}
        </CollapsibleTrigger>
        <CollapsibleContent className={cn("space-y-1 pt-1", !isCollapsed && "pl-4")}>
          <NavItem to="/questions" className={navLinkClass} isMobile={isMobile}>
            <FileQuestion className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Banca de Questões</span>
          </NavItem>
          <NavItem to="/simulado" className={navLinkClass} isMobile={isMobile}>
            <Timer className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Área de Simulado</span>
          </NavItem>
          <NavItem to="/review-area" className={navLinkClass} isMobile={isMobile}>
            <Library className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Área de Revisão</span>
          </NavItem>
          <NavItem to="/procedures" className={navLinkClass} isMobile={isMobile}>
            <ClipboardList className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Procedimentos</span>
          </NavItem>
          <NavItem to="/medications" className={navLinkClass} isMobile={isMobile}>
            <Syringe className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Medicamentos</span>
          </NavItem>
          <NavItem to="/emergency" className={navLinkClass} isMobile={isMobile}>
            <Siren className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Emergências</span>
          </NavItem>
          <NavItem to="/wound-care" className={navLinkClass} isMobile={isMobile}>
            <Bandage className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Curativos</span>
          </NavItem>
          <NavItem to="/semiology" className={navLinkClass} isMobile={isMobile}>
            <FileSearch className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Semiologia</span>
          </NavItem>
          <NavItem to="/semiotechnique" className={navLinkClass} isMobile={isMobile}>
            <HandHeart className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Semiotécnica</span>
          </NavItem>
          <NavItem to="/ecg" className={navLinkClass} isMobile={isMobile}>
            <BookHeart className="h-4 w-4 flex-shrink-0" />
            <span className={cn(isCollapsed && "hidden")}>Guia de ECG</span>
          </NavItem>
        </CollapsibleContent>
      </Collapsible>

      {isAdmin && (
        <NavItem to="/admin" className={({ isActive }: { isActive: boolean }) => cn(navLinkClass({ isActive }), "mt-4")} isMobile={isMobile}>
          <Shield className="h-4 w-4 flex-shrink-0" />
          <span className={cn(isCollapsed && "hidden")}>Painel Admin</span>
        </NavItem>
      )}
    </nav>
  );
};

export default SidebarNav;