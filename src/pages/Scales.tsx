import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import * as LucideIcons from "lucide-react";
import { Loader2 } from "lucide-react";

interface Scale {
  title: string;
  description: string;
  icon: keyof typeof LucideIcons;
  path: string;
  status: "available" | "soon";
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

const fetchScales = async (): Promise<Scale[]> => {
  const response = await fetch('/data/scales.json');
  if (!response.ok) {
    throw new Error('Não foi possível carregar as escalas.');
  }
  return response.json();
};

const Scales = () => {
  const { data: scales = [], isLoading } = useQuery({
    queryKey: ['scales'],
    queryFn: fetchScales,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Escalas Clínicas</h1>
        <p className="text-muted-foreground">
          Ferramentas interativas para avaliações rápidas e precisas.
        </p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scales.map((scale, index) => {
            const Icon = LucideIcons[scale.icon] as LucideIcons.LucideIcon;
            return (
              <Card key={index} className={cn("flex flex-col transition-all", scale.color.border)}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-lg", scale.color.bg)}>
                      {Icon && <Icon className={cn("h-6 w-6", scale.color.text)} />}
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
      )}
    </div>
  );
};

export default Scales;