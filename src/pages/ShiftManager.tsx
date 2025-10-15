import { useState, useMemo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactToPrint from "react-to-print";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PlusCircle, Trash2, Users, BedDouble, Printer } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PrintableShift } from "@/components/PrintableShift";

interface Profile {
  id: string;
}

export interface Shift {
  id: string;
  title: string;
  shift_date: string;
  period: string;
  team_members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  patient_assignments: PatientAssignment[];
}

export interface PatientAssignment {
  id: string;
  bed_number: string;
}

const fetchShifts = async (userId: string) => {
  const { data, error } = await supabase
    .from("shifts")
    .select(`
      id,
      title,
      shift_date,
      period,
      team_members (
        id,
        name,
        patient_assignments (
          id,
          bed_number
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Shift[];
};

const ShiftManager = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [newTeamMemberName, setNewTeamMemberName] = useState("");
  const [newBedAssignments, setNewBedAssignments] = useState<Record<string, string>>({});
  const printableComponentRef = useRef<HTMLDivElement>(null);
  const [newShiftTitle, setNewShiftTitle] = useState("");
  const [newShiftPeriod, setNewShiftPeriod] = useState("Matutino");

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ["shifts", profile?.id],
    queryFn: () => fetchShifts(profile!.id),
    enabled: !!profile,
    onSuccess: (data) => {
      if (!selectedShiftId && data.length > 0) {
        setSelectedShiftId(data[0].id);
      }
    },
  });

  const selectedShift = useMemo(() => shifts.find(s => s.id === selectedShiftId), [shifts, selectedShiftId]);

  const mutationOptions = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shifts", profile?.id] }),
    onError: (error: Error) => toast.error("Ocorreu um erro", { description: error.message }),
  };

  const createShiftMutation = useMutation({
    mutationFn: async ({ title, period }: { title: string; period: string }) => {
      const { data, error } = await supabase.from("shifts").insert({ title, period, user_id: profile!.id }).select().single();
      if (error) throw error;
      return data;
    },
    ...mutationOptions,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shifts", profile?.id] });
      setSelectedShiftId(data.id);
      setNewShiftTitle("");
      setNewShiftPeriod("Matutino");
      toast.success("Plantão criado com sucesso!");
    },
  });

  const addTeamMemberMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("team_members").insert({ name, shift_id: selectedShiftId!, user_id: profile!.id });
      if (error) throw error;
    },
    ...mutationOptions,
  });

  const addPatientAssignmentMutation = useMutation({
    mutationFn: async ({ teamMemberId, bedNumber }: { teamMemberId: string; bedNumber: string }) => {
      const { error } = await supabase.from("patient_assignments").insert({ team_member_id: teamMemberId, bed_number: bedNumber, user_id: profile!.id });
      if (error) throw error;
    },
    ...mutationOptions,
  });

  const deleteItemMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    ...mutationOptions,
  });

  const handleAddTeamMember = () => {
    if (newTeamMemberName.trim() && selectedShiftId) {
      addTeamMemberMutation.mutate(newTeamMemberName.trim());
      setNewTeamMemberName("");
    }
  };

  const handleAddBed = (teamMemberId: string) => {
    const bedNumber = newBedAssignments[teamMemberId]?.trim();
    if (bedNumber) {
      addPatientAssignmentMutation.mutate({ teamMemberId, bedNumber });
      setNewBedAssignments(prev => ({ ...prev, [teamMemberId]: "" }));
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div style={{ display: "none" }}>
        <PrintableShift ref={printableComponentRef} shift={selectedShift || null} />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Gerenciador de Plantão</h1>
        <p className="text-muted-foreground">Organize sua equipe e distribua os pacientes de forma clara e rápida.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Seleção de Plantão</CardTitle>
              <CardDescription>Selecione um plantão existente ou crie um novo.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedShiftId || ""} onValueChange={setSelectedShiftId}>
                <SelectTrigger className="w-full sm:w-[250px]"><SelectValue placeholder="Selecione um plantão" /></SelectTrigger>
                <SelectContent>
                  {shifts.map(shift => <SelectItem key={shift.id} value={shift.id}>{shift.period} - {shift.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <ReactToPrint
                trigger={() => (
                  <Button variant="outline" disabled={!selectedShift}>
                    <Printer className="h-4 w-4 mr-2" />Imprimir
                  </Button>
                )}
                content={() => printableComponentRef.current}
                documentTitle={`Escala - ${selectedShift?.title || 'Plantão'}`}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild><Button><PlusCircle className="h-4 w-4 mr-2" />Novo</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Criar Novo Plantão</AlertDialogTitle><AlertDialogDescription>Dê um nome e selecione o período do seu plantão.</AlertDialogDescription></AlertDialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-shift-title">Título do Plantão</Label>
                      <Input id="new-shift-title" placeholder="Ex: UTI Geral, Clínica Médica" value={newShiftTitle} onChange={(e) => setNewShiftTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-shift-period">Período</Label>
                      <Select value={newShiftPeriod} onValueChange={setNewShiftPeriod}>
                        <SelectTrigger id="new-shift-period"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matutino">Matutino</SelectItem>
                          <SelectItem value="Vespertino">Vespertino</SelectItem>
                          <SelectItem value="Noturno">Noturno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => createShiftMutation.mutate({ title: newShiftTitle, period: newShiftPeriod })}>Criar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        {selectedShift ? (
          <CardContent>
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Input placeholder="Nome do Técnico de Enfermagem" value={newTeamMemberName} onChange={e => setNewTeamMemberName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTeamMember()} />
                <Button onClick={handleAddTeamMember} disabled={addTeamMemberMutation.isPending}><Users className="h-4 w-4 mr-2" />Adicionar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedShift.team_members.map(member => (
                  <Card key={member.id} className="flex flex-col">
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Apagar Técnico?</AlertDialogTitle><AlertDialogDescription>Isso também removerá todas as atribuições de leitos para este técnico.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => deleteItemMutation.mutate({ table: 'team_members', id: member.id })}>Apagar</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2">
                      {member.patient_assignments.map(assignment => (
                        <div key={assignment.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <div className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-primary" /><span>Leito {assignment.bed_number}</span></div>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteItemMutation.mutate({ table: 'patient_assignments', id: assignment.id })}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                    </CardContent>
                    <div className="p-4 border-t flex items-center gap-2">
                      <Input placeholder="Nº do Leito" value={newBedAssignments[member.id] || ""} onChange={e => setNewBedAssignments(prev => ({ ...prev, [member.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAddBed(member.id)} />
                      <Button variant="outline" size="sm" onClick={() => handleAddBed(member.id)}>Atribuir</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent className="text-center py-12 text-muted-foreground">
            {shifts.length > 0 ? "Selecione um plantão para começar." : "Crie seu primeiro plantão para organizar a equipe."}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ShiftManager;