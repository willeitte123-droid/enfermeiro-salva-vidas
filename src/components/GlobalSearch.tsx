import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Calculator, Scale, Syringe, Siren, Bandage, ClipboardList, FileQuestion,
  BookHeart, FileSearch, HandHeart, FlaskConical, FileText, NotebookText, Timer, Library, Star, Calendar,
  GraduationCap, Map, MonitorPlay, Stethoscope, BrainCircuit, Activity, LineChart, Briefcase, Trophy, User, HelpCircle, BookOpen
} from "lucide-react";

const searchItems = [
  { name: "Dashboard / Início", path: "/", icon: Calendar },
  { name: "Meu Cronograma / Planejador", path: "/planner", icon: Calendar },
  { name: "Trilha de Estudos", path: "/study-tracks", icon: Map },
  { name: "Banca de Questões", path: "/questions", icon: FileQuestion },
  { name: "Área de Simulado", path: "/simulado", icon: Timer },
  { name: "Área do Concurseiro", path: "/concurseiro", icon: GraduationCap },
  { name: "Vídeo Aulas", path: "/video-library", icon: MonitorPlay },
  { name: "Flashcards", path: "/flashcards", icon: BrainCircuit },
  { name: "Área de Revisão", path: "/review-area", icon: Library },
  { name: "Casos Clínicos Interativos", path: "/clinical-cases", icon: Stethoscope },
  { name: "Biblioteca Digital (PDFs)", path: "/library", icon: BookOpen },
  { name: "Anatomia e Fisiologia", path: "/anatomy", icon: Activity },
  { name: "Meu Desempenho", path: "/tools/performance", icon: LineChart },
  { name: "Guia de Medicamentos", path: "/medications", icon: Syringe },
  { name: "Protocolos de Emergência", path: "/emergency", icon: Siren },
  { name: "Guia de Curativos e Feridas", path: "/wound-care", icon: Bandage },
  { name: "Guia de Procedimentos", path: "/procedures", icon: ClipboardList },
  { name: "Semiologia", path: "/semiology", icon: FileSearch },
  { name: "Semiotécnica", path: "/semiotechnique", icon: HandHeart },
  { name: "Guia de ECG", path: "/ecg", icon: BookHeart },
  { name: "Anotações e Evolução de Enfermagem", path: "/nursing-notes", icon: FileText },
  { name: "Termos Técnicos", path: "/technical-terms", icon: BookOpen },
  { name: "Calculadora de Gotejamento", path: "/calculator", icon: Calculator },
  { name: "Calculadora de Doses", path: "/tools/dose-calculator", icon: FlaskConical },
  { name: "Calculadora de DUM e IMC", path: "/tools/integrated-calculators", icon: Calculator },
  { name: "Escalas Clínicas", path: "/scales", icon: Scale },
  { name: "Valores Laboratoriais", path: "/tools/lab-values", icon: FileText },
  { name: "Bloco de Anotações", path: "/tools/bloco-de-notas", icon: NotebookText },
  { name: "Mural de Concursos", path: "/concursos", icon: Briefcase },
  { name: "Ranking Geral", path: "/ranking", icon: Trophy },
  { name: "Meus Favoritos", path: "/favorites", icon: Star },
  { name: "Meu Perfil", path: "/profile", icon: User },
  { name: "Perguntas Frequentes (FAQ)", path: "/faq", icon: HelpCircle },
];

export function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Digite um comando ou busque..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Acesso Rápido">
          {searchItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem key={item.path} onSelect={() => runCommand(item.path)}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}