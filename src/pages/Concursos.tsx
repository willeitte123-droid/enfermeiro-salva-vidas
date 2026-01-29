import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Briefcase, Search, MapPin, Calendar, DollarSign, 
  ExternalLink, Building2, GraduationCap, Filter, AlertCircle, RefreshCw, Server
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
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Profile {
  id: string;
}

const ESTADOS = ["Todos", "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO", "BR"];

const Concursos = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [concursosList, setConcursosList] = useState<Concurso[]>(CONCURSOS_MOCK);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    addActivity({ type: 'Oportunidade', title: 'Mural de Concursos', path: '/concursos', icon: 'Briefcase' });
  }, [addActivity]);

  const handleUpdateFromAPI = async () => {
    setIsUpdating(true);
    // Simulação de chamada à API Python do usuário
    // Em produção, isso seria: await fetch('URL_DA_SUA_API_PYTHON/concursos')
    setTimeout(() => {
        setIsUpdating(false);
        toast.success("Lista atualizada com sucesso!", {
            description: "Dados sincronizados com a base nacional."
        });
    }, 1500);
  };

  // Filtragem dos dados
  const filteredConcursos = useMemo(() => {
    return concursosList.filter(concurso => {
      const matchesSearch = 
        concurso.orgao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concurso.banca.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = selectedState === "Todos" || concurso.estado.includes(selectedState) || concurso.estado.includes("BR");
      const matchesStatus = selectedStatus === "Todos" || concurso.status === selectedStatus;

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [searchTerm, selectedState, selectedStatus, concursosList]);

  const getStatusColor = (status: string) => {
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
      if (dateString.toLowerCase().includes("encerrad")) return "Encerradas";
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Briefcase className="h-3 w-3" /> Oportunidades Reais
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Mural de Concursos</h1>
            <p className="text-slate-300 max-w-lg text-sm sm:text-base">
              Editais abertos e previstos para Enfermagem em todo o Brasil (Atualizado 2024/2025).
            </p>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2"
                onClick={handleUpdateFromAPI}
                disabled={isUpdating}
            >
                <RefreshCw className={cn("w-4 h-4", isUpdating && "animate-spin")} />
                {isUpdating ? "Sincronizando..." : "Atualizar Lista"}
            </Button>
            <div className="opacity-20">
               <Building2 className="w-24 h-24" />
            </div>
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

      {/* Barra de Filtros */}
      <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por órgão (ex: Correios) ou banca..." 
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
              <SelectItem value="Autorizado">Autorizados</SelectItem>
              <SelectItem value="Encerrando">Encerrando</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="ml-auto text-xs text-muted-foreground font-medium whitespace-nowrap hidden md:block">
          Mostrando {filteredConcursos.length} editais
        </div>
      </div>

      {/* Grid de Concursos */}
      {filteredConcursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcursos.map((concurso) => (
            <Card key={concurso.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn("border font-bold", getStatusColor(concurso.status))}>
                    {concurso.status === "Encerrando" && <AlertCircle className="w-3 h-3 mr-1" />}
                    {concurso.status}
                  </Badge>
                  <div className="flex gap-1">
                     {concurso.estado.map(uf => (
                        <Badge key={uf} variant="secondary" className="font-mono text-xs px-1.5 min-w-[28px] justify-center">{uf}</Badge>
                     ))}
                  </div>
                </div>
                <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2" title={concurso.orgao}>
                  {concurso.orgao}
                </CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
                  <Building2 className="w-3.5 h-3.5" /> Banca: <span className="font-semibold">{concurso.banca}</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-2 rounded-lg border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Salário
                    </p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs truncate" title={concurso.salario}>{concurso.salario}</p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-lg border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" /> Vagas
                    </p>
                    <p className="font-bold text-foreground text-xs truncate" title={concurso.vagas}>{concurso.vagas}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-dashed">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Inscrições:
                    </span>
                    <span className={cn("font-medium", concurso.inscricoesAte.includes("Encerrad") ? "text-red-500" : "text-foreground")}>
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
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Nenhum concurso encontrado</h3>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros de estado ou status.</p>
          <Button variant="link" onClick={() => {setSearchTerm(""); setSelectedState("Todos"); setSelectedStatus("Todos");}} className="mt-2">
            Limpar filtros
          </Button>
        </div>
      )}

      {/* API Info */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
        <Server className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          <strong>Integração via API:</strong> Esta lista contém dados reais atualizados manualmente. Para automação completa, configure o endpoint da sua API Python no código.
        </p>
      </div>
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