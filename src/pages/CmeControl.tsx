import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Webhook, Package, Wrench } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EquipmentList from "@/components/cme/EquipmentList";
import LoadList from "@/components/cme/LoadList";
import MaintenanceLogList from "@/components/cme/MaintenanceLogList";

const CmeControl = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Controle de CME
        </h1>
        <p className="text-muted-foreground">
          Gerencie equipamentos, rastreie cargas de esterilização e registre manutenções.
        </p>
      </div>

      <Tabs defaultValue="loads" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="loads" className="py-2 font-semibold">
            <Package className="mr-2 h-4 w-4" />
            Cargas
          </TabsTrigger>
          <TabsTrigger value="equipment" className="py-2 font-semibold">
            <Webhook className="mr-2 h-4 w-4" />
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="py-2 font-semibold">
            <Wrench className="mr-2 h-4 w-4" />
            Manutenção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loads" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rastreabilidade de Cargas</CardTitle>
              <CardDescription>
                Registre e monitore cada ciclo de esterilização para garantir a segurança e conformidade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoadList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Equipamentos</CardTitle>
              <CardDescription>
                Cadastre e acompanhe todos os seus equipamentos de esterilização.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Manutenção</CardTitle>
              <CardDescription>
                Mantenha um registro detalhado de todas as manutenções preventivas e corretivas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceLogList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CmeControl;