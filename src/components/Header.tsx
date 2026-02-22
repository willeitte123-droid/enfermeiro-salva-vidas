import { Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./Sidebar";
import { StudyTimer } from "./StudyTimer";

interface HeaderProps {
  onSearchClick: () => void;
  isAdmin: boolean;
  user: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  } | null;
}

const Header = ({ onSearchClick, isAdmin, user }: HeaderProps) => {
  return (
    <header className="flex h-14 items-center gap-2 md:gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-72">
          <Sidebar isAdmin={isAdmin} user={user} isMobile={true} />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <Button
          variant="outline"
          className="w-full justify-start text-sm text-muted-foreground"
          onClick={onSearchClick}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Buscar em toda a plataforma...</span>
          <span className="inline sm:hidden">Buscar...</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 border-l pl-2 ml-2">
        <StudyTimer />
      </div>
    </header>
  );
};

export default Header;