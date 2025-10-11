import { NavLink, useNavigate } from "react-router-dom";
import { Calculator, Siren, Syringe, Bandage, FileQuestion, LogOut, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

const Navigation = () => {
  const navigate = useNavigate();
  const navItems = [
    { to: "/questions", icon: FileQuestion, label: "Questões" },
    { to: "/procedures", icon: ClipboardList, label: "Procedimentos" },
    { to: "/medications", icon: Syringe, label: "Medicamentos" },
    { to: "/", icon: Calculator, label: "Calculadora" },
    { to: "/emergency", icon: Siren, label: "Emergências" },
    { to: "/wound-care", icon: Bandage, label: "Curativos" }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); 
  };

  return (
    <nav className="border-b border-blue-700 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <h1 className="text-xl font-bold text-white">Enfermagem Pro</h1>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-blue-100 hover:bg-white/20 hover:text-white",
                    isActive && "bg-white text-blue-700 font-semibold shadow-inner"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-blue-200 hover:bg-blue-700 hover:text-white ml-2" title="Sair">
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