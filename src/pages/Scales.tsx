import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, User, ShieldAlert, Gauge, Smile, Users, Bed, Baby, Siren, Droplets, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const scales = [
  {
    title: "Escala de Coma de Glasgow",
    description: "Avalia o nível de consciência de um paciente após um trauma craniano.",
    icon: Brain,
    path: "/scales/glasgow",
    status: "available",
    color: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-300 dark:hover:border-blue-700",
    },
  },
  {
    title: "Escala de Braden",
    description: "Avalia o risco de desenvolvimento de lesões por pressão em pacientes.",
    icon: User,
    path: "/scales/braden",
    status: "available",
    color: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-700",
    },
  },
  {
    title: "Escala de RASS",
    description: "Monitora o nível de agitação e sedação em pacientes críticos.",
    icon: Gauge,
    path: "/scales/rass",
    status: "available",
    color: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-300 dark:hover:border-amber-700",
    },
  },
  {
    title: "Escala de Faces (Wong-Baker)",
    description: "Avalia a intensidade da dor, especialmente em crianças.",
    icon: Smile,
    path: "/scales/wong-baker",
    status: "available",
    color: {
      bg: "bg-rose-100 dark:bg-rose-900/30",
      text: "text-rose-600 dark:text-rose-400",
      border: "hover:border-rose-300 dark:hover:border-rose-700",
    },
  },
  {
    title: "Escala de Fugulin",
    description: "Classifica o grau de dependência dos pacientes para dimensionamento.",
    icon: Users,
    path: "/scales/fugulin",
    status: "available",
    color: {
      bg: "bg-violet-100 dark:bg-violet-900/30",
      text: "text-violet-600 dark:text-violet-400",
      border: "hover:border-violet-300 dark:hover:border-violet-700",
    },
  },
  {
    title: "Escala de Morse",
    description: "Avalia o risco de queda em pacientes hospitalizados.",
    icon: ShieldAlert,
    path: "/scales/morse",
    status: "available",
    color: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      border: "hover:border-red-300 dark:hover:border-red-700",
    },
  },
  {
    title: "Índice de Aldrete",
    description: "Avalia a recuperação pós-anestésica para alta da SRPA.",
    icon: Bed,
    path: "/scales/aldrete",
    status: "available",
    color: {
      bg: "bg-sky-100 dark:bg-sky-900/30",
      text: "text-sky-600 dark:text-sky-400",
      border: "hover:border-sky-300 dark:hover:border-sky-700",
    },
  },
  {
    title: "Índice de Apgar",
    description: "Avalia a vitalidade do recém-nascido ao nascer.",
    icon: Baby,
    path: "/scales/apgar",
    status: "available",
    color: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      text: "text-pink-600 dark:text-pink-400",
      border: "hover:border-pink-300 dark:hover:border-pink-700",
    },
  },
  {
    title: "Protocolo de Manchester",
    description: "Sistema de triagem para classificar a urgência em serviços de emergência.",
    icon: Siren,
    path: "/scales/manchester",
    status: "available",
    color: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
      border: "hover:border-orange-300 dark:hover:border-orange-700",
    },
  },
  {
    title: "Fórmula de Parkland",
    description: "Calcula a reposição volêmica para pacientes grandes queimados.",
    icon: Droplets,
    path: "/scales/parkland",
    status: "available",
    color: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      border: "hover:border-red-300 dark:hover:border-red-700",
    },
  },
  {
    title: "Classificação ASA",
    description: "Avalia o estado físico do paciente para o risco cirúrgico-anestésico.",
    icon: ShieldCheck,
    path: "/scales/asa",
    status: "available",
    color: {
      bg: "bg-teal-100 dark:bg-teal-900/30",
      text: "text-teal-600 dark:text-teal-400",
      border: "hover:border-teal-300 dark:hover:border-teal-700",
    },
  },
];

const Scales = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Escalas Clínicas</h1>
        <p className="text-muted-foreground">
          Ferramentas interativas para avaliações rápidas e precisas.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scales.map((scale, index) => {
          const Icon = scale.icon;
          return (
            <Card key={index} className={cn("flex flex-col transition-all", scale.color.border)}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-lg", scale.color.bg)}>
                    <Icon className={cn("h-6 w-6", scale.color.text)} />
                  </div>
                  <div>
                    <CardTitle>{scale.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardDescription className="px-6 pb-4 flex-1">{scale.description}</CardDescription>
              <CardFooter>
                {scale.status === "available" ? (
                  <Button asChild className="w-full">
                    <Link to={scale.path}>Acessar Calculadora</Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Em Breve
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Scales;