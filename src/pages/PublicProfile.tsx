import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, FileQuestion, Percent, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  bio: string;
}

interface Simulation {
  id: string;
  created_at: string;
  percentage: number;
  score: number;
  total_questions: number;
  time_taken_seconds: number;
}

interface Question {
  id: number;
  category: string;
}

interface CategoryStat {
  name: string;
  accuracy: number;
  total: number;
}

const getBarColor = (accuracy: number) => {
  if (accuracy >= 70) {
    return "#22c55e"; // green-500
  }
  if (accuracy >= 40) {
    return "#eab308"; // yellow-500
  }
  return "#ef4444"; // red-500
};

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const profilePromise = supabase.from("profiles").select("*").eq("id", userId).single();
        const simulationsPromise = supabase.from("user_simulations").select('*').eq('user_id', userId).order('created_at', { ascending: false });
        const answersPromise = supabase.from("user_question_answers").select('question_id, is_correct').eq('user_id', userId);
        const questionsPromise = fetch("/questions.json").then(res => res.json());

        const [
          { data: profileData, error: profileError },
          { data: simulationsData, error: simulationsError },
          { data: answersData, error: answersError },
          questionsData,
        ] = await Promise.all([profilePromise, simulationsPromise, answersPromise, questionsPromise]);

        if (profileError) throw profileError;
        setProfile(profileData);

        if (simulationsError) throw simulationsError;
        setSimulations(simulationsData || []);

        if (answersError) throw answersError;
        
        if (answersData && questionsData) {
          setTotalQuestions(answersData.length);
          setCorrectQuestions(answersData.filter(a => a.is_correct).length);

          const performanceByCategory: { [key: string]: { total: number; correct: number } } = {};
          
          for (const answer of answersData) {
            const question = questionsData.find((q: Question) => q.id === answer.question_id);
            if (question) {
              const category = question.category;
              if (!performanceByCategory[category]) {
                performanceByCategory[category] = { total: 0, correct: 0 };
              }
              performanceByCategory[category].total++;
              if (answer.is_correct) {
                performanceByCategory[category].correct++;
              }
            }
          }

          const statsArray = Object.keys(performanceByCategory).map(category => ({
            name: category,
            accuracy: Math.round((performanceByCategory[category].correct / performanceByCategory[category].total) * 100),
            total: performanceByCategory[category].total,
          })).sort((a, b) => b.accuracy - a.accuracy);
          
          setCategoryStats(statsArray);
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

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

  const questionAccuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

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
          <CardTitle>Resumo do Desempenho</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="bg-muted/50 p-4 rounded-lg">
            <FileQuestion className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalQuestions}</p>
            <p className="text-sm text-muted-foreground">Questões Resolvidas</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <Percent className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{questionAccuracy}%</p>
            <p className="text-sm text-muted-foreground">Acerto Geral</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg col-span-2 md:col-span-1">
            <Timer className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{simulations.length}</p>
            <p className="text-sm text-muted-foreground">Simulados Realizados</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Categoria</CardTitle>
          <CardDescription>Seu percentual de acerto nas questões de cada área.</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryStats.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="accuracy" background={{ fill: 'hsl(var(--muted))' }}>
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.accuracy)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum dado de desempenho por categoria disponível.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Simulados</CardTitle>
          <CardDescription>Todos os seus simulados realizados.</CardDescription>
        </CardHeader>
        <CardContent>
          {simulations.length > 0 ? (
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead className="text-right">Aproveitamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulations.map((sim) => (
                    <TableRow key={sim.id}>
                      <TableCell>{format(new Date(sim.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                      <TableCell>{sim.score}/{sim.total_questions}</TableCell>
                      <TableCell>{formatTime(sim.time_taken_seconds)}</TableCell>
                      <TableCell className="text-right font-semibold">{sim.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum simulado realizado ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfile;