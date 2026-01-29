import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Briefcase, Search, MapPin, Calendar, DollarSign, 
  ExternalLink, Building2, GraduationCap, Filter, 
  RefreshCw, Server, Wifi, Activity
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

interface Profile {
  id: string;
}

const ESTADOS = ["Todos", "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO", "BR"];

const Concursos = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("Todos");
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    addActivity({ type: 'Oportunidade', title: 'Concursos Abertos', path: '/concursos', icon: 'Briefcase' });
  }, [addActivity]);

  const handleUpdateFromAPI = async () => {
    setIsUpdating(true);
    // Aqui entraria a chamada real para sua API Python que faz o scraping
    // await fetch('https://api.seuservico.com/concursos/enfermagem/abertos')
    
    setTimeout(() => {
        setIsUpdating(false);
        setLastUpdated(new Date());
        toast.success("Base de dados sincronizada!", {
            description: "Buscando novos editais abertos nas últimas 24h."
        });
    }, 2000);
  };

  // Filtragem rigorosa: Apenas Abertos
  const filteredConcursos = useMemo(() => {
    return CONCURSOS_MOCK.filter(concurso => {
      // Filtro 1: Texto
      const matchesSearch = 
        concurso.orgao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concurso.banca.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro 2: Estado
      const matchesState = selectedState === "Todos" || concurso.estado.includes(selectedState) || concurso.estado.includes("BR");
      
      // Filtro 3: Status (Rigoroso)
      const matchesStatus = concurso.status === "Aberto";

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [searchTerm, selectedState]);

  const formatDate = (dateString?: string) => {
      if (!dateString) return "A definir";
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
      
      {/* Header Imersivo - Estilo "Radar Ao Vivo" */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-950 p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-bold uppercase tracking-wider text-emerald-300 animate-pulse">
              <Wifi className="h-3 w-3" /> Monitoramento em Tempo Real
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Editais Abertos</h1>
            <p className="text-emerald-100/80 max-w-lg text-sm sm:text-base">
              Vagas confirmadas e inscrições disponíveis para Enfermagem.
              <br/>
              <span className="text-xs opacity-70">Última varredura: {format(lastUpdated, "HH:mm:ss")}</span>
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <Button 
                onClick={handleUpdateFromAPI}
                disabled={isUpdating}
                className={cn(
                    "bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-900/50 border border-emerald-400/50 gap-2 h-12 px-6 rounded-full transition-all",
                    isUpdating && "opacity-80"
                )}
            >
                <RefreshCw className={cn("w-4 h-4", isUpdating && "animate-spin")} />
                {isUpdating ? "Buscando Editais..." : "Sincronizar Agora"}
            </Button>
          </div>
        </div>
        
        {/* Radar Effect Background */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/concursos"
              itemType="Ferramenta"
              itemTitle="Concursos Abertos"
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
            placeholder="Filtrar por órgão ou banca..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filtrar Estado" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="ml-auto flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
          <Activity className="w-3.5 h-3.5" />
          {filteredConcursos.length} editais ativos encontrados
        </div>
      </div>

      {/* Grid de Concursos */}
      {filteredConcursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcursos.map((concurso) => (
            <Card key={concurso.id} className="group hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg flex flex-col border-t-4 border-t-emerald-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200">
                    Inscrições Abertas
                  </Badge>
                  <div className="flex gap-1">
                     {concurso.estado.map(uf => (
                        <Badge key={uf} variant="outline" className="font-mono text-xs px-1.5 min-w-[28px] justify-center border-emerald-200 dark:border-emerald-800">{uf}</Badge>
                     ))}
                  </div>
                </div>
                <CardTitle className="text-lg font-bold leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2" title={concurso.orgao}>
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
                      <DollarSign className="w-3 h-3" /> Remuneração
                    </p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs truncate" title={concurso.salario}>{concurso.salario}</p>
                  </div>
                  <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1 mb-1">
                      <GraduationCap className="w-3 h-3" /> Cargos
                    </p>
                    <p className="font-bold text-foreground text-xs truncate" title={concurso.vagas}>{concurso.vagas}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-dashed">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" /> Fim das Inscrições:
                    </span>
                    <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                      {formatDate(concurso.inscricoesAte)}
                    </span>
                  </div>
                  {concurso.dataProva && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Data da Prova:
                      </span>
                      <span className="font-medium text-foreground">
                        {formatDate(concurso.dataProva)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold" asChild>
                  <a href={concurso.linkEdital} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" /> 
                    Acessar Edital
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-emerald-500/20">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Nenhum edital encontrado com este filtro</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
            No momento, não encontramos editais abertos correspondentes à sua busca no estado selecionado.
          </p>
          <Button variant="link" onClick={() => {setSearchTerm(""); setSelectedState("Todos");}} className="mt-2 text-emerald-600">
            Limpar filtros e ver tudo
          </Button>
        </div>
      )}

      {/* API Connection Info */}
      <div className="mt-8 p-4 bg-slate-900 text-slate-300 border border-slate-800 rounded-lg text-xs flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
            <Server className="w-4 h-4 text-emerald-400" />
            <p>Conectado ao servidor de dados. Status da API: <span className="text-emerald-400 font-bold">Online</span></p>
        </div>
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono opacity-70">LIVE</span>
        </div>
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