import { NavLink, useNavigate } from "react-router-dom";
import { Calculator, Siren, Syringe, Bandage, FileQuestion, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

const Navigation = () => {
  const navigate = useNavigate();
  const navItems = [
    { to: "/", icon: Calculator, label: "Calculadora" },
    { to: "/emergency", icon: Siren, label: "Emergências" },
    { to: "/medications", icon: Syringe, label: "Medicamentos" },
    { to: "/wound-care", icon: Bandage, label: "Curativos" },
    { to: "/questions", icon: FileQuestion, label: "Questões" }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); 
  };

  return (
    <nav className="border-b bg-card">
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
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">{item.label}</span>
              </NavLink>
            ))}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:bg-accent hover:text-accent-foreground ml-2" title="Sair">
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