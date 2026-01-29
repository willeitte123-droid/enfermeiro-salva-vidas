import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Briefcase, Search, MapPin, Calendar, DollarSign, 
  ExternalLink, Building2, GraduationCap, Filter, 
  RefreshCw, Server, Wifi, Activity, AlertCircle, CloudOff,
  Landmark
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
const BANCAS = ["Todas", "FGV", "Cebraspe", "Vunesp", "IBFC", "FCC", "Cesgranrio", "AOCP", "IDECAN", "Consulplan", "Fundatec", "Ver Edital"];

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
  const [selectedBanca, setSelectedBanca] = useState("Todas");
  
  const { 
    data: concursosList = [], 
    isLoading, 
    isRefetching, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['liveConcursosV3'], 
    queryFn: fetchLiveConcursos,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: 1
  });

  useEffect(() => {
    addActivity({ type: 'Oportunidade', title: 'Mural de Concursos', path: '/concursos', icon: 'Briefcase' });
  }, [addActivity]);

  const handleManualUpdate = async () => {
    await refetch();
    toast.success("Lista de concursos atualizada!");
  };

  const filteredConcursos = useMemo(() => {
    return concursosList.filter(concurso => {
      // 1. Texto
      const matchesSearch = 
        concurso.orgao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concurso.vagas.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Estado
      const matchesState = selectedState === "Todos" || concurso.estado.includes(selectedState) || concurso.estado.includes("BR");
      
      // 3. Status
      const matchesStatus = selectedStatus === "Todos" || 
                            (concurso.status && concurso.status.toLowerCase().includes(selectedStatus.toLowerCase()));

      // 4. Banca
      const matchesBanca = selectedBanca === "Todas" || 
                           concurso.banca.toLowerCase().includes(selectedBanca.toLowerCase());

      return matchesSearch && matchesState && matchesStatus && matchesBanca;
    });
  }, [searchTerm, selectedState, selectedStatus, selectedBanca, concursosList]);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("previsto") || s.includes("autorizado")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    if (s.includes("aberto")) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Activity className="h-3 w-3" /> Monitoramento Nacional
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Mural de Concursos</h1>
            <p className="text-slate-300 max-w-lg text-sm sm:text-base">
              Prefeituras, Estados e Federais. Encontre vagas para Enfermeiro e Técnico.
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
                {(isLoading || isRefetching) ? "Buscando..." : "Atualizar Lista"}
            </Button>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
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

      {/* Barra de Filtros - Agora com Banca */}
      <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center sticky top-2 z-20 backdrop-blur-md bg-card/90">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por prefeitura, órgão..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex w-full lg:w-auto gap-2 overflow-x-auto pb-2 lg:pb-0 flex-1">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[100px] min-w-[100px]">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedBanca} onValueChange={setSelectedBanca}>
            <SelectTrigger className="w-[140px] min-w-[140px]">
              <Landmark className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Banca" />
            </SelectTrigger>
            <SelectContent>
              {BANCAS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[130px] min-w-[130px]">
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
        
        <div className="ml-auto text-xs font-medium text-muted-foreground hidden lg:block whitespace-nowrap">
          {filteredConcursos.length} editais
        </div>
      </div>

      {/* Conteúdo Principal */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold">Carregando editais...</h3>
            <p className="text-sm text-muted-foreground">Buscando prefeituras e órgãos em todo o Brasil.</p>
        </div>
      ) : filteredConcursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcursos.map((concurso, idx) => (
            <Card key={idx} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col border-t-4 border-t-primary/80">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn("border font-bold", getStatusColor(concurso.status))}>
                    {concurso.status}
                  </Badge>
                  <div className="flex gap-1">
                     {concurso.estado.map(uf => (
                        <Badge key={uf} variant="secondary" className="font-mono text-xs px-1.5 min-w-[28px] justify-center border-secondary">{uf}</Badge>
                     ))}
                  </div>
                </div>
                <CardTitle className="text-base sm:text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]" title={concurso.orgao}>
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
                      <Calendar className="w-3.5 h-3.5" /> Inscrições:
                    </span>
                    <span className={cn("font-medium", concurso.inscricoesAte.toLowerCase().includes("encerrad") ? "text-red-500" : "text-foreground")}>
                      {concurso.inscricoesAte}
                    </span>
                  </div>
                </div>

                {concurso.vagas.includes("Verificar") && (
                   <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-[10px] text-blue-800 dark:text-blue-300">
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                      <p>Este é um edital geral. Verifique se há vagas para Enf/Téc no link.</p>
                   </div>
                )}
              </CardContent>

              <CardFooter className="pt-0">
                <Button className="w-full gap-2" variant={concurso.status.includes("Previsto") ? "outline" : "default"} asChild>
                  <a href={concurso.linkEdital} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" /> 
                    {concurso.status.includes("Previsto") ? "Acompanhar" : "Ver Edital"}
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
            Tente mudar o estado ou a banca.
          </p>
          <Button variant="link" onClick={() => {setSearchTerm(""); setSelectedState("Todos"); setSelectedStatus("Todos"); setSelectedBanca("Todas");}} className="mt-2 text-primary">
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default Concursos;