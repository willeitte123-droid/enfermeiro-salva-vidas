"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, Brain, 
  Timer, ArrowRight, Zap, 
  Syringe, 
  Stethoscope, GraduationCap, Star,
  Menu, X, Play, HeartPulse, Activity, Droplet, Trophy, Map, Library, FileQuestion, Copy, MessageSquare,
  MonitorPlay, ShieldCheck, Bandage, ClipboardList, FileSearch, HandHeart, BookHeart, BookText, Calculator, FileText, NotebookText, Briefcase, Bookmark,
  Siren, FlaskConical, ChevronDown, HelpCircle, Instagram, Mail, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Componentes de UI isolados para manter o código limpo
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#030014]/50 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
             <Syringe className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">
            Enfermagem<span className="text-blue-500">Pro</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button onClick={() => scrollToSection("funcionalidades")} className="hover:text-white transition-colors">Funcionalidades</button>
          <button onClick={() => scrollToSection("ecossistema")} className="hover:text-white transition-colors">Ecossistema</button>
          <button onClick={() => scrollToSection("showcase")} className="hover:text-white transition-colors">Plataforma</button>
          <button onClick={() => scrollToSection("ranking")} className="hover:text-white transition-colors">Ranking</button>
          <button onClick={() => scrollToSection("depoimentos")} className="hover:text-white transition-colors">Depoimentos</button>
          <button onClick={() => scrollToSection("planos")} className="hover:text-white transition-colors">Planos</button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 font-semibold text-sm h-10 transition-transform hover:scale-105">
            Começar Agora
          </Button>
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#030014] border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-5 shadow-2xl">
          <button onClick={() => scrollToSection("funcionalidades")} className="text-slate-300 hover:text-white text-left text-lg">Funcionalidades</button>
          <button onClick={() => scrollToSection("ecossistema")} className="text-slate-300 hover:text-white text-left text-lg">Ecossistema</button>
          <button onClick={() => scrollToSection("showcase")} className="text-slate-300 hover:text-white text-left text-lg">Plataforma</button>
          <button onClick={() => scrollToSection("ranking")} className="text-slate-300 hover:text-white text-left text-lg">Ranking</button>
          <button onClick={() => scrollToSection("planos")} className="text-slate-300 hover:text-white text-left text-lg">Planos</button>
          <Link to="/login" className="text-slate-300 hover:text-white text-lg">Login</Link>
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full h-12 text-lg">Começar Agora</Button>
        </div>
      )}
    </nav>
  );
};

const InfiniteMarquee = () => {
  const words = [
    "+ 2.000 QUESTOES DE ENFERMAGEM",
    "SIMULADOS POR BANCA",
    "TRILHA DE ESTUDOS",
    "REVISÕES INTELIGENTES",
    "FLASHCARDS",
    "ÁREA DO CONCURSEIRO",
    "CASOS CLINICOS",
    "FERRAMENTAS AVANÇADAS",
    "URGÊNCIAS E EMERGÊNCIAS",
    "VIDEO AULAS",
    "PROTOCOLOS CLINICOS"
  ];

  return (
    <div className="w-full border-y border-blue-500/20 bg-[#050811] overflow-hidden py-8 relative z-20 shadow-[0_0_50px_-10px_rgba(37,99,235,0.15)]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#02040a] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#02040a] to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee whitespace-nowrap items-center w-max will-change-transform">
        {[...words, ...words].map((word, i) => (
          <div key={i} className="flex items-center mx-10">
            <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 hover:from-blue-400 hover:to-cyan-400 transition-all cursor-default drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {word}
            </span>
            <div className="ml-20 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ParticlesBackground = () => {
  const [particles, setParticles] = useState<{ id: number; top: string; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-drift will-change-transform"
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

const VitalsMonitorDemo = ({ hr, bp, spo2, resp, temp }: { hr: number; bp: string; spo2: number; resp: number; temp: number }) => {
  return (
    <div className="bg-black/90 border-4 border-slate-800 rounded-xl p-3 sm:p-6 shadow-2xl relative overflow-hidden font-mono mb-4 w-full">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 relative z-10">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-green-500">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">ECG</span>
            <HeartPulse className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
          </div>
          <div className="flex items-end gap-1 sm:gap-2">
            <span className={cn("text-3xl sm:text-5xl font-black leading-none", hr < 50 || hr > 120 ? "text-red-600 animate-pulse" : "text-green-500")}>
              {hr === 0 ? "---" : hr}
            </span>
            <span className="text-[10px] sm:text-xs text-green-500/70 mb-1">bpm</span>
          </div>
          <div className="h-6 sm:h-8 w-full overflow-hidden relative opacity-70">
             {hr > 0 && (
               <svg viewBox="0 0 100 20" className="w-full h-full stroke-green-500 fill-none stroke-[2px]">
                 <path d="M0,10 L10,10 L12,5 L14,15 L16,0 L18,20 L20,10 L30,10 L32,5 L34,15 L36,0 L38,20 L40,10 L50,10 L52,5 L54,15 L56,0 L58,20 L60,10 L100,10">
                   <animate attributeName="d" dur="1s" repeatCount="indefinite" values="M0,10 L10,10 L12,5 L14,15 L16,0 L18,20 L20,10 L30,10 L32,5 L34,15 L36,0 L38,20 L40,10 L50,10 L52,5 L54,15 L56,0 L58,20 L60,10 L100,10; M-20,10 L-10,10 L-8,5 L-6,15 L-4,0 L-2,20 L0,10 L10,10 L12,5 L14,15 L16,0 L18,20 L20,10 L30,10 L32,5 L34,15 L36,0 L38,20 L40,10 L80,10" />
                 </path>
               </svg>
             )}
          </div>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-red-500">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">PNI</span>
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="flex items-end gap-1 sm:gap-2">
            <span className="text-2xl sm:text-4xl font-black leading-none text-red-500">
              {bp}
            </span>
            <span className="text-[10px] sm:text-xs text-red-500/70 mb-1">mmHg</span>
          </div>
          <span className="text-[9px] sm:text-xs text-red-500/50 block mt-0.5 sm:mt-1">PAM: {(parseInt(bp.split('/')[0]) + 2 * parseInt(bp.split('/')[1])) / 3 | 0}</span>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">SpO2</span>
            <Droplet className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="flex items-end gap-1 sm:gap-2">
            <span className={cn("text-3xl sm:text-5xl font-black leading-none", spo2 < 90 ? "text-yellow-400 animate-pulse" : "text-blue-400")}>
              {spo2}%
            </span>
          </div>
          <div className="h-4 sm:h-6 w-full overflow-hidden opacity-70">
             {hr > 0 && (
                <svg viewBox="0 0 100 20" className="w-full h-full stroke-blue-400 fill-none stroke-[2px]">
                  <path d="M0,20 Q10,0 20,20 T40,20 T60,20 T80,20 T100,20">
                    <animate attributeName="d" dur="2s" repeatCount="indefinite" values="M0,20 Q10,0 20,20 T40,20 T60,20 T80,20 T100,20; M-20,20 Q-10,0 0,20 T20,20 T40,20 T60,20 T80,20" />
                  </path>
                </svg>
             )}
          </div>
        </div>
        <div className="flex flex-col justify-between h-full gap-2">
          <div className="flex items-end justify-between">
            <div className="text-yellow-400 text-[10px] sm:text-xs font-bold uppercase">RESP</div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-400 leading-none">{resp} <span className="text-[9px] sm:text-[10px] opacity-60">irpm</span></div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-purple-400 text-[10px] sm:text-xs font-bold uppercase">TEMP</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-400 leading-none">{temp}°C</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClinicalCaseSection = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleOption = (option: string) => setSelectedOption(option);
  const resetCase = () => setSelectedOption(null);

  return (
    <section className="py-24 bg-[#050811] relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-900/10 blur-[100px] pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            E se fosse você no plantão agora?
          </h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Você saberia o que fazer… se o monitor disparasse agora?
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
            <VitalsMonitorDemo 
               hr={selectedOption === 'A' || selectedOption === 'B' ? 0 : 45} 
               bp={selectedOption === 'A' || selectedOption === 'B' ? "0/0" : "220/110"} 
               spo2={selectedOption === 'A' || selectedOption === 'B' ? 0 : 98} 
               resp={selectedOption === 'A' || selectedOption === 'B' ? 0 : 10} 
               temp={37.0} 
            />
            <Card className={cn(
               "border-2 shadow-2xl transition-all duration-500", 
               selectedOption === null ? "border-yellow-500/30 bg-yellow-950/10" :
               selectedOption === 'C' ? "border-emerald-500/50 bg-emerald-950/20" :
               "border-red-600/50 bg-red-950/20"
            )}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                   {selectedOption === null && <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 animate-pulse">EMERGÊNCIA</Badge>}
                   {selectedOption === 'C' && <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle2 className="w-3 h-3 mr-1"/> SUCESSO</Badge>}
                   {(selectedOption === 'A' || selectedOption === 'B') && <Badge variant="destructive"><Skull className="w-3 h-3 mr-1"/> ÓBITO</Badge>}
                </div>
                <CardTitle className="text-white text-xl sm:text-2xl">Situação Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {selectedOption === null ? (
                    <div className="text-slate-300 text-base sm:text-lg leading-relaxed space-y-4">
                        <p>Paciente jovem, TCE grave pós-acidente moto (D3 de UTI). Sedação suspensa para avaliação.</p>
                        <p className="font-bold text-white">Subitamente, o monitor dispara. Pupila direita dilatou (Midríase - Anisocoria).</p>
                        <p className="font-mono text-sm bg-black/30 p-3 rounded border border-white/10">SSVV: PA 220/110 mmHg | FC 45 bpm (Bradicardia) | FR Irregular (Cheyne-Stokes).</p>
                    </div>
                 ) : selectedOption === 'A' ? (
                    <div className="space-y-4">
                        <p className="text-white font-medium text-lg">ERRO CRÍTICO.</p>
                        <p className="text-slate-300">A hipertensão era um reflexo de defesa (Reflexo de Cushing) para manter o sangue chegando ao cérebro contra a alta pressão intracraniana (PIC).</p>
                        <p className="text-red-400 font-bold">Ao baixar a PA, você matou a Perfusão Cerebral. O cérebro isque miou e herniou fatalmente.</p>
                    </div>
                 ) : selectedOption === 'B' ? (
                    <div className="space-y-4">
                        <p className="text-white font-medium text-lg">CONDUTA INEFICAZ.</p>
                        <p className="text-slate-300">A atropina não teve efeito. A bradicardia é central (compressão do tronco encefálico pela hipertensão intracraniana), não cardíaca.</p>
                        <p className="text-red-400 font-bold">Enquanto você tentava tratar o coração, o cérebro herniou. O paciente parou.</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                        <p className="text-white font-medium text-lg">SALVOU A VIDA.</p>
                        <p className="text-slate-300">Você reconheceu a <strong>Tríade de Cushing</strong> (Hipertensão + Bradicardia + Respiração Irregular) indicando Herniação Cerebral.</p>
                        <p className="text-emerald-400 font-bold">A hiperventilação e o Manitol reduziram a PIC agudamente. A pupila voltou ao normal e o paciente foi para cirurgia a tempo.</p>
                    </div>
                 )}
                 {selectedOption === null ? (
                    <div className="space-y-3 pt-4">
                        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Qual sua conduta?</p>
                        <Button variant="outline" className="w-full justify-start h-auto py-4 px-4 text-left whitespace-normal border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white" onClick={() => handleOption('A')}>
                           <div className="flex items-start gap-3"><span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">A</span><span>Administrar Nitroprussiato (Nipride) para baixar a PA urgente</span></div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-auto py-4 px-4 text-left whitespace-normal border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white" onClick={() => handleOption('B')}>
                           <div className="flex items-start gap-3"><span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">B</span><span>Administrar Atropina para corrigir a Bradicardia</span></div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-auto py-4 px-4 text-left whitespace-normal border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white" onClick={() => handleOption('C')}>
                           <div className="flex items-start gap-3"><span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">C</span><span>Hiperventilação transitória + Manitol + Cabeceira elevada</span></div>
                        </Button>
                    </div>
                 ) : (
                    <div className="pt-4 flex justify-end">
                       <Button onClick={resetCase} className="bg-white text-black hover:bg-slate-200 font-bold">Tentar Novamente</Button>
                    </div>
                 )}
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
};

const VideoSection = () => {
  return (
    <section className="py-24 bg-[#02040a] relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Veja como o EnfermagemPro <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              organiza seus estudos na prática
            </span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Nada de teoria solta. Aqui você vê exatamente como o sistema funciona por dentro e como ele elimina a insegurança nos estudos e no plantão.
          </p>
        </div>
        <div className="max-w-5xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
          <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
             </div>
             <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600/90 hover:bg-blue-500 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                   <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current ml-1" />
                </div>
             </div>
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                   <div className="h-full w-1/3 bg-blue-500 rounded-full" />
                </div>
                <div className="flex justify-between text-white/80 text-sm font-medium">
                   <span>02:14</span>
                   <span>05:30</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EcosystemSection = () => {
  const tools = [
    { title: "BANCA DE QUESTÕES", desc: "Mais de 2.000 questões comentadas com foco em raciocínio clínico.", icon: FileQuestion, image: "/images/ecosystem/banca-de-questoes.png" },
    { title: "ÁREA DE SIMULADO", desc: "Treinos cronometrados com análise detalhada de desempenho.", icon: Timer, image: "/images/ecosystem/simulados.png" },
    { title: "VÍDEO AULAS", desc: "Explicações objetivas para fortalecer sua base teórica.", icon: MonitorPlay, image: "/images/ecosystem/video-aulas.png" },
    { title: "TRILHA DE ESTUDOS", desc: "Sequência organizada para eliminar dúvida sobre o que estudar.", icon: Map, image: "/images/ecosystem/trilha-de-estudos.png" },
    { title: "ÁREA DO CONCURSEIRO", desc: "Organização estratégica por edital e foco no que realmente cai.", icon: GraduationCap, image: "/images/ecosystem/area-do-concurseiro.png" },
    { title: "CASOS CLÍNICOS", desc: "Treine decisões reais em ambiente seguro de aprendizado.", icon: Stethoscope, image: "/images/ecosystem/casos-clinicos.png" },
    { title: "BIBLIOTECA DIGITAL", desc: "Consulta rápida e estruturada para revisão técnica.", icon: Library, image: "/images/ecosystem/biblioteca.png" },
    { title: "FLASHCARDS", desc: "Fixação ativa para acelerar memorização e retenção.", icon: Copy, image: "/images/ecosystem/flashcards.png" },
    { title: "ÁREA DE REVISÃO", desc: "Reforce exatamente os pontos com maior índice de erro.", icon: BookOpen, image: "/images/ecosystem/area-de-revisao.png" },
    { title: "ANATOMIA", desc: "Base técnica estruturada para domínio dos fundamentos.", icon: Activity, image: "/images/ecosystem/anatomia.png" },
    { title: "MEU DESEMPENHO", desc: "Acompanhe sua evolução com dados claros e mensuráveis.", icon: Trophy, image: "/images/ecosystem/area-de-desempenho.png" },
    { title: "MEDICAMENTOS", desc: "Revisão prática de fármacos essenciais para o plantão.", icon: Syringe, image: "/images/ecosystem/medicamentos.png" },
    { title: "EMERGÊNCIAS", desc: "Protocolos objetivos para decisões rápidas.", icon: Siren, image: "/images/ecosystem/emergencias.png" },
    { title: "CURATIVOS", desc: "Tipos de lesões e condutas corretas.", icon: Bandage, image: "/images/ecosystem/curativos.png" },
    { title: "PROCEDIMENTOS", desc: "Passo a passo técnico com foco em segurança.", icon: ClipboardList, image: "/images/ecosystem/procedimentos.png" },
    { title: "SEMIOLOGIA", desc: "Avaliação clínica organizada e estruturada.", icon: FileSearch, image: "/images/ecosystem/semiologia.png" },
    { title: "SEMIOTÉCNICA", desc: "Técnicas fundamentais da enfermagem.", icon: HandHeart, image: "/images/ecosystem/semiotecnica.png" },
    { title: "GUIA DE ECG", desc: "Interpretação simplificada para decisões seguras.", icon: BookHeart, image: "/images/ecosystem/ecg.png" },
    { title: "ANOTAÇÕES E EVOLUÇÃO", desc: "Estrutura correta de registros clínicos.", icon: BookText, image: "/images/ecosystem/anotacao-e-evolucao.png" },
    { title: "TERMOS TÉCNICOS", desc: "Padronização da linguagem profissional.", icon: MessageSquare, image: "/images/ecosystem/termos-tecnicos.png" },
    { title: "GOTEJAMENTO", desc: "Cálculo rápido e preciso para administração segura.", icon: Droplet, image: "/images/ecosystem/gotejamento.png" },
    { title: "CÁLCULO DE DOSES", desc: "Ferramenta prática para reduzir risco de erro.", icon: FlaskConical, image: "/images/ecosystem/calculo-de-doses.png" },
    { title: "DUM E IMC", desc: "CÁLCULOS ESSENCIAIS PARA ACOMPANHAMENTO CLÍNICO.", icon: Calculator, image: "/images/ecosystem/dum-e-imc.png" },
    { title: "ESCALAS CLÍNICAS", desc: "Consultas rápidas para avaliação estruturada.", icon: Activity, image: "/images/ecosystem/escalas-clinicas.png" },
    { title: "VALORES LABORATORIAIS", desc: "Referências organizadas para análise segura.", icon: FileText, image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop" },
    { title: "BLOCO DE NOTAS", desc: "Organize seus aprendizados e insights.", icon: NotebookText, image: "/images/ecosystem/bloco-de-notas.png" },
    { title: "CONCURSOS", desc: "ACOMPANHE OPORTUNIDADES E MANTENHA FOCO NA APROVAÇÃO.", icon: Briefcase, image: "/images/ecosystem/area-do-concurseiro.png" },
    { title: "RANKING", desc: "Compare evolução e mantenha constância.", icon: Star, image: "/images/ecosystem/ranking.png" },
    { title: "FAVORITOS", desc: "Salve conteúdos estratégicos para revisão rápida.", icon: Bookmark, image: "/images/ecosystem/favoritos.png" }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let animationFrameId: number;
    let accumulatedScroll = 0;
    const speed = 0.5;
    const scroll = () => {
      if (!isPaused && !isDragging) {
        accumulatedScroll += speed;
        if (accumulatedScroll >= 1) {
            scrollContainer.scrollLeft += 1;
            accumulatedScroll = 0;
        }
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) { scrollContainer.scrollLeft = 0; }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true); setIsPaused(true);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };
  const onMouseLeave = () => { setIsDragging(false); setIsPaused(false); };
  const onMouseUp = () => { setIsDragging(false); setIsPaused(false); };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };
  const onTouchStart = () => { setIsPaused(true); setIsDragging(true); };
  const onTouchEnd = () => { setIsPaused(false); setIsDragging(false); };

  return (
    <section id="ecossistema" className="py-24 bg-[#02040a] relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-900/10 blur-[150px] pointer-events-none rounded-full" />
        <div className="container mx-auto px-4 mb-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight leading-tight">
                    Tudo o que você precisa para <br className="hidden md:block"/>
                    evoluir na enfermagem, em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">um único sistema</span>
                </h2>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                    O EnfermagemPro reúne estudo estratégico para concursos, prática clínica para o plantão, ferramentas inteligentes para cálculos e consultas rápidas e um ambiente que acompanha sua evolução.
                </p>
            </div>
        </div>
        <div className="relative w-full">
            <div className="absolute top-0 left-0 h-full w-24 sm:w-48 bg-gradient-to-r from-[#02040a] to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-24 sm:w-48 bg-gradient-to-l from-[#02040a] to-transparent z-20 pointer-events-none" />
            <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar py-10 cursor-grab active:cursor-grabbing select-none" onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onMouseEnter={() => setIsPaused(true)}>
                <div className="flex will-change-transform">
                    {[...tools, ...tools].map((tool, index) => (
                        <div key={index} className="relative mx-4 w-[280px] sm:w-[320px] h-[450px] flex-shrink-0 rounded-3xl overflow-hidden group transition-transform hover:scale-105 duration-500 border border-white/10 bg-[#050811]">
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/80 to-transparent z-10" />
                                <img src={tool.image} alt={tool.title} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                            </div>
                            <div className="relative z-20 h-full flex flex-col justify-end p-8 pointer-events-none">
                                <div className="mb-4 w-12 h-12 rounded-xl bg-blue-600/20 backdrop-blur-md flex items-center justify-center border border-blue-500/30">
                                    <tool.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">{tool.title}</h3>
                                <p className="text-slate-300 text-sm leading-relaxed font-medium">{tool.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};

const FeaturesList = () => {
  const features = [
    { id: "01", title: "TRILHA DE ESTUDOS ORGANIZADA", description: "Siga uma sequência lógica e estratégica de aprendizado.\nVocê nunca mais vai perder tempo decidindo o que estudar.", icon: Map, iconColor: "text-blue-400", iconBg: "bg-blue-500/10", hoverBorder: "hover:border-blue-500/50", hoverBg: "hover:bg-blue-500/5", hoverShadow: "hover:shadow-blue-500/20" },
    { id: "02", title: "BANCO DE QUESTÕES COMENTADAS", description: "Mais de 2.000 questões comentadas com foco em raciocínio clínico.\nVocê não apenas marca alternativa. Você entende o porquê.", icon: FileQuestion, iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10", hoverBorder: "hover:border-emerald-500/50", hoverBg: "hover:bg-emerald-500/5", hoverShadow: "hover:shadow-emerald-500/20" },
    { id: "03", title: "SIMULADOS COM ANÁLISE DE DESEMPENHO", description: "Simulados cronometrados com relatório detalhado de desempenho.\nEstude com base em dados reais.", icon: Timer, iconColor: "text-purple-400", iconBg: "bg-purple-500/10", hoverBorder: "hover:border-purple-500/50", hoverBg: "hover:bg-purple-500/5", hoverShadow: "hover:shadow-purple-500/20" },
    { id: "04", title: "CASOS CLÍNICOS INTERATIVOS", description: "Tome decisões como se estivesse no plantão.\nVocê aprende o raciocínio clínico no ambiente seguro do estudo.", icon: Stethoscope, iconColor: "text-cyan-400", iconBg: "bg-cyan-500/10", hoverBorder: "hover:border-cyan-500/50", hoverBg: "hover:bg-cyan-500/5", hoverShadow: "hover:shadow-cyan-500/20" },
    { id: "05", title: "FLASHCARDS E REVISÃO INTELIGENTE", description: "Fixação ativa e revisão direcionada para os pontos com falhas.\nRepetição organizada gera domínio.", icon: Copy, iconColor: "text-amber-400", iconBg: "bg-amber-500/10", hoverBorder: "hover:border-amber-500/50", hoverBg: "hover:bg-amber-500/5", hoverShadow: "hover:shadow-amber-500/20" },
    { id: "06", title: "ÁREA DO CONCURSEIRO", description: "Organização por edital e foco no que realmente cai nas provas.\nEstude com estratégia, não no impulso.", icon: GraduationCap, iconColor: "text-rose-400", iconBg: "bg-rose-500/10", hoverBorder: "hover:border-rose-500/50", hoverBg: "hover:bg-rose-500/5", hoverShadow: "hover:shadow-rose-500/20" }
  ];
  return (
    <section id="funcionalidades" className="py-24 bg-[#0B0F19] relative" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4">
        <div className="mb-16">
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Funcionalidades</h2>
           <p className="text-lg text-slate-400">que organizam seus estudos e aumentam sua segurança</p>
           <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className={cn("group relative bg-slate-900/50 border border-white/5 p-8 rounded-3xl transition-all duration-500 cursor-default hover:-translate-y-2 hover:shadow-2xl", feature.hoverBorder, feature.hoverBg, feature.hoverShadow)}>
              <span className="absolute top-6 right-8 text-4xl md:text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-500">{feature.id}</span>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", feature.iconBg, feature.iconColor)}><feature.icon className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-wide group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-line text-sm sm:text-base group-hover:text-slate-300 transition-colors">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AppShowcaseSection = () => {
    const screens = [
        { title: "Banca de Questões", image: "/images/showcase-1.png" },
        { title: "Arena de Simulado", image: "/images/showcase-2.png" },
        { title: "Trilha de Estudos", image: "/images/showcase-3.png" },
        { title: "Área de Revisão", image: "/images/showcase-4.png" },
        { title: "Área do Concurseiro", image: "/images/showcase-5.png" },
        { title: "Flashcards", image: "/images/showcase-6.png" },
        { title: "Análise de Desempenho", image: "/images/showcase-7.png" }
    ];
    return (
        <section id="showcase" className="bg-[#050811] relative border-t border-white/5 pt-20 pb-40" style={{ contentVisibility: 'auto' }}>
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Por Dentro da <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">EnfermagemPro</span></h2>
                    <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">Um sistema completo para transformar estudo solto em evolução real.</p>
                </div>
                <div className="relative">
                    {screens.map((screen, index) => (
                        <div key={index} className="sticky mx-auto max-w-5xl rounded-3xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 bg-[#050811] overflow-hidden" style={{ top: `${100 + index * 10}px`, zIndex: index + 1, marginBottom: '50px' }}>
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                             <img src={screen.image} alt={screen.title} loading="lazy" decoding="async" className="w-full h-auto block min-h-[300px]" />
                        </div>
                    ))}
                    <div className="h-[20vh]" />
                </div>
            </div>
        </section>
    );
};

const ForWhomSection = () => {
  const personas = [
    { title: "Para o Estudante", description: "Cansado de apostilas desorganizadas? Use nossa trilha para se destacar.", image: "/images/estudante.png", circleColor: "bg-[#1e3a8a]", blockColor: "bg-[#16a34a]", textColor: "text-green-100" },
    { title: "Para o Concurseiro", description: "Pare de estudar sem foco. Simulados estratégicos até a aprovação.", image: "/images/concurseiro.png", circleColor: "bg-[#facc15]", blockColor: "bg-[#6d28d9]", textColor: "text-purple-100" },
    { title: "Para o Profissional", description: "Tenha na palma da mão tudo o que você precisa para se preparar para intercorrências.", image: "/images/profissional.png", circleColor: "bg-[#6d28d9]", blockColor: "bg-[#facc15]", textColor: "text-yellow-900" }
  ];
  return (
    <section className="py-24 bg-[#0B0F19] relative" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Feito para você dominar a Enfermagem</h2><p className="text-lg text-slate-400">Seja você estudante ou experiente, o EnfermagemPro acelera sua jornada.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona) => (
            <div key={persona.title} className="relative flex flex-col group pt-[130px]">
              <div className={cn("flex-1 rounded-[60px] p-8 pt-32 pb-12 flex flex-col justify-start text-center", persona.blockColor)}>
                <h3 className="text-2xl font-bold text-white mb-4">{persona.title}</h3>
                <p className={cn("leading-relaxed", persona.textColor)}>{persona.description}</p>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[260px] h-[260px] transition-transform duration-500 group-hover:scale-110 z-10">
                <div className={cn("w-full h-full rounded-full overflow-hidden shadow-2xl", persona.circleColor)}>
                  <img src={persona.image} alt={persona.title} loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RankingSection = () => {
  return (
    <section id="ranking" className="py-24 bg-[#050811] relative border-t border-white/5 overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold uppercase tracking-wider text-yellow-500 mb-6"><Trophy className="h-3 w-3" /> Gamificação</div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Chegue no <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Top 1 do Ranking</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">Estudar não precisa ser solitário. Na EnfermagemPro, você compete de forma saudável.</p>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full h-12 px-8 shadow-lg shadow-yellow-500/20">Quero entrar na disputa</Button>
            </div>
            <div className="flex-1 w-full max-w-[600px] relative flex justify-center">
                <div className="relative z-10 transform transition-transform duration-700 hover:scale-105 animate-float will-change-transform">
                    <img src="/images/ranking-mockup.png" alt="Ranking EnfermagemPro" loading="lazy" decoding="async" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-yellow-500/20 rounded-full blur-[80px] -z-10" />
            </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    "/images/testimonial-1.png", "/images/testimonial-2.png", "/images/testimonial-3.png", "/images/testimonial-4.png", "/images/testimonial-5.png", "/images/testimonial-6.png", "/images/testimonial-7.png",
  ];
  return (
    <section id="depoimentos" className="py-24 bg-[#020617] relative border-t border-white/5 overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4 mb-16 relative z-10">
         <div className="text-center max-w-4xl mx-auto"><h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Eles estudavam sem direção. <br/><span className="text-blue-500">Hoje estudam com estratégia.</span></h2></div>
      </div>
      <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-24 sm:w-48 bg-gradient-to-r from-[#020617] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-24 sm:w-48 bg-gradient-to-l from-[#020617] to-transparent z-20 pointer-events-none" />
          <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused] will-change-transform">
             {[...testimonials, ...testimonials].map((src, index) => (
                <div key={index} className="mx-4 w-[280px] sm:w-[350px] flex-shrink-0">
                   <img src={src} alt={`Depoimento ${index + 1}`} loading="lazy" decoding="async" className="w-full h-auto rounded-2xl shadow-xl border border-white/10" />
                </div>
             ))}
          </div>
      </div>
      <div className="text-center mt-12 relative z-10"><Button size="lg" className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] transition-all hover:scale-105">Quero estudar com método</Button></div>
    </section>
  );
};

const GuaranteeSection = () => {
  return (
    <section className="py-24 bg-[#030014] relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
        <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
                <div className="flex-[1.5]">
                    <div className="h-full rounded-[2.5rem] p-8 sm:p-12 bg-gradient-to-br from-slate-900/80 to-slate-950 border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300 mb-8"><Shield className="w-4 h-4 text-emerald-400" /> Garantia sem risco</div>
                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight flex flex-wrap items-center gap-4"><span className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-emerald-500 text-slate-950"><CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" /></span>7 dias de garantia total</h2>
                            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">Se não gostar, devolvemos <span className="text-white font-bold">100% do seu dinheiro.</span> Sem burocracia.</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                    <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 shadow-xl"><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0"><Lock className="w-5 h-5 text-amber-500" /></div><div><h3 className="text-lg font-bold text-white mb-2">Compra segura</h3><p className="text-slate-400 text-sm">Proteção com padrão bancário.</p></div></div></div>
                    <div className="p-8 rounded-[2rem] bg-slate-900/80 border border-white/10 shadow-2xl flex flex-col gap-4"><Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-[#030014] font-black text-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">Ver planos agora <ChevronDown className="w-6 h-6" /></Button></div>
                </div>
            </div>
        </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section id="planos" className="py-24 relative overflow-hidden bg-[#020617]" style={{ contentVisibility: 'auto' }}>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-900/5 blur-[120px] pointer-events-none rounded-full" />
       <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-4xl md:text-5xl font-black text-white mb-4">Planos e preços</h2></div>
          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
             <div className="relative w-full md:w-[420px] group transform transition-all duration-500 hover:scale-[1.02] z-20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"><Badge className="bg-[#22c55e] text-black hover:bg-[#22c55e] border-none font-bold px-4 py-1 uppercase text-xs shadow-lg shadow-green-900/50 animate-pulse-subtle">🔥 Mais Popular</Badge></div>
                <Card className="relative h-full bg-[#0a0f1c] border-2 border-[#22c55e] rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[0_0_50px_-10px_rgba(34,197,94,0.4)] overflow-hidden">
                   <CardHeader className="p-0 mb-6 w-full"><CardTitle className="text-3xl font-bold text-white mb-2">Plano Anual</CardTitle></CardHeader>
                   <CardContent className="p-0 w-full flex-1 flex flex-col items-center">
                      <div className="mb-2"><span className="text-5xl font-black text-[#22c55e]">12x R$ 20,33</span></div>
                      <Button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold h-12 rounded-xl text-lg mt-auto">Quero assinar (Anual)</Button>
                   </CardContent>
                </Card>
             </div>
             <div className="w-full md:w-[380px] mt-8 md:mt-4 group hover:-translate-y-1 transition-all duration-300">
                <Card className="h-full bg-[#0f121e] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-xl">
                   <CardHeader className="p-0 mb-6 w-full"><CardTitle className="text-2xl font-bold text-white mb-2">Plano Mensal</CardTitle></CardHeader>
                   <CardContent className="p-0 w-full flex-1 flex flex-col items-center">
                      <div className="mb-12"><span className="text-5xl font-black text-white">R$ 67</span></div>
                      <Button className="w-full bg-[#1e293b] hover:bg-[#334155] text-white font-bold h-12 rounded-xl text-lg border border-white/10 mt-auto">Quero assinar (Mensal)</Button>
                   </CardContent>
                </Card>
             </div>
          </div>
       </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    { q: "A EnfermagemPro é indicada para quem?", a: "Para estudantes de enfermagem, técnicos e enfermeiros.", color: "border-blue-500/30", bg: "data-[state=open]:bg-blue-500/10", accent: "text-blue-400" },
    { q: "A plataforma é voltada apenas para concursos?", a: "Não. Também é uma ferramenta de suporte para o plantão.", color: "border-emerald-500/30", bg: "data-[state=open]:bg-emerald-500/10", accent: "text-emerald-400" },
    { q: "Consigo baixar a plataforma?", a: "Sim! Nossa plataforma utiliza a tecnologia PWA.", color: "border-violet-500/30", bg: "data-[state=open]:bg-violet-500/10", accent: "text-violet-400" },
  ];
  return (
    <section id="faq" className="py-24 bg-[#02040a] relative border-t border-white/5 overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl md:text-5xl font-black text-white mb-6">Perguntas Frequentes</h2></div>
        <div className="max-w-3xl mx-auto"><Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className={cn("border rounded-2xl bg-white/5 overflow-hidden px-4 sm:px-6 transition-all duration-300", faq.color, faq.bg)}>
                        <AccordionTrigger className="hover:no-underline py-5 text-left text-base sm:text-lg font-bold text-white group"><span className={cn("group-hover:opacity-80 transition-all pr-4", faq.accent)}>{faq.q}</span></AccordionTrigger>
                        <AccordionContent className="pb-6 text-slate-400 text-sm sm:text-base leading-relaxed">{faq.a}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion></div>
      </div>
    </section>
  );
};

const Hero = () => {
  return (
    <>
    <section className="relative pt-32 pb-10 lg:pt-48 lg:pb-24 overflow-hidden bg-[#02040a]">
      <div className="absolute inset-0 z-0">
        <img src="/images/background-hero.png" alt="Enfermagem Background" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-[#02040a]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02040a]/80 via-transparent to-[#02040a]" />
      </div>
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0 animate-pulse-subtle" />
      <ParticlesBackground />
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-left max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">Você não está atrasada. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Você só está estudando do jeito errado.</span></h1>
                <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light drop-shadow-md">O EnfermagemPro organiza seus estudos e te dá segurança real no plantão.</p>
                <div className="flex flex-col sm:flex-row items-center gap-6"><Button size="lg" className="h-14 px-8 text-base md:text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] transition-all hover:scale-105 w-full sm:w-auto">Quero estudar com organização</Button></div>
            </div>
            <div className="flex-1 relative w-full flex justify-center lg:justify-end animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="relative z-10 w-full max-w-[800px] animate-float will-change-transform">
                    <img src="/images/mockup-hero.png" alt="Plataforma Enfermagem Pro" className="w-full h-auto drop-shadow-2xl" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/20 blur-[100px] -z-10 rounded-full mix-blend-screen" />
            </div>
        </div>
      </div>
    </section>
    <InfiniteMarquee />
    </>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <VideoSection />
      <ClinicalCaseSection />
      <FeaturesList />
      <EcosystemSection />
      <AppShowcaseSection />
      <ForWhomSection />
      <RankingSection />
      <TestimonialsSection />
      <GuaranteeSection />
      <PricingSection />
      <CreatorSection />
      <FAQSection />
      <footer className="bg-black py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:text-white transition-colors cursor-pointer"><MessageCircle className="w-5 h-5" /><span className="text-sm sm:text-base font-medium">(68) 98101-8368</span></div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:text-white transition-colors cursor-pointer"><Instagram className="w-5 h-5" /><span className="text-sm sm:text-base font-medium">@enfermagempro_</span></div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5" /><span className="text-sm sm:text-base font-medium">suporte@enfermagempro.com</span></div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/40 transition-all duration-700" />
                <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full p-1 bg-gradient-to-b from-white/20 to-white/5 border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
                  <img src="/images/footer-logo.png" loading="lazy" decoding="async" alt="Logo" className="w-[85%] h-[85%] object-contain rounded-full" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-[0.3em] text-center mt-4">Copyright &copy; 2026 Todos os direitos reservados.</p>
            </div>
            <div className="space-y-6 md:text-right">
              <h3 className="text-2xl font-bold text-white mb-4">Políticas</h3>
              <div className="flex flex-col gap-4">
                <Link to="/privacy" className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base">Privacidade</Link>
                <Link to="/terms" className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base">Termos</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}