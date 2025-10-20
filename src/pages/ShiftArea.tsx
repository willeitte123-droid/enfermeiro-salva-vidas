import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Shift, ShiftSelector } from "@/components/shift/ShiftSelector";
import { TeamManager } from "@/components/shift/TeamManager";
import { PatientManager } from "@/components/shift/PatientManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BedDouble, ClipboardUser } from "lucide-react";

interface Profile {
  id: string;
}

const ShiftArea = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  if (!profile) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Área do Plantão</h1>
          <p className="text-muted-foreground">Seu painel de controle para organização e gestão do turno.</p>
        </div>
        <ShiftSelector userId={profile.id} selectedShift={selectedShift} onShiftSelect={setSelectedShift} />
      </div>

      {selectedShift ? (
        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patients"><BedDouble className="mr-2 h-4 w-4" />Pacientes e Pendências</TabsTrigger>
            <TabsTrigger value="team"><Users className="mr-2 h-4 w-4" />Equipe e Escala</TabsTrigger>
          </TabsList>
          <TabsContent value="patients" className="mt-4">
            <PatientManager shiftId={selectedShift.id} userId={profile.id} />
          </TabsContent>
          <TabsContent value="team" className="mt-4">
            <TeamManager shiftId={selectedShift.id} userId={profile.id} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-card text-center p-8">
          <ClipboardUser className="h-16 w-16 mb-4 text-primary/30" />
          <h2 className="text-xl font-semibold">Nenhum plantão selecionado</h2>
          <p className="text-muted-foreground mt-2">Crie um novo plantão ou selecione um existente para começar.</p>
        </div>
      )}
    </div>
  );
};

export default ShiftArea;