import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  HeartPulse, Activity, Wind, Thermometer, Brain, 
  ArrowRight, AlertTriangle, CheckCircle2, XCircle, 
  RotateCcw, Trophy, Stethoscope, PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CLINICAL_CASES, ClinicalCase, CaseNode } from "@/data/clinicalCases";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

// Componente do Monitor Multiparamétrico
const VitalsMonitor = ({ vitals }: { vitals: CaseNode['vitals'] }) => {
  if (!vitals) return null;

  return (
    <div className="bg-black/90 border-4 border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden font-mono">
      {/* Reflexo de tela */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
      
      {/* Grid de fundo */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 relative z-10">
        
        {/* ECG / FC */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-green-500">
            <span className="text-xs uppercase tracking-widest font-bold">ECG</span>
            <HeartPulse className="h-4 w-4 animate-pulse" />
          </div>
          <div className="flex items-end gap-2">
            <span className={cn("text-4xl sm:text-5xl font-black leading-none", vitals.hr === 0 ? "text-red-600 animate-pulse" : "text-green-500")}>
              {vitals.hr === 0 ? "---" : vitals.hr}
            </span>
            <span className="text-xs text-green-500/70 mb-1">bpm</span>
          </div>
          {/* Linha de ECG simulada (CSS Animation) */}
          <div className="h-8 w-full overflow-hidden relative opacity-70">
             {vitals.hr > 0 ? (
               <svg viewBox="0 0 100 20" className="w-full h-full stroke-green-500 fill-none stroke-[2px]">
                 <path d="M0,10 L10,10 L12,5 L14,15 L16,0 L18,20 L20,10 L30,10 L32,5 L34,15 L36,0 L38,20 L40,10 L50,10 L52,5 L54,15 L56,0 L58,20 L60,10 L100,10">
                   <animate attributeName="d" dur={`${60/vitals.hr}s`} repeatCount="indefinite" values="M0,10 L10,10 L12,5 L14,15 L16,0 L18,20 L20,10 L30,10 L32,5 L34,15 L36,0 L38,20 L40,10 L50,10 L52,5 L54,15 L56,0 L58,20 L60,10 L100,10; M-20,10 L-10,10 L-8,5 L-6,15 L-4,0 L-2,20 L0,10 L10,10 L12,5 L14,15 L16,0 L18,20 L20,10 L30,10 L32,5 L34,15 L36,0 L38,20 L40,10 L80,10" />
                 </path>
               </svg>
             ) : (
                <div className="w-full h-[2px] bg-red-600 mt-4 animate-pulse"></div>
             )}
          </div>
        </div>

        {/* PA (PNI) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-red-500">
            <span className="text-xs uppercase tracking-widest font-bold">PNI</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl sm:text-4xl font-black leading-none text-red-500">
              {vitals.bp}
            </span>
            <span className="text-xs text-red-500/70 mb-1">mmHg</span>
          </div>
          <span className="text-xs text-red-500/50 block mt-1">PAM: {(parseInt(vitals.bp.split('/')[0]) + 2 * parseInt(vitals.bp.split('/')[1])) / 3 | 0}</span>
        </div>

        {/* SpO2 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs uppercase tracking-widest font-bold">SpO2</span>
            <Droplet className="h-4 w-4" />
          </div>
          <div className="flex items-end gap-2">
            <span className={cn("text-4xl sm:text-5xl font-black leading-none", vitals.spo2 < 90 ? "text-yellow-400 animate-pulse" : "text-blue-400")}>
              {vitals.spo2}%
            </span>
          </div>
          {/* Onda de Pletismografia simulada */}
          <div className="h-6 w-full overflow-hidden opacity-70">
             {vitals.hr > 0 && (
                <svg viewBox="0 0 100 20" className="w-full h-full stroke-blue-400 fill-none stroke-[2px]">
                  <path d="M0,20 Q10,0 20,20 T40,20 T60,20 T80,20 T100,20">
                    <animate attributeName="d" dur="2s" repeatCount="indefinite" values="M0,20 Q10,0 20,20 T40,20 T60,20 T80,20 T100,20; M-20,20 Q-10,0 0,20 T20,20 T40,20 T60,20 T80,20" />
                  </path>
                </svg>
             )}
          </div>
        </div>

        {/* FR / Temp */}
        <div className="flex flex-col justify-between h-full gap-2">
          <div className="flex items-end justify-between">
            <div className="text-yellow-400 text-xs font-bold uppercase">RESP</div>
            <div className="text-2xl font-bold text-yellow-400 leading-none">{vitals.resp} <span className="text-[10px] opacity-60">irpm</span></div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-purple-400 text-xs font-bold uppercase">TEMP</div>
            <div className="text-2xl font-bold text-purple-400 leading-none">{vitals.temp}°C</div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ClinicalCases = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  
  const [activeCase, setActiveCase] = useState<ClinicalCase | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]); // Track path for summary if needed

  useEffect(() => {
    addActivity({ type: 'Simulação', title: 'Casos Clínicos', path: '/clinical-cases', icon: 'Stethoscope' });
  }, [addActivity]);

  const handleStartCase = (clinicalCase: ClinicalCase) => {
    setActiveCase(clinicalCase);
    setCurrentNodeId(clinicalCase.initialNodeId);
    setHistory([]);
  };

  const handleOptionClick = (nextNodeId: string) => {
    setCurrentNodeId(nextNodeId);
    setHistory(prev => [...prev, nextNodeId]);
  };

  const handleReset = () => {
    setActiveCase(null);
    setCurrentNodeId(null);
    setHistory([]);
  };

  // --- MODO LOBBY (Seleção de Caso) ---
  if (!activeCase) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 p-8 text-white shadow-xl border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Brain className="h-10 w-10 text-cyan-300" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Simulação Clínica Interativa</h1>
              <p className="text-blue-100 max-w-xl text-lg">
                Treine seu raciocínio clínico em cenários realistas. Suas decisões determinam a vida do paciente.
              </p>
            </div>
          </div>
          {/* Background FX */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-5 pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLINICAL_CASES.map((clinicalCase) => (
            <Card key={clinicalCase.id} className="group hover:border-primary/50 transition-all hover:shadow-lg flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn(
                    "text-xs font-bold",
                    clinicalCase.difficulty === "Iniciante" ? "bg-green-100 text-green-700 dark:bg-green-900/30" :
                    clinicalCase.difficulty === "Intermediário" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30" :
                    "bg-red-100 text-red-700 dark:bg-red-900/30"
                  )}>
                    {clinicalCase.difficulty}
                  </Badge>
                  <Badge variant="secondary">{clinicalCase.category}</Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{clinicalCase.title}</CardTitle>
                <CardDescription className="line-clamp-3 mt-2 text-sm">
                  {clinicalCase.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Button onClick={() => handleStartCase(clinicalCase)} className="w-full gap-2">
                  <PlayCircle className="h-4 w-4" /> Iniciar Caso
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {/* Placeholder for more cases */}
          <Card className="border-dashed border-2 flex items-center justify-center min-h-[250px] bg-muted/20">
            <div className="text-center text-muted-foreground p-6">
              <Stethoscope className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="font-semibold">Novos casos em breve</p>
              <p className="text-xs mt-1">Nossa equipe está elaborando novos cenários.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // --- MODO JOGO (Caso Ativo) ---
  const currentNode = activeCase.nodes[currentNodeId || activeCase.initialNodeId];
  const isGameOver = currentNode.vitals?.status === "dead" || currentNode.vitals?.status === "recovered";
  
  // Cores de status baseadas no estado do paciente
  const statusColor = {
    stable: "border-green-500/50 bg-green-500/5",
    warning: "border-yellow-500/50 bg-yellow-500/5",
    critical: "border-red-500/50 bg-red-500/5",
    dead: "border-gray-800 bg-gray-900/50 grayscale",
    recovered: "border-emerald-500 bg-emerald-500/10"
  }[currentNode.vitals?.status || "stable"];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in zoom-in-95 duration-500">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleReset} className="pl-0 hover:bg-transparent hover:text-muted-foreground">
          <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Voltar ao Lobby
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Caso:</span>
          <Badge variant="outline">{activeCase.title}</Badge>
        </div>
      </div>

      {/* Vitals Monitor */}
      {currentNode.vitals && <VitalsMonitor vitals={currentNode.vitals} />}

      {/* Main Narrative Card */}
      <Card className={cn("border-2 shadow-lg transition-all duration-500", statusColor)}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            {currentNode.vitals?.status === "critical" && <Badge variant="destructive" className="animate-pulse">CRÍTICO</Badge>}
            {currentNode.vitals?.status === "dead" && <Badge variant="destructive" className="bg-black">ÓBITO</Badge>}
            {currentNode.vitals?.status === "recovered" && <Badge className="bg-emerald-500 hover:bg-emerald-600">ESTÁVEL</Badge>}
          </div>
          <CardTitle className="text-xl sm:text-2xl leading-tight">Situação Atual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {currentNode.text}
          </div>

          {/* Feedback Section (if game over) */}
          {isGameOver && currentNode.feedback && (
            <Alert className={cn(
              "border-l-4", 
              currentNode.vitals?.status === "recovered" 
                ? "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                : "bg-red-100 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300"
            )}>
              <div className="flex gap-3">
                {currentNode.vitals?.status === "recovered" ? <Trophy className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                <div>
                  <AlertTitle className="font-bold mb-1">
                    {currentNode.vitals?.status === "recovered" ? "Sucesso Clínico!" : "Desfecho Desfavorável"}
                  </AlertTitle>
                  <AlertDescription className="text-sm leading-relaxed">
                    {currentNode.feedback}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
        
        {/* Actions Footer */}
        <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
          {!isGameOver ? (
            <div className="grid w-full gap-3">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Qual sua conduta?</p>
              {currentNode.options.map((option, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  className={cn(
                    "w-full justify-start h-auto py-4 px-4 text-left whitespace-normal border-2 hover:border-primary hover:bg-primary/5 transition-all text-sm sm:text-base",
                    // Visual clues for option types (optional, maybe keep neutral for difficulty)
                  )}
                  onClick={() => handleOptionClick(option.nextNodeId)}
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-muted text-muted-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <Button size="lg" onClick={handleReset} className="w-full gap-2 font-bold text-lg h-14 shadow-lg">
              <RotateCcw className="h-5 w-5" />
              {currentNode.vitals?.status === "recovered" ? "Finalizar e Voltar" : "Tentar Novamente"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClinicalCases;