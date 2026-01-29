import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Briefcase, Search, MapPin, Calendar, DollarSign, 
  ExternalLink, Building2, GraduationCap, Filter, 
  RefreshCw, Activity, CloudOff, Globe, Newspaper
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import FavoriteButton from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Profile {
  id: string;
}

export interface Concurso {
  id: string;
  orgao: string;
  banca: string;
  vagas: string;
  salario: string;
  escolaridade: string;
  estado: string[];
  inscricoesAte: string;
  dataProva?: string;
  status: string;
  linkEdital: string;
}

const ESTADOS = ["Todos", "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO", "BR"];

const fetchLiveConcursos = async () => {
  const { data, error } = await supabase.functions.invoke('get-concursos');
  if (error) throw error;
  return data.concursos as Concurso[];
};

const Concursos = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  
  const { 
    data: concursosList = [], 
    isLoading, 
    isRefetching, 
    refetch 
  } = useQuery({
    queryKey: ['concursosRealTime'], 
    queryFn: fetchLiveConcursos,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache para manter frescor
    refetchOnWindowFocus: false,
    retry: 2
  });

  useEffect(() => {
    addActivity({ type: 'Oportunidade', title: 'Mural de Concursos', path: '/concursos', icon: 'Briefcase' });
  }, [addActivity]);

  const handleManualUpdate = async () => {
    await refetch();
    toast.success("Buscando últimas notícias...");
  };

  const filteredConcursos = useMemo(() => {
    return concursosList.filter(concurso => {
      const matchesSearch = 
        concurso.orgao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concurso.banca.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = selectedState === "Todos" || concurso.estado.includes(selectedState) || concurso.estado.includes("BR");
      
      const matchesStatus = selectedStatus === "Todos" || 
                            (concurso.status && concurso.status.toLowerCase().includes(selectedStatus.toLowerCase()));

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [searchTerm, selectedState, selectedStatus, concursosList]);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        // Se a data parecer gerada (backup dinâmico ou estimativa), mostramos formato amigável
        return `Até ${format(date, "dd/MM/yyyy")}`; 
      }
      return dateString;
    } catch {
      return "Ver Edital";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-md border border-green-500/30 text-xs font-bold uppercase tracking-wider text-green-300">
              <Globe className="h-3 w-3 animate-pulse" /> Busca em Tempo Real (Google News)
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Mural de Concursos</h1>
            <p className="text-slate-300 max-w-lg text-sm sm:text-base">
              Monitoramento inteligente de editais e vagas para Enfermeiros e Técnicos em todo o Brasil.
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 h-12 px-6"
                onClick={handleManualUpdate}
                disabled={isLoading || isRefetching}
            >
                <RefreshCw className={cn("w-4 h-4", (isLoading || isRefetching) && "animate-spin")} />
                {(isLoading || isRefetching) ? "Varrendo Web..." : "Atualizar Notícias"}
            </Button>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/concursos"
              itemType="Ferramenta"
              itemTitle="Mural de Concursos"
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      {/* Barra de Filtros */}
      <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center sticky top-2 z-20 backdrop-blur-md bg-card/90">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filtrar por cidade, cargo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[120px]">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Aberto">Abertos</SelectItem>
              <SelectItem value="Previsto">Previstos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="ml-auto text-xs font-medium text-muted-foreground hidden md:block">
          {filteredConcursos.length} editais encontrados
        </div>
      </div>

      {/* Conteúdo Principal */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold">Buscando Editais Recentes...</h3>
            <p className="text-sm text-muted-foreground">Conectando ao Google News RSS para dados em tempo real.</p>
        </div>
      ) : filteredConcursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcursos.map((concurso) => (
            <Card key={concurso.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col border-t-4 border-t-primary/80">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn(
                    "border font-bold", 
                    concurso.status === "Previsto" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"
                  )}>
                    {concurso.status}
                  </Badge>
                  <div className="flex gap-1">
                     {concurso.estado.map(uf => (
                        <Badge key={uf} variant="secondary" className="font-mono text-xs px-1.5 min-w-[28px] justify-center border-secondary">{uf}</Badge>
                     ))}
                  </div>
                </div>
                <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-3 min-h-[3.5rem]" title={concurso.orgao}>
                  {concurso.orgao}
                </CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
                  <Building2 className="w-3.5 h-3.5" /> Banca: <span className="font-semibold text-foreground">{concurso.banca}</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3" /> Salário
                    </p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs truncate" title={concurso.salario}>{concurso.salario}</p>
                  </div>
                  <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1 mb-1">
                      <GraduationCap className="w-3 h-3" /> Vagas
                    </p>
                    <p className="font-bold text-foreground text-xs truncate" title={concurso.vagas}>{concurso.vagas}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-dashed">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" /> Previsão/Inscrição:
                    </span>
                    <span className="font-medium text-foreground">
                      {formatDate(concurso.inscricoesAte)}
                    </span>
                  </div>
                </div>

                {/* Badge de Fonte */}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 justify-end">
                   <Newspaper className="w-3 h-3" /> Fonte: Google News
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button className="w-full gap-2" variant={concurso.status === "Previsto" ? "outline" : "default"} asChild>
                  <a href={concurso.linkEdital} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" /> 
                    {concurso.status === "Previsto" ? "Acompanhar Notícia" : "Ver Detalhes"}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-muted">
          <div className="bg-muted p-4 rounded-full mb-4">
            <CloudOff className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Nenhum edital encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
            Tente mudar o estado ou limpar o filtro de busca.
          </p>
          <Button variant="link" onClick={() => {setSearchTerm(""); setSelectedState("Todos"); setSelectedStatus("Todos");}} className="mt-2 text-primary">
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default Concursos;