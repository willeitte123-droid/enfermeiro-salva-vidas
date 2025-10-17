import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserCheck, UserX, Loader2, Users, Hourglass, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  status: string;
  plan: string;
  avatar_url: string | null;
  location: string | null;
  access_expires_at: string | null;
}

const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_all_user_details');
    if (error) {
      toast.error("Acesso Negado", { description: "Apenas administradores podem visualizar esta página." });
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "active" | "pending") => {
    const { error } = await supabase.from("profiles").update({ status: newStatus }).eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status", { description: error.message });
    } else {
      toast.success(`Usuário ${newStatus === "active" ? "aprovado" : "movido para pendente"} com sucesso!`);
      fetchProfiles();
    }
  };

  const filteredProfiles = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return profiles
      .filter(profile => {
        if (statusFilter === "all") return true;
        return profile.status === statusFilter;
      })
      .filter(profile => {
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase();
        const email = (profile.email || '').toLowerCase();
        const location = (profile.location || '').toLowerCase();
        return fullName.includes(lowercasedSearchTerm) || email.includes(lowercasedSearchTerm) || location.includes(lowercasedSearchTerm);
      });
  }, [profiles, searchTerm, statusFilter]);

  const totalUsers = profiles.length;
  const activeUsers = profiles.filter(p => p.status === 'active').length;
  const pendingUsers = profiles.filter(p => p.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Painel de Administração</h1>
        <p className="text-muted-foreground">Gerenciamento de usuários e visão geral do sistema.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Usuários</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalUsers}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle><UserCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{activeUsers}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Aprovações Pendentes</CardTitle><Hourglass className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{pendingUsers}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>Aprove, desative ou gerencie os usuários da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="all">Todos</TabsTrigger><TabsTrigger value="pending">Pendentes</TabsTrigger><TabsTrigger value="active">Ativos</TabsTrigger></TabsList>
              <div className="relative w-full sm:w-auto"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar..." className="pl-8 w-full sm:w-[250px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>
          </Tabs>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Último IP</TableHead>
                  <TableHead>Armazenamento</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.email}</TableCell>
                      <TableCell><Badge variant="secondary">{profile.plan}</Badge></TableCell>
                      <TableCell>
                        <Badge className={cn(profile.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800")} variant="outline">
                          {profile.status === "active" ? "Ativo" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>{profile.location || "-"}</TableCell>
                      <TableCell>{"-"}</TableCell>
                      <TableCell>{"-"}</TableCell>
                      <TableCell>{profile.access_expires_at ? format(new Date(profile.access_expires_at), "dd/MM/yyyy", { locale: ptBR }) : "-"}</TableCell>
                      <TableCell className="text-right">
                        {profile.status === "pending" ? (
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(profile.id, "active")}><UserCheck className="h-4 w-4 mr-2" />Aprovar</Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(profile.id, "pending")}><UserX className="h-4 w-4 mr-2" />Desativar</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={8} className="h-24 text-center">Nenhum usuário encontrado.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;