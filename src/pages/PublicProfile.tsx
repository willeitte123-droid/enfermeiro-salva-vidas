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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useQuery } from "@tanstack/react-query";

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

interface CategoryStat {
  name: string;
  accuracy: number;
  total: number;
}

const getBarColor = (accuracy: number) => {
  if (accuracy >= 70) return "#22c55e"; // green-500
  if (accuracy >= 40) return "#eab308"; // yellow-500
  return "#ef4444"; // red-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-lg shadow-lg">
        <p className="font-bold text-foreground">{label}</p>
        <p className="text-sm" style={{ color: payload[0].fill }}>
          Aproveitamento: {payload[0].value}%
        </p>
        <p className="text-sm text-muted-foreground">
          Questões respondidas: {payload[0].payload.total}
        </p>
      </div>
    );
  }
  return null;
};

const fetchPublicProfileData = async (userId: string) => {
  const profilePromise = supabase.from("profiles").select("*").eq("id", userId).single();
  const simulationsPromise = supabase.from("user_simulations").select('*').eq('user_id', userId).order('created_at', { ascending: false });
  const statsPromise = supabase.rpc('get_user_performance_stats', { p_user_id: userId });

  const [
    { data: profileData, error: profileError },
    { data: simulationsData, error: simulationsError },
    { data: statsData, error: statsError },
  ] = await Promise.all([profilePromise, simulationsPromise, statsPromise]);

  if (profileError) throw profileError;
  if (simulationsError) throw simulationsError;
  if (statsError) throw statsError;

  const { totalQuestions, correctQuestions, categoryStats } = statsData;

  const sortedCategoryStats = categoryStats.sort((a: CategoryStat, b: CategoryStat) => a.accuracy - b.accuracy);

  return {
    profile: profileData,
    simulations: simulationsData || [],
    categoryStats: sortedCategoryStats,
    totalQuestions,
    correctQuestions,
  };
};

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: () => fetchPublicProfileData(userId!),
    enabled: !!userId,
  });

  const { profile, simulations, categoryStats, totalQuestions, correctQuestions } = data || {};

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !profile) {
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

  const questionAccuracy = totalQuestions && totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

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
            <p className="text-2xl font-bold">{totalQuestions || 0}</p>
            <p className="text-sm text-muted-foreground">Questões Resolvidas</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <Percent className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{questionAccuracy}%</p>
            <p className="text-sm text-muted-foreground">Acerto Geral</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg col-span-2 md:col-span-1">
            <Timer className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{simulations?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Simulados Realizados</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Categoria</CardTitle>
          <CardDescription>Seu percentual de acerto, ordenado das maiores dificuldades para as maiores facilidades.</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryStats && categoryStats.length > 0 ? (
            <>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} unit="%" width={40} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                    <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="accuracy" position="top" formatter={(value: number) => `${value}%`} fontSize={12} className="fill-foreground" />
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.accuracy)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground mt-4">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-500" /><span>Abaixo de 40%</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-yellow-500" /><span>Entre 40% e 69%</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-green-500" /><span>Acima de 70%</span></div>
              </div>
            </>
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
          {simulations && simulations.length > 0 ? (
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