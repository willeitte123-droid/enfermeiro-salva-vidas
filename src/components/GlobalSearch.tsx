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
  BookHeart, FileSearch, HandHeart, FlaskConical, FileText, CaseSensitive
} from "lucide-react";

const searchItems = [
  { name: "Calculadora de Gotejamento", path: "/calculator", icon: Calculator },
  { name: "Escalas Clínicas", path: "/scales", icon: Scale },
  { name: "Guia de Medicamentos", path: "/medications", icon: Syringe },
  { name: "Protocolos de Emergência", path: "/emergency", icon: Siren },
  { name: "Guia de Curativos", path: "/wound-care", icon: Bandage },
  { name: "Guia de Procedimentos", path: "/procedures", icon: ClipboardList },
  { name: "Banca de Questões", path: "/questions", icon: FileQuestion },
  { name: "Guia de ECG", path: "/ecg", icon: BookHeart },
  { name: "Guia de Semiologia", path: "/semiology", icon: FileSearch },
  { name: "Guia de Semiotécnica", path: "/semiotechnique", icon: HandHeart },
  { name: "Calculadora de Doses", path: "/tools/dose-calculator", icon: FlaskConical },
  { name: "Valores Laboratoriais", path: "/tools/lab-values", icon: FileText },
  { name: "Gerador de Anotações (SAE)", path: "/tools/sae-generator", icon: CaseSensitive },
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
        <CommandGroup heading="Sugestões">
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