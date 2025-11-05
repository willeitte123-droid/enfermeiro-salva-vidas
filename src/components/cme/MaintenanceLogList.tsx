import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface Profile { id: string; }
interface Equipment { id: string; name: string; }
interface Log { id: string; maintenance_date: string; technician: string; notes: string; sterilization_equipment: { name: string }; }

const logSchema = z.object({
  equipment_id: z.string({ required_error: "Selecione um equipamento." }),
  maintenance_date: z.date({ required_error: "A data é obrigatória." }),
  technician: z.string().optional(),
  notes: z.string().optional(),
});

const fetchLogs = async (userId: string) => {
  const { data, error } = await supabase.from("maintenance_logs").select("*, sterilization_equipment(name)").eq("user_id", userId).order("maintenance_date", { ascending: false });
  if (error) throw error;
  return data;
};

const fetchEquipmentForSelect = async (userId: string) => {
  const { data, error } = await supabase.from("sterilization_equipment").select("id, name").eq("user_id", userId);
  if (error) throw error;
  return data;
};

const MaintenanceLogList = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: logs = [], isLoading } = useQuery({ queryKey: ["maintenanceLogs", profile?.id], queryFn: () => fetchLogs(profile!.id), enabled: !!profile });
  const { data: equipment = [] } = useQuery({ queryKey: ["equipmentForSelect", profile?.id], queryFn: () => fetchEquipmentForSelect(profile!.id), enabled: !!profile });

  const form = useForm<z.infer<typeof logSchema>>({
    resolver: zodResolver(logSchema),
    defaultValues: { maintenance_date: new Date() },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof logSchema>) => {
      if (!profile) throw new Error("Usuário não autenticado.");
      const dataToInsert = { ...values, user_id: profile.id };
      const { error } = await supabase.from("maintenance_logs").insert(dataToInsert);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registro de manutenção criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["maintenanceLogs", profile?.id] });
      setIsDialogOpen(false);
    },
    onError: (error) => toast.error("Erro ao salvar registro", { description: error.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("maintenance_logs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registro excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["maintenanceLogs", profile?.id] });
    },
    onError: (error) => toast.error("Erro ao excluir registro", { description: error.message }),
  });

  const openDialog = () => {
    form.reset({ maintenance_date: new Date() });
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={openDialog}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Registro</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Registro de Manutenção</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(d => mutation.mutate(d))} className="space-y-4">
            <Controller name="equipment_id" control={form.control} render={({ field }) => (
              <div className="space-y-2"><Label>Equipamento</Label><Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>{equipment.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>{form.formState.errors.equipment_id && <p className="text-sm text-destructive">{form.formState.errors.equipment_id.message}</p>}</div>
            )} />
            <Controller name="maintenance_date" control={form.control} render={({ field }) => (
              <div className="space-y-2"><Label>Data</Label><Popover>
                <PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button></PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
              </Popover>{form.formState.errors.maintenance_date && <p className="text-sm text-destructive">{form.formState.errors.maintenance_date.message}</p>}</div>
            )} />
            <div className="space-y-2"><Label>Técnico</Label><Input {...form.register("technician")} /></div>
            <div className="space-y-2"><Label>Observações</Label><Textarea {...form.register("notes")} /></div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Equipamento</TableHead><TableHead>Técnico</TableHead><TableHead>Observações</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {logs.length > 0 ? logs.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{format(new Date(item.maintenance_date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell className="font-medium">{item.sterilization_equipment?.name}</TableCell>
                <TableCell>{item.technician}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.notes}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={5} className="h-24 text-center">Nenhum registro de manutenção.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaintenanceLogList;