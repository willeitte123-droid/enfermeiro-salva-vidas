import { LucideIcon, Trophy, Moon, Brain, Flame, Target, BookOpen, Crown, Zap } from "lucide-react";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string; // Tailwind color class for icon
  bgGradient: string; // CSS gradient class
}

export const BADGES: BadgeDef[] = [
  {
    id: "first_win",
    name: "Primeiros Passos",
    description: "Acertou sua primeira questão na plataforma.",
    icon: Zap,
    color: "text-yellow-400",
    bgGradient: "from-yellow-400/20 to-orange-500/20"
  },
  {
    id: "night_owl",
    name: "Plantão 24h",
    description: "Estudou de madrugada (entre 00h e 05h).",
    icon: Moon,
    color: "text-indigo-400",
    bgGradient: "from-indigo-500/20 to-purple-500/20"
  },
  {
    id: "sus_master",
    name: "Mestre do SUS",
    description: "Acertou 50 questões sobre Legislação do SUS.",
    icon: BookOpen,
    color: "text-blue-400",
    bgGradient: "from-blue-400/20 to-cyan-500/20"
  },
  {
    id: "sharpshooter",
    name: "Na Mosca",
    description: "Atingiu 100% de acerto em um simulado.",
    icon: Target,
    color: "text-red-500",
    bgGradient: "from-red-500/20 to-pink-500/20"
  },
  {
    id: "dedicated",
    name: "Semana Perfeita",
    description: "Respondeu questões por 7 dias consecutivos.",
    icon: Flame,
    color: "text-orange-500",
    bgGradient: "from-orange-400/20 to-red-500/20"
  },
  {
    id: "expert",
    name: "Especialista",
    description: "Acumulou 500 acertos totais.",
    icon: Brain,
    color: "text-emerald-500",
    bgGradient: "from-emerald-400/20 to-teal-500/20"
  },
  {
    id: "top_rank",
    name: "Lenda Viva",
    description: "Chegou ao Top 1 do Ranking Semanal.",
    icon: Crown,
    color: "text-amber-300",
    bgGradient: "from-amber-300/20 to-yellow-600/20"
  }
];