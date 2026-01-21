import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Search, AlertTriangle, Edit, Save, Copy, Webhook, Info, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AdminDashboard from "./admin/AdminDashboard";

interface AppUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  plan: 'free' | 'Plano Essencial' | 'Plano Premium anual' | 'Plano Pro anual';
  avatar_url: string | null;
  email: string | null;
  access_expires_at: string | null;
}

const editUserSchema = z.object({
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'pending', 'inactive', 'suspended']),
  plan: z.enum(['free', 'Plano Essencial', 'Plano Premium anual', 'Plano Pro anual']),
});

const fetchAllUsers = async (): Promise<AppUser[]> => {
  const { data, error } = await supabase.functions.invoke('get-users');
  if (error) throw new Error(error instanceof Error ? error.message : String(error));
  if (data.error) throw new Error(data.error);
  return data.users as AppUser[];
};

const EditUserDialog = ({ user, open, onOpenChange }: { user: AppUser | null; open: boolean; onOpenChange: (open: boolean) => void }) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        role: user.role,
        status: user.status,
        plan: user.plan,
      });
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof editUserSchema>) => {
      if (!user) throw new Error("Usuário não selecionado.");
      const { error } = await supabase.from('profiles').update(values).eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar usuário", { description: error.message });
    },
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <div className="text-sm text-muted-foreground">
            <p>{user.first_name} {user.last_name} ({user.email})</p>
            <p className="text-xs font-mono mt-1">ID: {user.id}</p>
          </div>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(d => mutation.mutate(d))} className="space-y-4">
          <Controller name="role" control={form.control} render={({ field }) => (
            <div className="space-y-2"><Label>Função</Label><Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="user">Usuário</SelectItem><SelectItem value="admin">Administrador</SelectItem></SelectContent>
            </Select></div>
          )} />
          <Controller name="status" control={form.control} render={({ field }) => (
            <div className="space-y-2"><Label>Status</Label><Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
              </SelectContent>
            </Select></div>
          )} />
          <Controller name="plan" control={form.control} render={({ field }) => (
            <div className="space-y-2"><Label>Plano</Label><Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="Plano Essencial">Plano Essencial</SelectItem>
                <SelectItem value="Plano Premium anual">Plano Premium anual</SelectItem>
                <SelectItem value="Plano Pro anual">Plano Pro anual</SelectItem>
              </SelectContent>
            </Select></div>
          )} />
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const { data: users = [], isLoading, error, refetch } = useQuery<AppUser[]>({ queryKey: ["allUsers"], queryFn: fetchAllUsers });

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user => (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  const getStatusVariant = (status: string) => {
    if (status === 'active') return 'default';
    if (status === 'pending') return 'secondary';
    if (status === 'suspended') return 'destructive';
    return 'destructive';
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Lista atualizada");
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Erro de Acesso</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Usuários ({filteredUsers.length})</CardTitle><CardDescription>Gerencie todos os usuários registrados.</CardDescription></div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por email..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <Button variant="outline" size="icon" onClick={handleRefresh} title="Atualizar Lista"><Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md"><Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Plano</TableHead><TableHead>Status</TableHead><TableHead>Função</TableHead><TableHead>Expira em</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{user.first_name} {user.last_name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-[10px] text-muted-foreground font-mono cursor-help truncate w-20">{user.id.substring(0, 8)}...</span>
                        </TooltipTrigger>
                        <TooltipContent><p>ID Completo: {user.id}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Badge variant="outline">{user.plan}</Badge></TableCell>
                <TableCell><Badge variant={getStatusVariant(user.status)}>{user.status}</Badge></TableCell>
                <TableCell><Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge></TableCell>
                <TableCell>{user.access_expires_at ? format(new Date(user.access_expires_at), "dd/MM/yy", { locale: ptBR }) : "-"}</TableCell>
                <TableCell><Button variant="outline" size="icon" onClick={() => setEditingUser(user)}><Edit className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={7} className="h-24 text-center">Nenhum usuário encontrado.</TableCell></TableRow>}
          </TableBody>
        </Table></div>
        <EditUserDialog user={editingUser} open={!!editingUser} onOpenChange={() => setEditingUser(null)} />
      </CardContent>
    </Card>
  );
};

const KiwifyWebhookLogs = () => {
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['webhookLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>3. Últimos Eventos Recebidos (Logs)</CardTitle><CardDescription>Os 20 eventos mais recentes recebidos do webhook da Kiwify.</CardDescription></div>
        <Button variant="ghost" size="icon" onClick={() => refetch()}><Loader2 className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-24"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="border rounded-md max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{log.email}</TableCell>
                    <TableCell><Badge variant="outline">{log.evento}</Badge></TableCell>
                    <TableCell className="text-sm font-mono">{log.details}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center">Nenhum log encontrado.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const KiwifySettings = () => {
  const webhookUrl = "https://hbokiayvlbywxuwsgzlj.supabase.co/functions/v1/kiwify-webhook";
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };
  return (
    <>
      <Card>
        <CardHeader><CardTitle>Configuração do Webhook Kiwify</CardTitle><CardDescription>Siga os passos para configurar a integração.</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div><Label>Passo 1: Copie a URL do Webhook</Label><div className="flex items-center gap-2"><Input readOnly value={webhookUrl} /><Button variant="outline" size="icon" onClick={() => handleCopy(webhookUrl)}><Copy className="h-4 w-4" /></Button></div><p className="text-xs text-muted-foreground mt-1">Cole esta URL no campo "URL de Webhook" na sua conta Kiwify.</p></div>
          <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription><strong>Passo 2 (Importante):</strong> Você <strong>DEVE</strong> adicionar o "Segredo do Webhook" da Kiwify como um "Secret" nas configurações da sua Edge Function no painel da Supabase. O nome do segredo deve ser <strong>KIWIFY_WEBHOOK_SECRET</strong>.</AlertDescription></Alert>
        </CardContent>
      </Card>
      <KiwifyWebhookLogs />
    </>
  );
};

const Admin = () => (
  <div className="space-y-6">
    <div className="text-center"><h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Painel de Administração</h1><p className="text-muted-foreground">Gerenciamento de usuários e integrações da plataforma.</p></div>
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</TabsTrigger>
        <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Gerenciar Usuários</TabsTrigger>
        <TabsTrigger value="kiwify"><Webhook className="mr-2 h-4 w-4" />Integração Kiwify</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="mt-4"><AdminDashboard /></TabsContent>
      <TabsContent value="users" className="mt-4"><UserManagement /></TabsContent>
      <TabsContent value="kiwify" className="mt-4"><KiwifySettings /></TabsContent>
    </Tabs>
  </div>
);

export default Admin;