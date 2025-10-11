import { NavLink, useNavigate } from "react-router-dom";
import { Calculator, Siren, Syringe, Bandage, FileQuestion, LogOut, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

const Navigation = () => {
  const navigate = useNavigate();
  const navItems = [
    { to: "/questions", icon: FileQuestion, label: "Questões", activeClass: "text-amber-600 bg-amber-500/10", inactiveClass: "hover:bg-white/60" },
    { to: "/procedures", icon: ClipboardList, label: "Procedimentos", activeClass: "text-cyan-600 bg-cyan-500/10", inactiveClass: "hover:bg-white/60" },
    { to: "/medications", icon: Syringe, label: "Medicamentos", activeClass: "text-purple-600 bg-purple-500/10", inactiveClass: "hover:bg-white/60" },
    { to: "/", icon: Calculator, label: "Calculadora", activeClass: "text-indigo-600 bg-indigo-500/10", inactiveClass: "hover:bg-white/60" },
    { to: "/emergency", icon: Siren, label: "Emergências", activeClass: "text-rose-600 bg-rose-500/10", inactiveClass: "hover:bg-white/60" },
    { to: "/wound-care", icon: Bandage, label: "Curativos", activeClass: "text-emerald-600 bg-emerald-500/10", inactiveClass: "hover:bg-white/60" }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); 
  };

  return (
    <nav className="border-b border-blue-200 bg-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">+</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Enfermagem Pro</h1>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-muted-foreground",
                    isActive
                      ? item.activeClass
                      : item.inactiveClass
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:bg-white/60 hover:text-accent-foreground ml-2" title="Sair">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;