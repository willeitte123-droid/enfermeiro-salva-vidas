import { useOutletContext } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageCheck, ShieldCheck, Wrench } from "lucide-react";

interface Profile {
  id: string;
}

const SterilizationCenter = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();

  if (!profile) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Central de Material e Esterilização (CME)</h1>
        <p className="text-muted-foreground">Gerencie e rastreie seus processos de esterilização.</p>
      </div>

      <Tabs defaultValue="traceability" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="traceability"><PackageCheck className="mr-2 h-4 w-4" />Rastreabilidade de Cargas</TabsTrigger>
          <TabsTrigger value="validation"><ShieldCheck className="mr-2 h-4 w-4" />Validação de Processos</TabsTrigger>
          <TabsTrigger value="maintenance"><Wrench className="mr-2 h-4 w-4" />Manutenção Preventiva</TabsTrigger>
        </TabsList>
        <TabsContent value="traceability" className="mt-4">
          <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-card text-center p-8">
            <h2 className="text-xl font-semibold">Em Construção</h2>
            <p className="text-muted-foreground mt-2">A funcionalidade de rastreabilidade de cargas será implementada aqui.</p>
          </div>
        </TabsContent>
        <TabsContent value="validation" className="mt-4">
          <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-card text-center p-8">
            <h2 className="text-xl font-semibold">Em Construção</h2>
            <p className="text-muted-foreground mt-2">O guia de validação de processos será implementado aqui.</p>
          </div>
        </TabsContent>
        <TabsContent value="maintenance" className="mt-4">
          <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-card text-center p-8">
            <h2 className="text-xl font-semibold">Em Construção</h2>
            <p className="text-muted-foreground mt-2">A ferramenta de gestão de manutenção será implementada aqui.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SterilizationCenter;