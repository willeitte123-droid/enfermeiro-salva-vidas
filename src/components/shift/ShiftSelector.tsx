import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, PlusCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export interface Shift {
  id: string;
  user_id: string;
  title: string;
  shift_date: string;
  period: string;
  handover_report?: string;
}

interface ShiftSelectorProps {
  userId: string;
  selectedShift: Shift | null;
  onShiftSelect: (shift: Shift | null) => void;
}

const fetchShifts = async (userId: string) => {
  const { data, error } = await supabase
    .from("shifts")
    .select("*")
    .eq("user_id", userId)
    .order("shift_date", { ascending: false })
    .limit(10);
  if (error) throw error;
  return data as Shift[];
};

export const ShiftSelector = ({ userId, selectedShift, onShiftSelect }: ShiftSelectorProps) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newShiftTitle, setNewShiftTitle] = useState("");
  const [newShiftPeriod, setNewShiftPeriod] = useState("Matutino");

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ["shifts", userId],
    queryFn: () => fetchShifts(userId),
  });

  const createShiftMutation = useMutation({
    mutationFn: async (newShift: { title: string; period: string }) => {
      const { data, error } = await supabase
        .from("shifts")
        .insert({ ...newShift, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data as Shift;
    },
    onSuccess: (data) => {
      toast.success("Plantão criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["shifts", userId] });
      onShiftSelect(data);
      setIsDialogOpen(false);
      setNewShiftTitle("");
    },
    onError: (error) => {
      toast.error("Erro ao criar plantão", { description: error.message });
    },
  });

  const handleCreateShift = () => {
    if (!newShiftTitle) {
      toast.error("O título do plantão é obrigatório.");
      return;
    }
    createShiftMutation.mutate({ title: newShiftTitle, period: newShiftPeriod });
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar Novo Plantão</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="shift-title">Título do Plantão</Label><Input id="shift-title" placeholder="Ex: Plantão Unidade A" value={newShiftTitle} onChange={(e) => setNewShiftTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="shift-period">Período</Label><Select value={newShiftPeriod} onValueChange={setNewShiftPeriod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Matutino">Matutino</SelectItem><SelectItem value="Vespertino">Vespertino</SelectItem><SelectItem value="Noturno">Noturno</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button><Button onClick={handleCreateShift} disabled={createShiftMutation.isPending}>{createShiftMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto min-w-[250px] justify-between">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : selectedShift ? `${selectedShift.title} - ${format(new Date(selectedShift.shift_date), "dd/MM/yy", { locale: ptBR })}` : "Selecione um Plantão"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>Plantões Recentes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {shifts.map((shift) => (
            <DropdownMenuItem key={shift.id} onClick={() => onShiftSelect(shift)}>
              {shift.title} ({shift.period} - {format(new Date(shift.shift_date), "dd/MM/yy", { locale: ptBR })})
            </DropdownMenuItem>
          ))}
          {shifts.length === 0 && <DropdownMenuItem disabled>Nenhum plantão recente</DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Novo Plantão
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};