import { useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Copy, Save, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const webhookUrl = "https://hbokiayvlbywxuwsgzlj.supabase.co/functions/v1/kiwify-webhook";

const secretSchema = z.object({
  secret: z.string().min(10, { message: "O segredo deve ter pelo menos 10 caracteres." }),
});

interface WebhookLog {
  id: string;
  created_at: string;
  email: string;
  evento: string;
  details: string;
}

const fetchWebhookLogs = async () => {
  const { data, error } = await supabase.from("webhook_logs").select("*").order("created_at", { ascending: false }).limit(10);
  if (error) throw error;
  return data;
};

const fetchKiwifySecret = async () => {
  const { data, error } = await supabase.from("settings").select("value").eq("key", "kiwify_secret").single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found, which is fine
  return data?.value || "";
};

const KiwifyAdmin = () => {
  const queryClient = useQueryClient();
  const { data: logs, isLoading: isLoadingLogs } = useQuery<WebhookLog[]>({ queryKey: ["webhook_logs"], queryFn: fetchWebhookLogs });
  const { data: currentSecret, isLoading: isLoadingSecret } = useQuery<string>({ queryKey: ["kiwify_secret"], queryFn: fetchKiwifySecret });

  const form = useForm<z.infer<typeof secretSchema>>({
    resolver: zodResolver(secretSchema),
    defaultValues: { secret: "" },
  });

  useEffect(() => {
    if (currentSecret) {
      form.setValue("secret", currentSecret);
    }
  }, [currentSecret, form]);

  const { mutate: saveSecret, isPending: isSaving } = useMutation({
    mutationFn: async (values: z.infer<typeof secretSchema>) => {
      const { error } = await supabase.from("settings").upsert({ key: "kiwify_secret", value: values.secret });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Segredo do webhook salvo com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["kiwify_secret"] });
    },
    onError: (error) => {
      toast.error("Erro ao salvar o segredo", { description: error.message });
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
          <CardDescription>Siga os passos abaixo para configurar a integração.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Passo 1: Copie a URL do Webhook</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={webhookUrl} />
              <Button variant="outline" size="icon" onClick={() => handleCopy(webhookUrl)}><Copy className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cole esta URL no campo "URL de Webhook" na sua conta Kiwify.</p>
          </div>
          <div>
            <Label>Passo 2: Salve o Segredo do Webhook</Label>
            <p className="text-xs text-muted-foreground mb-2">Gere um "Segredo de Webhook" na Kiwify, cole-o abaixo e salve.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => saveSecret(d))} className="flex items-start gap-2">
                <FormField control={form.control} name="secret" render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl><Input type="password" placeholder="Cole o segredo gerado na Kiwify aqui..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isSaving || isLoadingSecret}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Salvar
                </Button>
              </form>
            </Form>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Passo 3 (Importante):</strong> Após salvar o segredo acima, você <strong>DEVE</strong> adicioná-lo como um "Secret" nas configurações da sua Edge Function no painel da Supabase. O nome do segredo deve ser <strong>KIWIFY_WEBHOOK_SECRET</strong> e o valor deve ser o mesmo que você salvou.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Últimos Eventos Recebidos (Logs)</CardTitle>
          <CardDescription>Os 10 eventos mais recentes processados pelo webhook. Use isso para verificar se a integração está funcionando.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Evento Recebido</TableHead>
                <TableHead>Detalhes</TableHead>
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