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
import { CalendarIcon, PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Profile { id: string; }
interface Equipment { id: string; name: string; }
interface Load { id: string; load_number: string; load_date: string; equipment_id: string; status: string; biological_indicator_result: string; chemical_indicator_result: string; cycle_type: string; sterilization_equipment: { name: string }; }

const loadSchema = z.object({
  load_number: z.string().min(1, "O nº da carga é obrigatório."),
  load_date: z.date({ required_error: "A data é obrigatória." }),
  equipment_id: z.string({ required_error: "Selecione um equipamento." }),
  cycle_type: z.string().optional(),
  status: z.enum(['in_progress', 'completed', 'failed']),
  biological_indicator_result: z.enum(['pending', 'approved', 'failed']),
  chemical_indicator_result: z.enum(['pending', 'approved', 'failed']),
});

const fetchLoads = async (userId: string) => {
  const { data, error } = await supabase.from("sterilization_loads").select("*, sterilization_equipment(name)").eq("user_id", userId).order("load_date", { ascending: false });
  if (error) throw error;
  return data;
};

const fetchEquipmentForSelect = async (userId: string) => {
  const { data, error } = await supabase.from("sterilization_equipment").select("id, name").eq("user_id", userId);
  if (error) throw error;
  return data;
};

const LoadList = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);

  const { data: loads = [], isLoading } = useQuery({ queryKey: ["loads", profile?.id], queryFn: () => fetchLoads(profile!.id), enabled: !!profile });
  const { data: equipment = [] } = useQuery({ queryKey: ["equipmentForSelect", profile?.id], queryFn: () => fetchEquipmentForSelect(profile!.id), enabled: !!profile });

  const form = useForm<z.infer<typeof loadSchema>>({
    resolver: zodResolver(loadSchema),
    defaultValues: { status: 'in_progress', biological_indicator_result: 'pending', chemical_indicator_result: 'pending' },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof loadSchema>) => {
      if (!profile) throw new Error("Usuário não autenticado.");
      const dataToUpsert = { ...values, user_id: profile.id, id: editingLoad?.id };
      const { error } = await supabase.from("sterilization_loads").upsert(dataToUpsert);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Carga ${editingLoad ? 'atualizada' : 'criada'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["loads", profile?.id] });
      setIsDialogOpen(false);
    },
    onError: (error) => toast.error("Erro ao salvar carga", { description: error.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sterilization_loads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Carga excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["loads", profile?.id] });
    },
    onError: (error) => toast.error("Erro ao excluir carga", { description: error.message }),
  });

  const openDialog = (load: Load | null = null) => {
    setEditingLoad(load);
    form.reset(load ? { ...load, load_date: new Date(load.load_date) } : { load_number: "", load_date: new Date(), status: 'in_progress', biological_indicator_result: 'pending', chemical_indicator_result: 'pending' });
    setIsDialogOpen(true);
  };

  const getStatusVariant = (status: string) => {
    if (status === 'completed' || status === 'approved') return 'default';
    if (status === 'in_progress' || status === 'pending') return 'secondary';
    return 'destructive';
  };

  if (isLoading) return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => openDialog()}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Carga</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{editingLoad ? "Editar" : "Adicionar"} Carga</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(d => mutation.mutate(d))} className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nº da Carga</Label><Input {...form.register("load_number")} />{form.formState.errors.load_number && <p className="text-sm text-destructive">{form.formState.errors.load_number.message}</p>}</div>
            <Controller name="load_date" control={form.control} render={({ field }) => (
              <div className="space-y-2"><Label>Data</Label><Popover>
                <PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button></PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
              </Popover>{form.formState.errors.load_date && <p className="text-sm text-destructive">{form.formState.errors.load_date.message}</p>}</div>
            )} />
            <Controller name="equipment_id" control={form.control} render={({ field }) => (
              <div className="space-y-2 col-span-2"><Label>Equipamento</Label><Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>{equipment.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>{form.formState.errors.equipment_id && <p className="text-sm text-destructive">{form.formState.errors.equipment_id.message}</p>}</div>
            )} />
            <div className="space-y-2"><Label>Tipo de Ciclo</Label><Input {...form.register("cycle_type")} placeholder="Ex: Instrumental" /></div>
            <Controller name="status" control={form.control} render={({ field }) => (
              <div className="space-y-2"><Label>Status da Carga</Label><Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="in_progress">Em Progresso</SelectItem><SelectItem value="completed">Concluída</SelectItem><SelectItem value="failed">Falhou</SelectItem></SelectContent>
              </Select></div>
            )} />
            <Controller name="biological_indicator_result" control={form.control} render={({ field }) => (
              <div className="space-y-2"><Label>Indicador Biológico</Label><Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="pending">Pendente</SelectItem><SelectItem value="approved">Aprovado</SelectItem><SelectItem value="failed">Reprovado</SelectItem></SelectContent>
              </Select></div>
            )} />
            <Controller name="chemical_indicator_result" control={form.control} render={({ field }) => (
              <div className="space-y-2"><Label>Indicador Químico</Label><Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="pending">Pendente</SelectItem><SelectItem value="approved">Aprovado</SelectItem><SelectItem value="failed">Reprovado</SelectItem></SelectContent>
              </Select></div>
            )} />
            <DialogFooter className="col-span-2">
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Carga Nº</TableHead><TableHead>Equipamento</TableHead><TableHead>Status</TableHead><TableHead>Biológico</TableHead><TableHead>Químico</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {loads.length > 0 ? loads.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{format(new Date(item.load_date), "dd/MM/yy", { locale: ptBR })}</TableCell>
                <TableCell className="font-medium">{item.load_number}</TableCell>
                <TableCell>{item.sterilization_equipment?.name}</TableCell>
                <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                <TableCell><Badge variant={getStatusVariant(item.biological_indicator_result)}>{item.biological_indicator_result}</Badge></TableCell>
                <TableCell><Badge variant={getStatusVariant(item.chemical_indicator_result)}>{item.chemical_indicator_result}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(item)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={7} className="h-24 text-center">Nenhuma carga registrada.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LoadList;