import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseSensitive } from "lucide-react";

const SaeGenerator = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerador de Anotações (SAE)</h1>
        <p className="text-muted-foreground">Estruture suas anotações de enfermagem de forma rápida e padronizada.</p>
      </div>
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <CaseSensitive className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Em Breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Estamos desenvolvendo uma ferramenta para auxiliar na criação de suas anotações de enfermagem.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaeGenerator;