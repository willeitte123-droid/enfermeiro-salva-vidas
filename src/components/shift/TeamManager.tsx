import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

interface TeamManagerProps {
  shiftId: string;
  userId: string;
}

interface TeamMember {
  id: string;
  name: string;
}

const fetchTeamMembers = async (shiftId: string) => {
  const { data, error } = await supabase.from("team_members").select("*").eq("shift_id", shiftId);
  if (error) throw error;
  return data as TeamMember[];
};

export const TeamManager = ({ shiftId, userId }: TeamManagerProps) => {
  const queryClient = useQueryClient();
  const [newMemberName, setNewMemberName] = useState("");

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["teamMembers", shiftId],
    queryFn: () => fetchTeamMembers(shiftId),
    enabled: !!shiftId,
  });

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase.from("team_members").insert({ name, shift_id: shiftId, user_id: userId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers", shiftId] });
      setNewMemberName("");
    },
    onError: (error) => toast.error("Erro ao adicionar membro", { description: error.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers", shiftId] });
      queryClient.invalidateQueries({ queryKey: ["patientAssignments", shiftId] }); // Invalidate patients to update assignments
    },
    onError: (error) => toast.error("Erro ao remover membro", { description: error.message }),
  });

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Users />Equipe do Plantão</CardTitle><CardDescription>Adicione os técnicos de enfermagem e outros membros da sua equipe.</CardDescription></CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input placeholder="Nome do membro da equipe" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
          <Button onClick={() => addMutation.mutate(newMemberName)} disabled={!newMemberName || addMutation.isPending}>{addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}</Button>
        </div>
        {isLoading ? <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div> :
          <div className="space-y-2">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                <span className="font-medium">{member.name}</span>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(member.id)} disabled={deleteMutation.isPending && deleteMutation.variables === member.id}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            {teamMembers.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">Nenhum membro na equipe ainda.</p>}
          </div>
        }
      </CardContent>
    </Card>
  );
};