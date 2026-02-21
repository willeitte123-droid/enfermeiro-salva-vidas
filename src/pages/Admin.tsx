import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, AlertTriangle, Edit, Webhook, MapPin, Globe, Shield, Calendar, Mail, Video, Wrench, BarChart3, Info, Crown, Users, UserCheck, Clock, Zap, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, differenceInDays } from 'date-fns';
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
import VideoManager from "./admin/VideoManager";
import QuestionsDashboard from "./admin/QuestionsDashboard";
import AccessReport from "./admin/AccessReport";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AppUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  status: string;
  plan: string;
  avatar_url: string | null;
  email: string | null;
  access_expires_at: string | null;
  plan_start_date: string | null;
  last_ip: string | null;
  location: string | null;
}

const editUserSchema = z.object({
  role: z.string(),
  status: z.string(),
  plan: z.string(),
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
    defaultValues: {
      role: 'user',
      status: 'pending',
      plan: 'free'
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        role: user.role || 'user',
        status: user.status || 'pending',
        plan: user.plan || 'free',
      });
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof editUserSchema>) => {
      if (!user) throw new Error("Usuário não selecionado.");
      
      const { data, error } = await supabase.rpc('admin_update_profile', {
        target_user_id: user.id,
        new_role: values.role,
        new_status: values.status,
        new_plan: values.plan
      });

      if (error) throw new Error(error.message);
      
      return data;
    },
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar", { description: error.message });
    },
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-xl">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <div className="flex items-center gap-3 mt-4 p-3 bg-muted/50 rounded-lg border">
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>{user.first_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm overflow-hidden">
              <p className="font-bold text-foreground truncate text-base">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><Mail className="w-3 h-3"/> {user.email}</p>
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
  const [isFixing, setIsFixing] = useState(false);
  const { data: users = [], isLoading, error, refetch } = useQuery<AppUser[]>({ queryKey: ["allUsers"], queryFn: fetchAllUsers });

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user => 
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.last_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Estatísticas Rápidas
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const premium = users.filter(u => u.plan?.toLowerCase().includes('premium')).length;
    const essencial = users.filter(u => u.plan?.toLowerCase().includes('essencial') && u.status === 'active').length;
    return { total, active, premium, essencial };
  }, [users]);

  const handleRefresh = () => {
    refetch();
    toast.success("Lista de usuários atualizada");
  };

  const handleFixPermissions = async () => {
    setIsFixing(true);
    const toastId = toast.loading("Aplicando correções no banco de dados...");
    
    try {
      const { data, error } = await supabase.functions.invoke('setup-database');
      
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      toast.success(data.message || "Permissões corrigidas!", { id: toastId });
      refetch();
    } catch (err: any) {
      toast.error("Falha ao corrigir: " + err.message, { id: toastId });
    } finally {
      setIsFixing(false);
    }
  };

  // Helper para Estilo do Plano
  const getPlanBadgeStyle = (planName: string | null) => {
    const plan = (planName || "").toLowerCase();
    
    // PREMIUM: Dourado/Laranja
    if (plan.includes('premium')) return "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border-amber-300 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-200 dark:border-amber-700 shadow-sm font-bold ring-1 ring-amber-500/20";
    
    // ESSENCIAL: Esmeralda/Verde
    if (plan.includes('essencial')) return "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-900 border-emerald-300 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-200 dark:border-emerald-700 shadow-sm font-bold ring-1 ring-emerald-500/20";
    
    // PRO: Azul/Indigo
    if (plan.includes('pro')) return "bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-900 border-blue-300 dark:from-blue-900/40 dark:to-indigo-800/40 dark:text-blue-200 dark:border-blue-700 shadow-sm font-bold ring-1 ring-blue-500/20";
    
    // FREE ou OUTROS
    return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  // Helper para Status com ícones
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': 
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3"/> Ativo</Badge>;
      case 'suspended': 
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 gap-1"><XCircle className="w-3 h-3"/> Suspenso</Badge>;
      case 'pending': 
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1"><AlertTriangle className="w-3 h-3"/> Pendente</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 capitalize">{status}</Badge>;
    }
  };

  // Helper para Exibição de Data com Alerta
  const ExpirationDate = ({ date }: { date: string | null }) => {
    if (!date) return <span className="text-muted-foreground italic text-[10px]">Indeterminado</span>;
    
    const parsedDate = new Date(date);
    const daysLeft = differenceInDays(parsedDate, new Date());
    
    const isExpiringSoon = daysLeft >= 0 && daysLeft <= 5;
    const isExpired = daysLeft < 0;

    return (
      <div className={cn(
        "flex items-center gap-1.5 text-xs px-2 py-1 rounded-md w-fit border transition-all",
        isExpiringSoon 
            ? "bg-red-50 text-red-600 border-red-200 font-bold animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)] dark:bg-red-900/30 dark:text-red-300 dark:border-red-800" 
            : isExpired 
                ? "bg-muted text-muted-foreground border-transparent line-through opacity-70" 
                : "bg-background border-border text-muted-foreground"
      )} title={isExpiringSoon ? `Vence em ${daysLeft} dias!` : "Vencimento do Acesso"}>
        <Clock className={cn("h-3 w-3", isExpiringSoon ? "text-red-600 dark:text-red-400" : "text-muted-foreground")} />
        {format(parsedDate, "dd/MM/yyyy", { locale: ptBR })}
      </div>
    );
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Erro de Acesso</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      
      {/* 1. KPIs Imersivos (Atualizado) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card: Assinantes Essencial */}
        <Card className="bg-gradient-to-br from-blue-600 to-cyan-700 text-white border-none shadow-lg p-5 flex items-center justify-between relative overflow-hidden group">
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="relative z-10">
              <p className="text-blue-100 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1">Assinantes Essencial</p>
              <h3 className="text-3xl font-black tracking-tight">{stats.essencial}</h3>
           </div>
           <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10"><Zap className="h-6 w-6 text-blue-100" /></div>
        </Card>

        {/* Card: Total Ativos */}
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-lg p-5 flex items-center justify-between relative overflow-hidden group">
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="relative z-10">
              <p className="text-emerald-100 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1">Total Ativos</p>
              <h3 className="text-3xl font-black tracking-tight">{stats.active}</h3>
           </div>
           <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10"><UserCheck className="h-6 w-6 text-emerald-100" /></div>
        </Card>

        {/* Card: Premium (Dourado) */}
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-lg p-5 flex items-center justify-between relative overflow-hidden group">
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="relative z-10">
              <p className="text-amber-100 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1">Assinantes Premium</p>
              <h3 className="text-3xl font-black tracking-tight">{stats.premium}</h3>
           </div>
           <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10"><Crown className="h-6 w-6 text-amber-100" /></div>
        </Card>

      </div>

      {/* 2. Barra de Ferramentas */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Buscar por nome, email ou ID..." 
            className="pl-9 bg-muted/30 border-border/60 shadow-sm focus:bg-background transition-all"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
             <Button 
               variant="outline" 
               size="sm" 
               onClick={handleFixPermissions} 
               disabled={isFixing}
               className="flex-1 sm:flex-none border-dashed"
             >
                {isFixing ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Wrench className="h-3.5 w-3.5 mr-2 text-muted-foreground" />} 
                Reparar
             </Button>
             <Button size="sm" onClick={handleRefresh} className="flex-1 sm:flex-none bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-all">
                <Loader2 className={`h-3.5 w-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
             </Button>
        </div>
      </div>

      {/* 3. Tabela de Usuários */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px] pl-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Usuário</TableHead>
                  <TableHead className="w-[200px] text-xs font-bold uppercase tracking-wider text-muted-foreground">Plano & Status</TableHead>
                  <TableHead className="w-[180px] text-xs font-bold uppercase tracking-wider text-muted-foreground">Vigência</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Localização</TableHead>
                  <TableHead className="text-right pr-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors group border-b border-border/40">
                    <TableCell className="pl-6 py-3">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 border-2 border-background shadow-sm group-hover:border-primary/20 transition-all group-hover:scale-105">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-sm">{user.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground truncate max-w-[180px]">{user.first_name} {user.last_name}</span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 shrink-0 opacity-70" />
                            <span className="truncate max-w-[140px] font-medium opacity-80">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col items-start gap-2">
                        <Badge variant="outline" className={cn("rounded-md px-2.5 py-0.5 border font-medium w-fit transition-all", getPlanBadgeStyle(user.plan))}>
                            {user.plan || "Free"}
                        </Badge>
                        <div className="flex items-center gap-1.5 px-1">
                          <span className={cn("w-2 h-2 rounded-full ring-2 ring-transparent", 
                              user.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : 
                              user.status === 'suspended' ? "bg-red-500" : "bg-yellow-500"
                          )} />
                          <span className="text-xs font-medium text-muted-foreground capitalize">{user.status}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground" title="Data de Início">
                            <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                            <span>Início: {user.plan_start_date ? format(new Date(user.plan_start_date), "dd/MM/yy", { locale: ptBR }) : "-"}</span>
                        </div>
                        {/* Componente de Data de Vencimento com Alerta */}
                        <ExpirationDate date={user.access_expires_at} />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground gap-1">
                        {user.location ? (
                          <div className="flex items-center gap-1.5 mb-1 text-foreground/80"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" /><span className="truncate max-w-[120px] font-medium">{user.location}</span></div>
                        ) : <span className="text-muted-foreground italic pl-5 text-[10px]">Não rastreado</span>}
                        {user.last_ip ? (
                          <div className="flex items-center gap-1.5 opacity-60"><Globe className="h-3 w-3 shrink-0" /> <span className="font-mono text-[10px]">{user.last_ip}</span></div>
                        ) : null}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)} className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary rounded-full transition-all group-hover:shadow-sm border border-transparent hover:border-primary/20">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={5} className="h-48 text-center text-muted-foreground flex flex-col items-center justify-center gap-2"><Search className="h-8 w-8 opacity-20"/> Nenhum usuário encontrado.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <EditUserDialog user={editingUser} open={!!editingUser} onOpenChange={() => setEditingUser(null)} />
    </div>
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
              <Button variant="outline" size="icon" onClick={() => handleCopy(webhookUrl)} className="shrink-0"><Loader2 className="h-4 w-4" /></Button>
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
      <div className="w-full overflow-x-auto pb-1">
        <TabsList className="bg-muted/50 p-1 rounded-full h-11 w-full min-w-[700px] grid grid-cols-6">
          <TabsTrigger value="dashboard" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
             Dashboard
          </TabsTrigger>
          <TabsTrigger value="access" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2">
             <BarChart3 className="w-3 h-3"/> Acessos
          </TabsTrigger>
          <TabsTrigger value="questions" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
             Questões
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
             Usuários
          </TabsTrigger>
          <TabsTrigger value="videos" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
             Vídeos
          </TabsTrigger>
          <TabsTrigger value="kiwify" className="rounded-full text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
             Integrações
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TabsContent value="dashboard" className="mt-0"><AdminDashboard /></TabsContent>
        <TabsContent value="access" className="mt-0"><AccessReport /></TabsContent>
        <TabsContent value="questions" className="mt-0"><QuestionsDashboard /></TabsContent>
        <TabsContent value="users" className="mt-0"><UserManagement /></TabsContent>
        <TabsContent value="videos" className="mt-0"><VideoManager /></TabsContent>
        <TabsContent value="kiwify" className="mt-0"><KiwifySettings /></TabsContent>
      </div>
    </Tabs>
  </div>
);

export default Admin;