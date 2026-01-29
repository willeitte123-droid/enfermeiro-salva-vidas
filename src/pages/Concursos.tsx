import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Briefcase, Search, MapPin, Calendar, DollarSign, 
  ExternalLink, Building2, GraduationCap, Filter, 
  RefreshCw, Server, Wifi, Activity, AlertCircle, CloudOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import FavoriteButton from "@/components/FavoriteButton";
import { CONCURSOS_MOCK, Concurso } from "@/data/concursosData";
import { format, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
}

const ESTADOS = ["Todos", "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO", "BR"];

// Função para buscar da Edge Function
const fetchLiveConcursos = async () => {
  const { data, error } = await supabase.functions.invoke('get-concursos');
  if (error) throw error;
  // A função agora sempre retorna 200, mesmo com backup, então data.concursos sempre existirá
  return data;
};

const Concursos = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  
  const { 
    data: apiResponse, 
    isLoading, 
    isRefetching, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['liveConcursos'],
    queryFn: fetchLiveConcursos,
    staleTime: 1000 * 60 * 60, // Cache de 1 hora
    refetchOnWindowFocus: false,
    retry: 1
  });

  useEffect(() => {
    addActivity({ type: 'Oportunidade', title: 'Mural de Concursos', path: '/concursos', icon: 'Briefcase' });
  }, [addActivity]);

  // Se a API retornar dados (seja live ou backup), usa eles.
  // Se der erro de rede (offline), usa o CONCURSOS_MOCK local.
  const displayData: Concurso[] = apiResponse?.concursos || CONCURSOS_MOCK;
  const isUsingBackup = apiResponse?.source === 'backup_cache' || error;

  const handleManualUpdate = async () => {
    await refetch();
    if (apiResponse?.source === 'live_api') {
        toast.success("Sincronizado com sucesso!");
    } else {
        toast.info("Servidor externo instável", { description: "Exibindo base de dados segura." });
    }
  };

  const filteredConcursos = useMemo(() => {
    return displayData.filter(concurso => {
      const matchesSearch = 
        concurso.orgao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concurso.banca.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = selectedState === "Todos" || concurso.estado.includes(selectedState) || concurso.estado.includes("BR");
      
      // Filtro de status flexível para não esconder dados importantes se o status não vier perfeito da API
      const matchesStatus = selectedStatus === "Todos" || 
                            (concurso.status && concurso.status.toLowerCase() === selectedStatus.toLowerCase()) ||
                            (selectedStatus === "Aberto" && !concurso.status); // Assume aberto se null

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [searchTerm, selectedState, selectedStatus, displayData]);

  const getStatusColor = (status: string) => {
    if (!status) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
    
    switch(status) {
      case "Aberto": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
      case "Encerrando": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse";
      case "Previsto": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Autorizado": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString?: string) => {
      if (!dateString) return "A definir";
      if (dateString.toLowerCase().includes("ver edital")) return "Ver Edital";
      if (dateString.toLowerCase().includes("contínuo")) return "Fluxo Contínuo";
      
      try {
          const date = parseISO(dateString);
          if (isValid(date)) return format(date, "dd/MM/yyyy");
          return dateString;
      } catch {
          return dateString;
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      
      {/* Header Imersivo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-emerald-300">
              {isUsingBackup ? <Server className="h-3 w-3" /> : <Wifi className="h-3 w-3 animate-pulse" />}
              {isUsingBackup ? "Base Verificada" : "Conexão Live"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Mural de Concursos</h1>
            <p className="text-slate-300 max-w-lg text-sm sm:text-base">
              Editais abertos e previstos para Enfermagem em todo o Brasil.
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
                {(isLoading || isRefetching) ? "Buscando..." : "Atualizar"}
            </Button>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
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

      {/* Alert se estiver usando backup */}
      {isUsingBackup && !isLoading && (
         <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex items-center gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>O serviço de varredura automática está instável. Exibindo a base de dados de segurança com os editais principais confirmados.</p>
         </div>
      )}

      {/* Barra de Filtros */}
      <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center sticky top-2 z-20 backdrop-blur-md bg-card/90">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filtrar por órgão ou banca..." 
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
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Aberto">Abertos</SelectItem>
              <SelectItem value="Previsto">Previstos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="ml-auto text-xs text-muted-foreground font-medium hidden md:block">
          {filteredConcursos.length} editais listados
        </div>
      </div>

      {/* Conteúdo Principal */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold">Carregando editais...</h3>
        </div>
      ) : filteredConcursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcursos.map((concurso) => (
            <Card key={concurso.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col border-t-4 border-t-primary/80">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn("border font-bold", getStatusColor(concurso.status))}>
                    {concurso.status || "Aberto"}
                  </Badge>
                  <div className="flex gap-1">
                     {concurso.estado.map(uf => (
                        <Badge key={uf} variant="secondary" className="font-mono text-xs px-1.5 min-w-[28px] justify-center border-secondary">{uf}</Badge>
                     ))}
                  </div>
                </div>
                <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]" title={concurso.orgao}>
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
                      {formatDate(concurso.inscricoesAte)}
                    </span>
                  </div>
                  {concurso.dataProva && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Prova:
                      </span>
                      <span className="font-medium text-foreground">
                        {formatDate(concurso.dataProva)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button className="w-full gap-2" variant={concurso.status === "Previsto" || concurso.status === "Autorizado" ? "outline" : "default"} asChild>
                  <a href={concurso.linkEdital} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" /> 
                    {concurso.status === "Previsto" || concurso.status === "Autorizado" ? "Acompanhar" : "Ver Edital"}
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
            Não encontramos concursos de Enfermagem com os filtros atuais na nossa base de dados.
          </p>
          <Button variant="link" onClick={() => {setSearchTerm(""); setSelectedState("Todos"); setSelectedStatus("Todos");}} className="mt-2 text-primary">
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

function FileText(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    )
}

export default Concursos;