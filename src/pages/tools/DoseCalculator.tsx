import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

const DoseCalculator = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Calculadora de Doses</h1>
        <p className="text-muted-foreground">Calcule doses, diluições e taxas de infusão com precisão.</p>
      </div>
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <FlaskConical className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Em Breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Esta ferramenta poderosa para cálculo de medicamentos está em desenvolvimento e será lançada em breve!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoseCalculator;