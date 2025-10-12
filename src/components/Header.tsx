import { Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { GlobalSearch } from "./GlobalSearch";

const Header = ({ onSearchClick }: { onSearchClick: () => void }) => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          {/* O conteúdo do Sidebar para mobile pode ser inserido aqui no futuro */}
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <Button
          variant="outline"
          className="w-full justify-start text-sm text-muted-foreground"
          onClick={onSearchClick}
        >
          <Search className="mr-2 h-4 w-4" />
          Buscar em toda a plataforma...
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
    </header>
  );
};

export default Header;