import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  Calculator,
  ListChecks,
  Syringe,
  ClipboardList,
  HelpCircle,
  Icon as LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mapeia strings para componentes de ícone
const iconMap: { [key: string]: LucideIcon } = {
  Calculator: Calculator,
  ListChecks: ListChecks,
  Syringe: Syringe,
  ClipboardList: ClipboardList,
  Gotejamento: Calculator,
  Escalas: ListChecks,
  Medicamentos: Syringe,
  Procedimentos: ClipboardList,
  "Escalas Clínicas": ListChecks, // Adicionando mapeamento para o título completo
};

/**
 * Retorna um componente de ícone Lucide com base em uma string de nome.
 * @param iconName O nome do ícone a ser retornado.
 * @returns O componente de ícone correspondente ou um ícone padrão (HelpCircle).
 */
export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || HelpCircle;
}