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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
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
    const { data, error } = await supabase.from("profiles").select("*").order("first_name", { ascending: true });
    if (error) {
      toast.error("Erro ao buscar usuários", { description: error.message });
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

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const filteredProfiles = useMemo(() => {
    return profiles
      .filter(profile => {
        if (statusFilter === "all") return true;
        return profile.status === statusFilter;
      })
      .filter(profile =>
        `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [profiles, searchTerm, statusFilter]);

  const totalUsers = profiles.length;
  const activeUsers = profiles.filter(p => p.status === 'active').length;
  const pendingUsers = profiles.filter(p => p.status === 'pending').length;

  const chartData = [
    { name: "Ativos", value: activeUsers },
    { name: "Pendentes", value: pendingUsers },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"];

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-900 text-gray-200 dark:bg-gray-950">
          <CardHeader>
            <CardTitle className="text-white">Gerenciamento de Usuários</CardTitle>
            <CardDescription className="text-gray-400">Aprove, desative ou gerencie os usuários da plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <TabsList className="grid w-full grid-cols-3 bg-black p-1 rounded-lg">
                  <TabsTrigger value="all" className="text-gray-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Todos</TabsTrigger>
                  <TabsTrigger value="pending" className="text-gray-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pendentes</TabsTrigger>
                  <TabsTrigger value="active" className="text-gray-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ativos</TabsTrigger>
                </TabsList>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por nome..."
                    className="pl-8 w-full sm:w-[250px] bg-gray-800 border-gray-700 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </Tabs>
            <div className="border border-gray-800 rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-gray-800/50">
                    <TableHead className="text-gray-400">Usuário</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray-400">Status</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-400">Função</TableHead>
                    <TableHead className="text-right text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile) => (
                      <TableRow key={profile.id} className="border-gray-800 hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={profile.avatar_url || undefined} />
                              <AvatarFallback>{getInitials(profile.first_name, profile.last_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">{`${profile.first_name} ${profile.last_name}`}</p>
                              <p className="text-xs text-gray-400 md:hidden">{profile.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            className={cn(
                              profile.status === "active"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            )}
                            variant="outline"
                          >
                            {profile.status === "active" ? "Ativo" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-400">{profile.role}</TableCell>
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
                    <TableRow className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell colSpan={4} className="h-24 text-center text-gray-400">Nenhum usuário encontrado.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
            <CardDescription>Proporção de usuários ativos e pendentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[250px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;