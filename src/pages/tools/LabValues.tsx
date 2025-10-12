import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const LabValues = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Guia de Valores Laboratoriais</h1>
        <p className="text-muted-foreground">Consulte rapidamente os valores de referência para exames laboratoriais.</p>
      </div>
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Em Breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Uma referência completa de valores laboratoriais está sendo preparada para você.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabValues;