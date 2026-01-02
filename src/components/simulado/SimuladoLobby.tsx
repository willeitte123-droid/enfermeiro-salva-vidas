import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Timer, FileText, Info, PlayCircle, Building2, 
  BookOpen, Trophy, Target, Zap, CheckCircle2, Loader2
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface SimuladoLobbyProps {
  onStart: (config: { numQuestions: number; totalTime: number; banca: string; category?: string }) => void;
}

// Categorias fixas para manter a ordem didática, mas poderíamos buscar do banco também se preferir
const CATEGORIES = [
  "Todas",
  "Legislação do SUS",
  "Fundamentos de Enfermagem",
  "Saúde Pública",
  "Urgência e Emergência",
  "Saúde da Mulher",
  "Saúde da Criança",
  "Saúde do Idoso",
  "Saúde Mental",
  "Centro Cirúrgico",
  "Ética e Legislação"
];

const SimuladoLobby = ({ onStart }: SimuladoLobbyProps) => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialCount = searchParams.get("count");

  const [numQuestions, setNumQuestions] = useState("20");
  const [totalTime, setTotalTime] = useState("40");
  const [selectedBanca, setSelectedBanca] = useState("Todas");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Buscar Bancas Dinamicamente
  const { data: availableBancas = ["Todas"], isLoading: isLoadingBancas } = useQuery({
    queryKey: ['availableBancas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('banca')
        .not('banca', 'is', null);

      if (error) {
        console.error('Erro ao buscar bancas:', error);
        return ["Todas"];
      }

      // Filtra valores vazios e cria um Set para remover duplicatas
      const uniqueBancas = Array.from(new Set(
        data
          .map(item => item.banca)
          .filter(b => b && b.trim() !== '')
      ));

      return ["Todas", ...uniqueBancas.sort()];
    },
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });

  useEffect(() => {
    if (initialCategory && CATEGORIES.includes(initialCategory)) {
      setSelectedCategory(initialCategory);
    }
    if (initialCount) {
      setNumQuestions(initialCount);
      setTotalTime(String(parseInt(initialCount) * 2));
    }
  }, [initialCategory, initialCount]);

  const handleStart = () => {
    onStart({
      numQuestions: parseInt(numQuestions),
      totalTime: parseInt(totalTime) * 60, 
      banca: selectedBanca,
      category: selectedCategory === "Todas" ? undefined : selectedCategory
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 sm:py-8 animate-in fade-in duration-700">
      
      {/* Header Imersivo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/10">
              <Trophy className="h-8 w-8 text-yellow-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Arena de Simulado</h1>
          </div>
          <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed">
            Configure seu ambiente de prova. Escolha a banca, o tema e o tempo para testar seus limites em um cenário real.
          </p>
        </div>
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Coluna da Esquerda: Configurações */}
        <Card className="lg:col-span-2 border-t-4 border-t-primary shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5 text-primary" /> Configuração da Prova
            </CardTitle>
            <CardDescription>Personalize os parâmetros do seu desafio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Disciplina */}
              <div className="space-y-3 group">
                <Label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  <BookOpen className="h-4 w-4" /> Disciplina / Assunto
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category" className="h-12 border-muted-foreground/20 bg-background hover:border-primary/50 transition-all shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Banca (Dinâmica) */}
              <div className="space-y-3 group">
                <Label htmlFor="banca" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  <Building2 className="h-4 w-4" /> Banca Examinadora
                </Label>
                <Select value={selectedBanca} onValueChange={setSelectedBanca} disabled={isLoadingBancas}>
                  <SelectTrigger id="banca" className="h-12 border-muted-foreground/20 bg-background hover:border-primary/50 transition-all shadow-sm">
                    {isLoadingBancas ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Carregando bancas...
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecione a banca" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {availableBancas.map(banca => <SelectItem key={banca} value={banca}>{banca}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              {/* Quantidade */}
              <div className="space-y-3 group">
                <Label htmlFor="num-questions" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  <FileText className="h-4 w-4" /> Quantidade de Questões
                </Label>
                <Select value={numQuestions} onValueChange={setNumQuestions}>
                  <SelectTrigger id="num-questions" className="h-12 border-muted-foreground/20 bg-background hover:border-primary/50 transition-all shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Questões (Express)</SelectItem>
                    <SelectItem value="20">20 Questões (Padrão)</SelectItem>
                    <SelectItem value="30">30 Questões (Intenso)</SelectItem>
                    <SelectItem value="50">50 Questões (Maratona)</SelectItem>
                    <SelectItem value="100">100 Questões (Simulado Real)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tempo */}
              <div className="space-y-3 group">
                <Label htmlFor="total-time" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  <Timer className="h-4 w-4" /> Tempo Limite
                </Label>
                <Select value={totalTime} onValueChange={setTotalTime}>
                  <SelectTrigger id="total-time" className="h-12 border-muted-foreground/20 bg-background hover:border-primary/50 transition-all shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 minutos (Speed)</SelectItem>
                    <SelectItem value="40">40 minutos (Padrão)</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1h 30min</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="180">3 horas</SelectItem>
                    <SelectItem value="240">4 horas (Concurso Real)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
              <Info className="h-4 w-4" />
              <AlertTitle>Modo Foco</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                Ao iniciar, você entrará em tela cheia. Não será possível pausar o cronômetro. As respostas são enviadas automaticamente ao final do tempo.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Coluna da Direita: Resumo (HUD) */}
        <div className="flex flex-col gap-6">
          <Card className="flex-1 bg-slate-900 text-white border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
            {/* HUD Header */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
            
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-300">
                <Target className="h-5 w-5 text-green-400" /> Resumo da Missão
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-center space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl font-black text-white">{numQuestions}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Questões</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl font-black text-white">{totalTime}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Minutos</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-indigo-500/20 rounded-md mt-0.5"><BookOpen className="h-4 w-4 text-indigo-400"/></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Disciplina</p>
                    <p className="font-semibold text-sm sm:text-base leading-tight">{selectedCategory}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-pink-500/20 rounded-md mt-0.5"><Building2 className="h-4 w-4 text-pink-400"/></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Banca</p>
                    <p className="font-semibold text-sm sm:text-base leading-tight">
                      {isLoadingBancas ? "Carregando..." : selectedBanca}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6 relative z-10">
              <Button 
                onClick={handleStart} 
                disabled={isLoadingBancas}
                size="lg" 
                className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 group border-t border-white/20"
              >
                {isLoadingBancas ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <PlayCircle className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />}
                INICIAR SIMULADO
              </Button>
            </CardFooter>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
          </Card>

          {/* Dica Rápida */}
          <div className="bg-background/50 border border-border/50 p-4 rounded-xl flex gap-3 items-start">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Dica de Ouro</h4>
              <p className="text-xs text-muted-foreground leading-snug mt-1">
                Simular o ambiente real de prova (sem celular, sem pausas) aumenta sua resistência mental em até 40%.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SimuladoLobby;