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
import { CalendarIcon, PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Profile { id: string; }
interface Equipment { id: string; name: string; type: string; serial_number: string; next_maintenance_date: string; }

const equipmentSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  type: z.string().optional(),
  serial_number: z.string().optional(),
  next_maintenance_date: z.date().optional(),
});

const fetchEquipment = async (userId: string) => {
  const { data, error } = await supabase.from("sterilization_equipment").select("*").eq("user_id", userId).order("name");
  if (error) throw error;
  return data;
};

const EquipmentList = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ["equipment", profile?.id],
    queryFn: () => fetchEquipment(profile!.id),
    enabled: !!profile,
  });

  const form = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: { name: "", type: "", serial_number: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof equipmentSchema>) => {
      if (!profile) throw new Error("Usuário não autenticado.");
      const dataToUpsert = { ...values, user_id: profile.id, id: editingEquipment?.id };
      const { error } = await supabase.from("sterilization_equipment").upsert(dataToUpsert);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Equipamento ${editingEquipment ? 'atualizado' : 'criado'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["equipment", profile?.id] });
      setIsDialogOpen(false);
    },
    onError: (error) => toast.error("Erro ao salvar equipamento", { description: error.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sterilization_equipment").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Equipamento excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["equipment", profile?.id] });
    },
    onError: (error) => toast.error("Erro ao excluir equipamento", { description: error.message }),
  });

  const openDialog = (equipment: Equipment | null = null) => {
    setEditingEquipment(equipment);
    form.reset(equipment ? { ...equipment, next_maintenance_date: equipment.next_maintenance_date ? new Date(equipment.next_maintenance_date) : undefined } : { name: "", type: "", serial_number: "" });
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => openDialog()}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Equipamento</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingEquipment ? "Editar" : "Adicionar"} Equipamento</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(d => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input {...form.register("name")} />{form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}</div>
            <div className="space-y-2"><Label>Tipo</Label><Input {...form.register("type")} placeholder="Ex: Autoclave a Vapor" /></div>
            <div className="space-y-2"><Label>Nº de Série</Label><Input {...form.register("serial_number")} /></div>
            <Controller name="next_maintenance_date" control={form.control} render={({ field }) => (
              <div className="space-y-2"><Label>Próxima Manutenção</Label><Popover>
                <PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button></PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
              </Popover></div>
            )} />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Próx. Manutenção</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {equipment.length > 0 ? equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.next_maintenance_date ? format(new Date(item.next_maintenance_date), "dd/MM/yyyy", { locale: ptBR }) : "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(item)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={4} className="h-24 text-center">Nenhum equipamento cadastrado.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EquipmentList;