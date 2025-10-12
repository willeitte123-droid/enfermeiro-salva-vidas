import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, FileQuestion, Timer, Percent, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  bio: string;
}

interface Simulation {
  created_at: string;
  percentage: number;
}

interface Stats {
  totalQuestions: number;
  correctQuestions: number;
  totalSimulations: number;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      setLoading(true);

      const profilePromise = supabase.from("profiles").select("*").eq("id", userId).single();
      const totalQuestionsPromise = supabase.from("user_question_answers").select('*', { count: 'exact', head: true }).eq('user_id', userId);
      const correctQuestionsPromise = supabase.from("user_question_answers").select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_correct', true);
      const simulationsPromise = supabase.from("user_simulations").select('created_at, percentage').eq('user_id', userId).order('created_at', { ascending: false }).limit(10);

      const [
        { data: profileData, error: profileError },
        { count: totalQuestions, error: totalQuestionsError },
        { count: correctQuestions, error: correctQuestionsError },
        { data: simulationsData, error: simulationsError },
      ] = await Promise.all([profilePromise, totalQuestionsPromise, correctQuestionsPromise, simulationsPromise]);

      if (profileError) console.error("Error fetching profile:", profileError);
      else setProfile(profileData);

      if (totalQuestionsError || correctQuestionsError || simulationsError) {
        console.error("Error fetching stats:", { totalQuestionsError, correctQuestionsError, simulationsError });
      } else {
        setStats({
          totalQuestions: totalQuestions || 0,
          correctQuestions: correctQuestions || 0,
          totalSimulations: simulationsData?.length || 0, // This is based on the limited query, for a full count another query would be needed
        });
        setSimulations(simulationsData || []);
      }

      setLoading(false);
    };

    fetchProfileData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Usuário não encontrado</h2>
        <p className="text-muted-foreground">O perfil que você está procurando não existe ou não pôde ser carregado.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  const getInitials = () => {
    const firstName = profile?.first_name?.[0] || '';
    const lastName = profile?.last_name?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  const questionAccuracy = stats && stats.totalQuestions > 0 ? Math.round((stats.correctQuestions / stats.totalQuestions) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to={-1 as any}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
        </Button>
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
            <AvatarImage src={profile.avatar_url} alt={`Avatar de ${profile.first_name}`} className="object-cover" />
            <AvatarFallback className="text-4xl bg-primary/10">{getInitials()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">{`${profile.first_name} ${profile.last_name}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-2">Biografia</h3>
            <p className="text-muted-foreground italic">
              {profile.bio || "Nenhuma biografia adicionada ainda."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Desempenho</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="bg-muted/50 p-4 rounded-lg">
            <FileQuestion className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.totalQuestions || 0}</p>
            <p className="text-sm text-muted-foreground">Questões Resolvidas</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <Percent className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{questionAccuracy}%</p>
            <p className="text-sm text-muted-foreground">Acerto (Questões)</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg col-span-2 md:col-span-1">
            <Timer className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.totalSimulations || 0}</p>
            <p className="text-sm text-muted-foreground">Simulados Realizados</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Simulados Recentes</CardTitle>
          <CardDescription>Últimos 10 simulados realizados.</CardDescription>
        </CardHeader>
        <CardContent>
          {simulations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Aproveitamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simulations.map((sim, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(sim.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell className="text-right font-semibold">{sim.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum simulado realizado ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfile;