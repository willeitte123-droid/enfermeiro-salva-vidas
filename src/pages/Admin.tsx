import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserCheck, UserX, Loader2, Users, Hourglass, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  status: string;
  avatar_url: string | null;
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

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
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
        return fullName.includes(lowercasedSearchTerm) || email.includes(lowercasedSearchTerm);
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
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Painel de Administração</h1>
        <p className="text-muted-foreground">Gerenciamento de usuários e visão geral do sistema.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalUsers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeUsers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovações Pendentes</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{pendingUsers}</div></CardContent>
        </Card>
      </div>

      <Card className="bg-sidebar text-sidebar-foreground">
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription className="text-sidebar-foreground/80">Aprove, desative ou gerencie os usuários da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList className="grid w-full grid-cols-3 bg-sidebar-hover">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Todos</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pendentes</TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ativos</TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  className="pl-8 w-full sm:w-[250px] bg-sidebar-hover border-border/20 focus:bg-sidebar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Tabs>
          <div className="border rounded-md border-border/20">
            <Table>
              <TableHeader>
                <TableRow className="border-border/20 hover:bg-sidebar-hover/50">
                  <TableHead className="text-white">Usuário</TableHead>
                  <TableHead className="hidden sm:table-cell text-white">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-white">Função</TableHead>
                  <TableHead className="text-right text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => (
                    <TableRow key={profile.id} className="border-border/20 hover:bg-sidebar-hover/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={profile.avatar_url || undefined} className="object-cover" />
                            <AvatarFallback>{getInitials(profile.first_name, profile.last_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{`${profile.first_name || ''} ${profile.last_name || ''}`}</p>
                            <p className="text-xs text-sidebar-foreground/70">{profile.email || 'E-mail não disponível'}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{profile.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          className={cn(
                            profile.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          )}
                          variant="outline"
                        >
                          {profile.status === "active" ? "Ativo" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{profile.role}</TableCell>
                      <TableCell className="text-right">
                        {profile.status === "pending" ? (
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(profile.id, "active")}>
                            <UserCheck className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-2">Aprovar</span>
                          </Button>
                        ) : (
                          <Button variant="destructive" size="sm" onClick={() => handleStatusChange(profile.id, "pending")}>
                            <UserX className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-2">Desativar</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-border/20 hover:bg-sidebar-hover/50">
                    <TableCell colSpan={4} className="h-24 text-center">Nenhum usuário encontrado.</TableCell>
                  </TableRow>
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