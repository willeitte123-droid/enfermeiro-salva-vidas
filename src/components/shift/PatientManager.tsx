import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, BedDouble, Edit, Save, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TaskList } from "./TaskList";

interface PatientManagerProps {
  shiftId: string;
  userId: string;
}

export interface PatientAssignment {
  id: string;
  bed_number: string;
  patient_name: string | null;
  team_member_id: string | null;
}

interface TeamMember {
  id: string;
  name: string;
}

const fetchPatientAssignments = async (shiftId: string) => {
  const { data, error } = await supabase.from("patient_assignments").select("*").eq("shift_id", shiftId).order("bed_number");
  if (error) throw error;
  return data as PatientAssignment[];
};

const fetchTeamMembers = async (shiftId: string) => {
  const { data, error } = await supabase.from("team_members").select("id, name").eq("shift_id", shiftId);
  if (error) throw error;
  return data as TeamMember[];
};

export const PatientManager = ({ shiftId, userId }: PatientManagerProps) => {
  const queryClient = useQueryClient();
  const [newBed, setNewBed] = useState("");
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<PatientAssignment>>({});

  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patientAssignments", shiftId],
    queryFn: () => fetchPatientAssignments(shiftId),
    enabled: !!shiftId,
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ["teamMembers", shiftId],
    queryFn: () => fetchTeamMembers(shiftId),
    enabled: !!shiftId,
  });

  const addMutation = useMutation({
    mutationFn: async (bed_number: string) => {
      const { data, error } = await supabase.from("patient_assignments").insert({ bed_number, shift_id: shiftId, user_id: userId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientAssignments", shiftId] });
      setNewBed("");
    },
    onError: (error) => toast.error("Erro ao adicionar paciente", { description: error.message }),
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedPatient: Partial<PatientAssignment> & { id: string }) => {
      const { error } = await supabase.from("patient_assignments").update(updatedPatient).eq("id", updatedPatient.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientAssignments", shiftId] });
      setEditingPatientId(null);
    },
    onError: (error) => toast.error("Erro ao atualizar paciente", { description: error.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patient_assignments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patientAssignments", shiftId] }),
    onError: (error) => toast.error("Erro ao remover paciente", { description: error.message }),
  });

  const handleStartEditing = (patient: PatientAssignment) => {
    setEditingPatientId(patient.id);
    setEditFormData(patient);
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><BedDouble />Pacientes e Pendências</CardTitle><CardDescription>Liste os pacientes, adicione tarefas e atribua à sua equipe.</CardDescription></CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input placeholder="Nº do Leito" value={newBed} onChange={(e) => setNewBed(e.target.value)} />
          <Button onClick={() => addMutation.mutate(newBed)} disabled={!newBed || addMutation.isPending}>{addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}</Button>
        </div>
        {isLoadingPatients ? <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div> :
          <div className="space-y-4">
            {patients.map(patient => (
              <div key={patient.id} className="p-4 border rounded-lg bg-muted/20 space-y-3">
                {editingPatientId === patient.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><h3 className="font-bold text-lg text-primary">Leito {patient.bed_number}</h3>
                      <div className="flex gap-2">
                        <Button size="icon" onClick={() => updateMutation.mutate({ id: patient.id, ...editFormData })} disabled={updateMutation.isPending}><Save className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingPatientId(null)}><XCircle className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <Input placeholder="Nome do Paciente" value={editFormData.patient_name || ""} onChange={(e) => setEditFormData(d => ({ ...d, patient_name: e.target.value }))} />
                    <Select value={editFormData.team_member_id || ""} onValueChange={(value) => setEditFormData(d => ({ ...d, team_member_id: value }))}>
                      <SelectTrigger><SelectValue placeholder="Atribuir a..." /></SelectTrigger>
                      <SelectContent><SelectItem value="">Ninguém</SelectItem>{teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between"><h3 className="font-bold text-lg text-primary">Leito {patient.bed_number}</h3>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleStartEditing(patient)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(patient.id)} disabled={deleteMutation.isPending && deleteMutation.variables === patient.id}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    <p className="font-semibold">{patient.patient_name || "Paciente não identificado"}</p>
                    {patient.team_member_id && <div className="text-xs font-semibold text-primary mt-2">Atribuído a: {teamMembers.find(m => m.id === patient.team_member_id)?.name}</div>}
                  </div>
                )}
                 <TaskList patientAssignmentId={patient.id} userId={userId} />
              </div>
            ))}
            {patients.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">Nenhum paciente adicionado a este plantão.</p>}
          </div>
        }
      </CardContent>
    </Card>
  );
};