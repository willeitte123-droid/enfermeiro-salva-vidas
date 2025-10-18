import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "@supabase/supabase-js";

const fetchAllUsers = async () => {
  const { data, error } = await supabase.functions.invoke('get-users');
  
  if (error) {
    // Tenta extrair uma mensagem de erro mais amigável do corpo da resposta
    if (error instanceof Error && 'context' in error) {
      const context = error.context as any;
      if (context?.json?.error) {
        throw new Error(context.json.error);
      }
    }
    throw error;
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.users as User[];
};

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
    retry: false, // Não tenta novamente em caso de erro de permissão
  });

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      (user.email || '').toLowerCase().includes(lowercasedSearchTerm) ||
      (user.id || '').toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [users, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Painel de Administração</h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro de Acesso</AlertTitle>
          <AlertDescription>
            {(error as Error).message || "Ocorreu um erro ao buscar os usuários. Verifique se você tem permissão de administrador."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Painel de Administração</h1>
        <p className="text-muted-foreground">Gerenciamento de usuários da plataforma.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Usuários ({filteredUsers.length})</CardTitle>
            <CardDescription>Lista de todos os usuários registrados no sistema.</CardDescription>
          </div>
          <div className="relative w-full sm:w-auto max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email ou ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>ID do Usuário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Último Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{user.id}</TableCell>
                      <TableCell>
                        <Badge variant={user.email_confirmed_at ? "default" : "outline"}>
                          {user.email_confirmed_at ? "Confirmado" : "Aguardando"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.created_at ? format(new Date(user.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                      </TableCell>
                      <TableCell>
                        {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "Nunca"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Nenhum usuário encontrado.</TableCell>
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