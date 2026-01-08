import { LucideIcon, Trophy, Moon, Brain, Flame, Target, BookOpen, Crown, Zap, Layers, Rocket, Medal, Pill, HeartCrack, Siren, Infinity, Timer, Gavel } from "lucide-react";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string; // Tailwind color class for icon
  bgGradient: string; // CSS gradient class
  difficulty: "Fácil" | "Médio" | "Difícil" | "Lendário";
}

export const BADGES: BadgeDef[] = [
  // MÉDIO
  {
    id: "night_owl",
    name: "Plantão 24h",
    description: "Estudou de madrugada (entre 00h e 05h).",
    icon: Moon,
    color: "text-indigo-400",
    bgGradient: "from-indigo-900/40 to-slate-800/40",
    difficulty: "Médio"
  },
  {
    id: "veteran",
    name: "Veterano",
    description: "Alcançou a marca de 100 acertos totais.",
    icon: Medal,
    color: "text-orange-400",
    bgGradient: "from-orange-300/20 to-red-400/20",
    difficulty: "Médio"
  },

  // DIFÍCIL
  {
    id: "sus_master",
    name: "Legislador",
    description: "Acertou 50 questões de Legislação do SUS ou Ética.",
    icon: Gavel,
    color: "text-blue-600",
    bgGradient: "from-blue-400/20 to-cyan-600/20",
    difficulty: "Difícil"
  },
  {
    id: "pharma_master",
    name: "Mestre dos Fármacos",
    description: "Acertou 50 questões de Farmacologia e Medicamentos.",
    icon: Pill,
    color: "text-rose-500",
    bgGradient: "from-rose-400/20 to-pink-600/20",
    difficulty: "Difícil"
  },
  {
    id: "urgency_master",
    name: "Socorrista de Elite",
    description: "Acertou 50 questões de Urgência e Emergência.",
    icon: Siren,
    color: "text-red-500",
    bgGradient: "from-red-500/20 to-orange-600/20",
    difficulty: "Difícil"
  },
  {
    id: "sharpshooter",
    name: "Na Mosca",
    description: "Atingiu 100% de acerto em um simulado.",
    icon: Target,
    color: "text-emerald-500",
    bgGradient: "from-emerald-500/20 to-green-600/20",
    difficulty: "Difícil"
  },
  {
    id: "dedicated",
    name: "Semana Perfeita",
    description: "Respondeu questões por 7 dias consecutivos.",
    icon: Flame,
    color: "text-orange-500",
    bgGradient: "from-orange-500/20 to-yellow-600/20",
    difficulty: "Difícil"
  },

  // LENDÁRIO
  {
    id: "expert",
    name: "Especialista",
    description: "Acumulou 500 acertos totais na plataforma.",
    icon: Brain,
    color: "text-pink-500",
    bgGradient: "from-pink-500/20 to-rose-600/20",
    difficulty: "Lendário"
  },
  {
    id: "thousand_club",
    name: "Lenda Milenar",
    description: "Alcançou a marca histórica de 1.000 questões corretas.",
    icon: Infinity,
    color: "text-violet-400",
    bgGradient: "from-violet-500/20 to-purple-800/20",
    difficulty: "Lendário"
  },
  {
    id: "marathoner",
    name: "Maratonista",
    description: "Concluiu 50 simulados completos.",
    icon: Timer,
    color: "text-cyan-400",
    bgGradient: "from-cyan-400/20 to-blue-500/20",
    difficulty: "Lendário"
  },
  {
    id: "top_rank",
    name: "O Escolhido",
    description: "Chegou ao Top 1 do Ranking Geral.",
    icon: Crown,
    color: "text-amber-300",
    bgGradient: "from-amber-300/20 to-yellow-600/20",
    difficulty: "Lendário"
  }
];