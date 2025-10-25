import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Calculator,
  ClipboardList,
  ListChecks,
  Siren,
} from "lucide-react";

const quickAccessItems = [
  {
    title: "Escalas",
    path: "/scales",
    icon: ListChecks,
    description: "Acesse e gerencie escalas de trabalho.",
  },
  {
    title: "Procedimentos",
    path: "/procedures",
    icon: ClipboardList,
    description: "Consulte e registre procedimentos.",
  },
  {
    title: "Emergência",
    path: "/emergency",
    icon: Siren,
    description: "Protocolos e guias de emergência.",
  },
  {
    title: "Calculadoras",
    path: "/tools",
    icon: Calculator,
    description: "Ferramentas e calculadoras úteis.",
  },
];

export function QuickAccess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso Rápido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickAccessItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg text-center hover:bg-accent hover:text-accent-foreground transition-colors h-28"
            >
              <item.icon className="h-8 w-8" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}