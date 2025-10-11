import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, User, ShieldAlert, Gauge, Smile, Baby } from "lucide-react";

const scales = [
  {
    title: "Escala de Coma de Glasgow",
    description: "Avalia o nível de consciência de um paciente após um trauma craniano.",
    icon: Brain,
    path: "/scales/glasgow",
    status: "available",
  },
  {
    title: "Escala de Braden",
    description: "Avalia o risco de desenvolvimento de lesões por pressão em pacientes.",
    icon: User,
    path: "/scales/braden",
    status: "available",
  },
  {
    title: "Escala de Morse",
    description: "Avalia o risco de queda em pacientes hospitalizados.",
    icon: ShieldAlert,
    path: "#",
    status: "soon",
  },
  {
    title: "Escala de RASS",
    description: "Monitora o nível de agitação e sedação em pacientes críticos.",
    icon: Gauge,
    path: "#",
    status: "soon",
  },
  {
    title: "Escala de Faces (Wong-Baker)",
    description: "Avalia a intensidade da dor, especialmente em crianças.",
    icon: Smile,
    path: "#",
    status: "soon",
  },
  {
    title: "Escala de Fugulin",
    description: "Classifica o grau de dependência dos pacientes para dimensionamento.",
    icon: Baby,
    path: "#",
    status: "soon",
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
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
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