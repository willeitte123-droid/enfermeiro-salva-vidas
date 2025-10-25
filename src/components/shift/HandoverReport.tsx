import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "@/hooks/useDebounce";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import { Shift } from "./ShiftSelector";

interface HandoverReportProps {
  shift: Shift;
}

export const HandoverReport = ({ shift }: HandoverReportProps) => {
  const queryClient = useQueryClient();
  const [report, setReport] = useState(shift.handover_report || "");
  const debouncedReport = useDebounce(report, 1000); // Auto-save after 1 second of inactivity

  const updateReportMutation = useMutation({
    mutationFn: async (newReport: string) => {
      const { error } = await supabase
        .from("shifts")
        .update({ handover_report: newReport })
        .eq("id", shift.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts", shift.user_id] });
      toast.success("Relatório salvo!");
    },
    onError: (error) => {
      toast.error("Erro ao salvar relatório", { description: error.message });
    },
  });

  useEffect(() => {
    setReport(shift.handover_report || "");
  }, [shift]);

  useEffect(() => {
    if (debouncedReport !== shift.handover_report) {
      updateReportMutation.mutate(debouncedReport);
    }
  }, [debouncedReport, shift.handover_report, updateReportMutation]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText />Relatório de Passagem de Plantão</CardTitle>
        <CardDescription>
          Consolide as informações do turno. O salvamento é automático.
          {updateReportMutation.isPending && <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Descreva as principais ocorrências, pacientes que requerem atenção, pendências para o próximo turno, etc."
          className="min-h-[400px] text-base"
        />
      </CardContent>
    </Card>
  );
};