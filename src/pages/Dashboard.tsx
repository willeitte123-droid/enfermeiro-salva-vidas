import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, Syringe, Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bem-vindo ao Enfermagem Pro</h1>
        <p className="text-muted-foreground mt-2">Sua plataforma completa de ferramentas e conhecimento para a prática de enfermagem.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileQuestion className="h-6 w-6 text-primary" />
              Questão do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground mb-4">
              Em uma PCR, qual a sequência correta do suporte básico de vida?
            </p>
            <p className="text-sm font-semibold text-green-600">
              (Em breve você poderá responder e ver a explicação aqui!)
            </p>
          </CardContent>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/questions">
                Ir para a Banca de Questões <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 grid grid-cols-2 gap-4">
            <Button variant="outline" asChild className="h-20 flex-col gap-2">
              <Link to="/calculator">
                <Calculator className="h-6 w-6" />
                <span>Gotejamento</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col gap-2">
              <Link to="/medications">
                <Syringe className="h-6 w-6" />
                <span>Medicamentos</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                (Em breve você poderá favoritar seus guias e ferramentas preferidos para acesso rápido aqui.)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;