import { Link, useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BrainCircuit,
  FileQuestion,
  GraduationCap,
  LineChart,
  Stethoscope,
  Calculator,
  Pill,
  BookA,
  Timer,
  Users,
  ShieldCheck,
  MonitorPlay,
  Activity,
  Siren,
  Bandage,
  Trophy,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Map,
  BookOpen,
  Library,
  ClipboardList,
  Syringe,
  FileSearch,
  HandHeart,
  BookHeart,
  BookText,
  FlaskConical,
  Calculator as CalculatorIcon,
  ListChecks,
  FileText,
  NotebookText,
  Briefcase,
  Star,
  User,
  Shield,
  Palette,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SheetClose } from "./ui/sheet";

interface SidebarNavProps {
  isAdmin: boolean;
  userPlan?: string;
  isCollapsed: boolean;
  isMobile?: boolean;
}

type NavItem = {
  title: string;
  icon: any;
  href: string;
  variant: "default" | "ghost";
  highlight?: boolean;
};

type NavGroup = {
  title: string;
  icon: any;
  items: NavItem[];
  collapsed?: boolean;
};

const SidebarNav = ({ isAdmin, userPlan, isCollapsed, isMobile }: SidebarNavProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Estado para controlar quais grupos estão abertos
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupTitle)
        ? prev.filter((t) => t !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const dashboardItem: NavItem = {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    variant: "default",
  };

  const adminItem: NavItem = {
    title: "Administração",
    icon: ShieldCheck,
    href: "/admin",
    variant: "ghost",
    highlight: true
  };

  // Mapeamento completo de todos os links existentes nas novas categorias
  const navGroups: NavGroup[] = [
    {
      title: "Estudos",
      icon: GraduationCap,
      items: [
        { title: "Banca de Questões", icon: FileQuestion, href: "/questions", variant: "ghost" },
        { title: "Área de Simulado", icon: Timer, href: "/simulado", variant: "ghost" },
        { title: "Vídeo Aulas", icon: MonitorPlay, href: "/video-library", variant: "ghost" },
        { title: "Trilha de Estudos", icon: Map, href: "/study-tracks", variant: "ghost" },
        { title: "Casos Clínicos", icon: Stethoscope, href: "/clinical-cases", variant: "ghost" },
        { title: "Área do Concurseiro", icon: GraduationCap, href: "/concurseiro", variant: "ghost" },
        { title: "Biblioteca Digital", icon: BookOpen, href: "/library", variant: "ghost" },
        { title: "Flashcards", icon: BrainCircuit, href: "/flashcards", variant: "ghost" },
        { title: "Área de Revisão", icon: Library, href: "/review-area", variant: "ghost" },
        { title: "Anatomia", icon: Activity, href: "/anatomy", variant: "ghost" },
        { title: "Meu Desempenho", icon: LineChart, href: "/tools/performance", variant: "ghost" },
      ]
    },
    {
      title: "Prática Clínica",
      icon: Stethoscope,
      items: [
        { title: "Medicamentos", icon: Syringe, href: "/medications", variant: "ghost" },
        { title: "Emergências", icon: Siren, href: "/emergency", variant: "ghost" },
        { title: "Curativos", icon: Bandage, href: "/wound-care", variant: "ghost" },
        { title: "Procedimentos", icon: ClipboardList, href: "/procedures", variant: "ghost" },
        { title: "Semiologia", icon: FileSearch, href: "/semiology", variant: "ghost" },
        { title: "Semiotécnica", icon: HandHeart, href: "/semiotechnique", variant: "ghost" },
        { title: "Guia de ECG", icon: BookHeart, href: "/ecg", variant: "ghost" },
        { title: "Anotações e Evolução", icon: BookText, href: "/nursing-notes", variant: "ghost" },
        { title: "Termos Técnicos", icon: BookA, href: "/technical-terms", variant: "ghost" },
      ]
    },
    {
      title: "Ferramentas",
      icon: Calculator,
      items: [
        { title: "Gotejamento", icon: Calculator, href: "/calculator", variant: "ghost" },
        { title: "Calc. de Doses", icon: FlaskConical, href: "/tools/dose-calculator", variant: "ghost" },
        { title: "DUM e IMC", icon: CalculatorIcon, href: "/tools/integrated-calculators", variant: "ghost" },
        { title: "Escalas Clínicas", icon: ListChecks, href: "/scales", variant: "ghost" },
        { title: "Valores Lab.", icon: FileText, href: "/tools/lab-values", variant: "ghost" },
        { title: "Bloco de Notas", icon: NotebookText, href: "/tools/bloco-de-notas", variant: "ghost" },
      ]
    },
    {
      title: "Comunidade",
      icon: Users,
      items: [
        { title: "Concursos", icon: Briefcase, href: "/concursos", variant: "ghost" },
        { title: "Ranking", icon: Trophy, href: "/ranking", variant: "ghost" },
        { title: "Favoritos", icon: Star, href: "/favorites", variant: "ghost" },
        { title: "Meu Perfil", icon: User, href: "/profile", variant: "ghost" },
      ]
    }
  ];

  // Abre o grupo automaticamente se estivermos em uma rota filha
  useEffect(() => {
    navGroups.forEach(group => {
      if (group.items.some(item => pathname === item.href)) {
        setOpenGroups(prev => prev.includes(group.title) ? prev : [...prev, group.title]);
      }
    });
  }, [pathname]);

  const isLinkLocked = (path: string) => {
    if (isAdmin) return false;
    const plan = userPlan ? userPlan.toLowerCase() : 'free';
    if (plan !== 'free') return false;
    const allowedPathsForFree = ['/', '/profile'];
    return !allowedPathsForFree.includes(path);
  };

  // Renderiza um item simples (Link direto)
  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = pathname === item.href;
    const locked = isLinkLocked(item.href);
    
    // Conteúdo do Link
    const LinkContent = (
      <>
        <item.icon className={cn("mr-2 h-4 w-4", isChild && "h-3.5 w-3.5 opacity-70", isCollapsed && "mr-0")} />
        <span className={cn("truncate", isCollapsed && "hidden")}>{item.title}</span>
        {locked && !isCollapsed && <Lock className="h-3 w-3 ml-auto opacity-50" />}
      </>
    );

    // Se estiver bloqueado (apenas visual, sem link funcional)
    if (locked) {
      return (
        <TooltipProvider key={item.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/50 cursor-not-allowed hover:bg-sidebar-hover/50",
                  isCollapsed && "justify-center px-0 h-10 w-10"
                )}
              >
                <item.icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
                <span className={cn(isCollapsed && "hidden")}>{item.title}</span>
                {!isCollapsed && <Lock className="h-3 w-3 ml-auto" />}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Exclusivo para assinantes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Link Funcional
    const linkElement = (
      <NavLink
        to={item.href}
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-hover hover:text-white",
          isActive ? "bg-sidebar-active text-sidebar-active-foreground shadow-sm" : "text-sidebar-foreground",
          isChild && "ml-4 text-xs pl-4 border-l border-sidebar-border/50 hover:border-sidebar-foreground/30",
          item.highlight && "text-amber-500 hover:text-amber-400 font-bold bg-amber-500/10",
          isCollapsed && "justify-center px-0 h-10 w-10 ml-0 border-0"
        )}
      >
        {LinkContent}
      </NavLink>
    );

    // Wrapper para Tooltip (se colapsado) e SheetClose (se mobile)
    if (isCollapsed && !isMobile) {
      return (
        <TooltipProvider key={item.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {linkElement}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover text-popover-foreground">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (isMobile) {
      return <SheetClose key={item.href} asChild>{linkElement}</SheetClose>;
    }

    return linkElement;
  };

  // Renderiza um grupo (Collapsible ou Dropdown)
  const renderNavGroup = (group: NavGroup) => {
    const isActiveGroup = group.items.some(item => pathname === item.href);
    const isOpen = openGroups.includes(group.title);

    // Modo Colapsado (Ícone que abre Dropdown)
    if (isCollapsed && !isMobile) {
      return (
        <DropdownMenu key={group.title}>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex h-10 w-10 p-0 items-center justify-center rounded-md transition-colors hover:bg-sidebar-hover hover:text-white data-[state=open]:bg-sidebar-hover data-[state=open]:text-white",
                      isActiveGroup ? "bg-sidebar-active/20 text-sidebar-active-foreground" : "text-sidebar-foreground"
                    )}
                  >
                    <group.icon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover text-popover-foreground">
                {group.title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenuContent side="right" align="start" className="w-56 bg-card border-border shadow-xl ml-2">
            <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">{group.title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {group.items.map(item => {
               const locked = isLinkLocked(item.href);
               if (locked) {
                 return (
                    <DropdownMenuItem key={item.href} disabled className="opacity-50 cursor-not-allowed">
                      <item.icon className="h-4 w-4 mr-2" /> {item.title} <Lock className="h-3 w-3 ml-auto" />
                    </DropdownMenuItem>
                 );
               }
               return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} className={cn("cursor-pointer flex items-center gap-2", pathname === item.href && "text-primary font-bold bg-primary/10")}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
               );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Modo Expandido (Accordion)
    return (
      <Collapsible
        key={group.title}
        open={isOpen}
        onOpenChange={() => toggleGroup(group.title)}
        className="space-y-1"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between px-3 py-2 h-auto hover:bg-sidebar-hover hover:text-white group",
              isActiveGroup ? "text-sidebar-active-foreground font-semibold" : "text-sidebar-foreground"
            )}
          >
            <div className="flex items-center">
              <group.icon className="mr-2 h-4 w-4 opacity-80 group-hover:opacity-100" />
              <span className="text-sm">{group.title}</span>
            </div>
            {isOpen ? <ChevronDown className="h-3 w-3 opacity-50" /> : <ChevronRight className="h-3 w-3 opacity-50" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pt-1 animate-accordion-down overflow-hidden">
          {group.items.map(item => renderNavItem(item, true))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <nav className={cn("flex flex-col gap-2", isCollapsed ? "items-center px-2" : "px-2")}>
      
      {/* Item Principal */}
      <div className="mb-2">
        {renderNavItem(dashboardItem)}
      </div>

      {/* Divisor Visual */}
      {!isCollapsed && <div className="mx-3 my-2 border-t border-sidebar-border/50" />}

      {/* Grupos de Navegação */}
      <div className={cn("space-y-1", isCollapsed && "space-y-3 flex flex-col items-center")}>
        {navGroups.map(renderNavGroup)}
      </div>

      {/* Admin (Condicional) */}
      {isAdmin && (
        <>
          {!isCollapsed && <div className="mx-3 my-2 border-t border-sidebar-border/50" />}
          <div className="mt-auto pt-2">
            {renderNavItem(adminItem)}
            {/* Opção extra de tema se não estiver colapsado, ou tratado no Sidebar principal */}
            {!isCollapsed && (
                <NavLink to="/admin/theme" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-hover hover:text-white text-sidebar-foreground ml-4 text-xs pl-4 border-l border-sidebar-border/50">
                    <Palette className="mr-2 h-3.5 w-3.5 opacity-70" />
                    <span>Aparência</span>
                </NavLink>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default SidebarNav;