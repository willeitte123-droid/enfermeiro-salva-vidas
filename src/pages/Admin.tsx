import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Search, AlertTriangle, Edit, Save, Copy, Webhook, Info, LayoutDashboard, MapPin, Globe, Shield, Calendar, Mail, CheckCircle2, XCircle, Menu } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminDashboard from "./admin/AdminDashboard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
  plan_start_date: string | null;
  last_ip: string | null;
  location: string | null;
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
      <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-xl">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <div className="flex items-center gap-3 mt-4 p-3 bg-muted/50 rounded-lg">
            <Avatar>
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>{user.first_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm overflow-hidden">
              <p className="font-medium text-foreground truncate">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(d => mutation.mutate(d))} className="space-y-4 py-2">
          <Controller name="role" control={form.control} render={({ field }) => (
            <div className="space-y-2"><Label>Função no Sistema</Label><Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="user">Usuário Comum</SelectItem><SelectItem value="admin">Administrador</SelectItem></SelectContent>
            </Select></div>
          )} />
          <Controller name="status" control={form.control} render={({ field }) => (
            <div className="space-y-2"><Label>Status da Conta</Label><Select onValueChange={field.onChange} value={field.value}>
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
            <div className="space-y-2"><Label>Plano de Acesso</Label><Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Gratuito (Free)</SelectItem>
                <SelectItem value="Plano Essencial">Essencial</SelectItem>
                <SelectItem value="Plano Premium anual">Premium Anual</SelectItem>
                <SelectItem value="Plano Pro anual">Pro Anual</SelectItem>
              </SelectContent>
            </Select></div>
          )} />
          <DialogFooter className="pt-4 flex-col sm:flex-row gap-2">
            <DialogClose asChild><Button type="button" variant="outline" className="w-full sm:w-auto">Cancelar</Button></DialogClose>
            <Button type="submit" disabled={mutation.isPending} className="bg-primary w-full sm:w-auto">{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar Alterações</Button>
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
    return users.filter(user => 
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.last_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleRefresh = () => {
    refetch();
    toast.success("Lista de usuários atualizada");
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Erro de Acesso</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Base de Usuários</h2>
            <p className="text-sm text-muted-foreground">Gerencie acessos, planos e status.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} title="Atualizar Lista" className="shadow-sm bg-background w-full sm:w-auto">
            <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
        </div>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou email..." 
            className="pl-9 bg-background border-border/60 shadow-sm w-full h-11"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[250px]">Usuário</TableHead>
                  <TableHead>Plano & Status</TableHead>
                  <TableHead>Acesso</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Gerenciar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border shrink-0">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{user.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-foreground truncate max-w-[150px]">{user.first_name} {user.last_name}</span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[140px]">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1.5">
                        <Badge variant="outline" className="font-normal bg-background/50 capitalize truncate max-w-[120px]">
                            {user.plan}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <span className={cn("w-2 h-2 rounded-full", user.status === 'active' ? "bg-green-500" : user.status === 'suspended' ? "bg-red-500" : "bg-yellow-500")} />
                          <span className="text-xs text-muted-foreground capitalize">{user.status}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5" title="Data de Início">
                            <Calendar className="h-3 w-3 shrink-0" />
                            {user.plan_start_date ? format(new Date(user.plan_start_date), "dd/MM/yy", { locale: ptBR }) : "-"}
                        </div>
                        {user.access_expires_at && (
                            <div className="flex items-center gap-1.5 text-orange-600/80 dark:text-orange-400" title="Vencimento">
                              <Info className="h-3 w-3 shrink-0" />
                              {format(new Date(user.access_expires_at), "dd/MM/yy", { locale: ptBR })}
                            </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        {user.location ? (
                          <div className="flex items-center gap-1.5 mb-1"><MapPin className="h-3 w-3 shrink-0" /><span className="truncate max-w-[120px]">{user.location}</span></div>
                        ) : <span className="text-muted-foreground italic pl-4">-</span>}
                        {user.last_ip ? (
                          <div className="flex items-center gap-1.5"><Globe className="h-3 w-3 shrink-0" />{user.last_ip}</div>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)} className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">Nenhum usuário encontrado.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <EditUserDialog user={editingUser} open={!!editingUser} onOpenChange={() => setEditingUser(null)} />
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
    <Card className="mt-6 border-none shadow-sm bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-4 sm:px-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold">Log de Eventos (Kiwify)</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Histórico recente de webhooks.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 text-xs"><Loader2 className="h-3 w-3 mr-2" /> Atualizar</Button>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-24"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="border rounded-md overflow-hidden bg-background">
            <ScrollArea className="h-[300px]">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-[120px]">Data</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Mensagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length > 0 ? logs.map(log => (
                      <TableRow key={log.id} className="text-xs">
                        <TableCell className="font-mono text-muted-foreground whitespace-nowrap">
                          {format(new Date(log.created_at), "dd/MM HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate" title={log.email}>{log.email}</TableCell>
                        <TableCell><Badge variant="secondary" className="font-normal text-[10px] whitespace-nowrap">{log.evento}</Badge></TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-[250px]" title={log.details}>{log.details}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center">Nenhum log encontrado.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
    toast.success("Copiado!");
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-l-4 border-l-green-500 shadow-md">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400 text-lg">
            <Webhook className="h-5 w-5" /> Configuração do Webhook
          </CardTitle>
          <CardDescription>Integre sua conta Kiwify para automação de assinaturas.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6 pt-0">
          <div className="grid gap-2">
            <Label>Endpoint URL</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={webhookUrl} className="font-mono text-xs bg-muted truncate" />
              <Button variant="outline" size="icon" onClick={() => handleCopy(webhookUrl)} className="shrink-0"><Copy className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground">Cole esta URL nas configurações de Webhook do seu produto na Kiwify.</p>
          </div>
          
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              Configure o segredo <strong>KIWIFY_WEBHOOK_SECRET</strong> nas variáveis de ambiente da Edge Function para segurança.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <KiwifyWebhookLogs />
    </div>
  );
};

const Admin = () => (
  <div className="space-y-6 sm:space-y-8 pb-10">
    {/* Header Imersivo do Admin */}
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-6 sm:p-12 text-white shadow-2xl">
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-indigo-200">
              <Shield className="h-3 w-3" /> Acesso Restrito
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">Painel de Controle</h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-lg leading-relaxed">
              Visão geral do sistema e gestão de usuários.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Status do Sistema</p>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-400">Operacional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/10 rounded-full blur-3xl" />
    </div>

    {/* Navegação */}
    <Tabs defaultValue="dashboard" className="w-full space-y-6">
      <div className="flex justify-center w-full">
        <TabsList className="bg-muted/50 p-1 rounded-full h-11 w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="dashboard" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
             Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
             Usuários
          </TabsTrigger>
          <TabsTrigger value="kiwify" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
             Integrações
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TabsContent value="dashboard" className="mt-0"><AdminDashboard /></TabsContent>
        <TabsContent value="users" className="mt-0"><UserManagement /></TabsContent>
        <TabsContent value="kiwify" className="mt-0"><KiwifySettings /></TabsContent>
      </div>
    </Tabs>
  </div>
);

export default Admin;