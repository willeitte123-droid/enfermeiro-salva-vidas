import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const webhookUrl = "https://hbokiayvlbywxuwsgzlj.supabase.co/functions/v1/kiwify-webhook";
const webhookToken = "qvohpes8b0r";

const simulatorSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  evento: z.string().min(1, { message: "Selecione um evento." }),
  produto: z.string().min(1, { message: "Selecione um produto." }),
});

interface WebhookLog {
  id: string;
  created_at: string;
  email: string;
  evento: string;
  details: string;
}

const fetchWebhookLogs = async () => {
  const { data, error } = await supabase
    .from("webhook_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
};

const KiwifyAdmin = () => {
  const queryClient = useQueryClient();
  const { data: logs, isLoading: isLoadingLogs } = useQuery<WebhookLog[]>({
    queryKey: ["webhook_logs"],
    queryFn: fetchWebhookLogs,
  });

  const form = useForm<z.infer<typeof simulatorSchema>>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      email: "",
      evento: "assinatura aprovada",
      produto: "Plano PRO Mensal",
    },
  });

  const { mutate: simulateWebhook, isPending: isSimulating } = useMutation({
    mutationFn: async (values: z.infer<typeof simulatorSchema>) => {
      const { data, error } = await supabase.functions.invoke("kiwify-webhook", {
        body: { ...values, token: webhookToken },
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Webhook simulado com sucesso!", {
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["webhook_logs"] });
    },
    onError: (error) => {
      toast.error("Erro ao simular webhook", {
        description: error.message,
      });
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Integração Kiwify</h1>
        <p className="text-muted-foreground">Gerencie e teste o webhook de planos da Kiwify.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Configuração do Webhook</CardTitle>
          <CardDescription>Use esta URL e o Token para configurar o webhook na sua conta Kiwify.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>URL do Webhook (POST)</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={webhookUrl} />
              <Button variant="outline" size="icon" onClick={() => handleCopy(webhookUrl)}><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
          <div>
            <Label>Token Secreto</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={webhookToken} type="password" />
              <Button variant="outline" size="icon" onClick={() => handleCopy(webhookToken)}><Copy className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Este token deve ser enviado no corpo da requisição do webhook no campo "token".</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Simulador de Webhook</CardTitle>
          <CardDescription>Teste a lógica do webhook manualmente com dados de exemplo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((d) => simulateWebhook(d))} className="grid md:grid-cols-4 gap-4 items-end">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Email do usuário</FormLabel>
                  <FormControl><Input placeholder="cliente@exemplo.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="evento" render={({ field }) => (
                <FormItem>
                  <FormLabel>Evento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="assinatura aprovada">Assinatura Aprovada</SelectItem>
                      <SelectItem value="assinatura renovada">Assinatura Renovada</SelectItem>
                      <SelectItem value="assinatura cancelada">Assinatura Cancelada</SelectItem>
                      <SelectItem value="assinatura atrasada">Assinatura Atrasada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="produto" render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Plano PRO Mensal">Plano PRO Mensal</SelectItem>
                      <SelectItem value="Plano PRO Anual">Plano PRO Anual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isSimulating} className="md:col-span-4">
                {isSimulating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simular Webhook
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Últimos Eventos Recebidos (Logs)</CardTitle>
          <CardDescription>Os 10 eventos mais recentes processados pelo webhook.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Evento Recebido</TableHead>
                <TableHead>Detalhes (Plano Aplicado)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingLogs ? (
                <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
              ) : logs && logs.length > 0 ? (
                logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</TableCell>
                    <TableCell>{log.email}</TableCell>
                    <TableCell><Badge variant="outline">{log.evento}</Badge></TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-center">Nenhum log encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default KiwifyAdmin;