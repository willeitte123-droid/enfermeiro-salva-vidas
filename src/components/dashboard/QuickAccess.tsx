import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIcon } from "@/lib/utils";
import { Link } from "react-router-dom";

const quickAccessTools = [
  {
    title: "Gotejamento",
    path: "/calculadoras/gotejamento",
    icon: "Gotejamento",
    description: "Calcule a taxa de infusão.",
  },
  {
    title: "Escalas",
    path: "/escalas",
    icon: "Escalas",
    description: "Acesse escalas de avaliação.",
  },
  {
    title: "Medicamentos",
    path: "/calculadoras/medicamentos",
    icon: "Medicamentos",
    description: "Dose e diluição de fármacos.",
  },
  {
    title: "Procedimentos",
    path: "/procedimentos",
    icon: "Procedimentos",
    description: "Guias e passo-a-passo.",
  },
];

export function QuickAccess() {
  const Icon = getIcon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso Rápido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickAccessTools.map((tool) => {
            const ToolIcon = Icon(tool.icon);
            return (
              <Link
                key={tool.title}
                to={tool.path}
                className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-center"
              >
                <ToolIcon className="h-8 w-8" />
                <span className="text-sm font-medium">{tool.title}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}