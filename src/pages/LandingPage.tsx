import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, Brain, 
  Timer, ArrowRight, Zap, 
  Syringe, LayoutDashboard,
  Stethoscope, GraduationCap, Star,
  Menu, X, Play, HeartPulse, Activity, Droplet, AlertTriangle, Skull, Trophy, Map, Library, FileQuestion, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
          <button onClick={() => scrollToSection("depoimentos")} className="hover:text-white transition-colors">Depoimentos</button>
          <button onClick={() => scrollToSection("planos")} className="hover:text-white transition-colors">Planos</button>
          <button onClick={() => scrollToSection("faq")} className="hover:text-white transition-colors">FAQ</button>
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
    "CONCURSOS", "RESIDÊNCIA", "CÁLCULOS", "FARMACOLOGIA", "TERAPIA INTENSIVA",
    "SAÚDE PÚBLICA", "URGÊNCIA", "SAE", "EVOLUÇÃO", "TÉCNICAS", "ANATOMIA", 
    "MEDICAMENTOS", "SIMULADOS", "FLASHCARDS", "LEGISLAÇÃO SUS"
  ];

  return (
    <div className="w-full border-y border-white/5 bg-[#050811] overflow-hidden py-6 relative z-20">
      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#02040a] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#02040a] to-transparent z-10 pointer-events-none" />
      
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {[...words, ...words, ...words].map((word, i) => (
          <div key={i} className="flex items-center mx-8">
            <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-500 hover:from-blue-400 hover:to-cyan-400 transition-all cursor-default">
              {word}
            </span>
            <div className="ml-16 w-2 h-2 rounded-full bg-blue-900/50" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ParticlesBackground = () => {
  const [particles, setParticles] = useState<{ id: number; top: string; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate particles only on client side
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`, // 10s to 20s
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-drift"
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
      {/* Reflexo de tela */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
      
      {/* Grid de fundo */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 relative z-10">
        
        {/* ECG / FC */}
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
          {/* Linha de ECG simulada */}
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

        {/* PA (PNI) */}
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

        {/* SpO2 */}
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

        {/* FR / Temp */}
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

  const handleOption = (option: string) => {
    setSelectedOption(option);
  };

  const resetCase = () => {
    setSelectedOption(null);
  };

  return (
    <section className="py-24 bg-[#050811] relative overflow-hidden">
      {/* Lights Background */}
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
            {/* Monitor Section */}
            <VitalsMonitorDemo 
               hr={selectedOption === 'A' || selectedOption === 'B' ? 0 : 45} 
               bp={selectedOption === 'A' || selectedOption === 'B' ? "0/0" : "220/110"} 
               spo2={selectedOption === 'A' || selectedOption === 'B' ? 0 : 98} 
               resp={selectedOption === 'A' || selectedOption === 'B' ? 0 : 10} 
               temp={37.0} 
            />

            {/* Case Content Card */}
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

                 {/* Options */}
                 {selectedOption === null ? (
                    <div className="space-y-3 pt-4">
                        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Qual sua conduta?</p>
                        <Button 
                           variant="outline" 
                           className="w-full justify-start h-auto py-4 px-4 text-left whitespace-normal border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white"
                           onClick={() => handleOption('A')}
                        >
                           <div className="flex items-start gap-3">
                              <span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">A</span>
                              <span>Administrar Nitroprussiato (Nipride) para baixar a PA urgente</span>
                           </div>
                        </Button>
                        <Button 
                           variant="outline" 
                           className="w-full justify-start h-auto py-4 px-4 text-left whitespace-normal border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white"
                           onClick={() => handleOption('B')}
                        >
                           <div className="flex items-start gap-3">
                              <span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">B</span>
                              <span>Administrar Atropina para corrigir a Bradicardia</span>
                           </div>
                        </Button>
                        <Button 
                           variant="outline" 
                           className="w-full justify-start h-auto py-4 px-4 text-left whitespace-normal border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white"
                           onClick={() => handleOption('C')}
                        >
                           <div className="flex items-start gap-3">
                              <span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">C</span>
                              <span>Hiperventilação transitória + Manitol + Cabeceira elevada</span>
                           </div>
                        </Button>
                    </div>
                 ) : (
                    <div className="pt-4 flex justify-end">
                       <Button onClick={resetCase} className="bg-white text-black hover:bg-slate-200 font-bold">
                          Tentar Novamente
                       </Button>
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
    <section className="py-24 bg-[#02040a] relative overflow-hidden">
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

        {/* Video Container */}
        <div className="max-w-5xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
          {/* Mock Video UI */}
          <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
             {/* Thumbnail background */}
             <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
             </div>
             
             {/* Play Button */}
             <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600/90 hover:bg-blue-500 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                   <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current ml-1" />
                </div>
             </div>
             
             {/* Video UI Overlay */}
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

const FeaturesList = () => {
  const features = [
    {
      id: "01",
      title: "TRILHA DE ESTUDOS ORGANIZADA",
      description: "Siga uma sequência lógica e estratégica de aprendizado.\nVocê nunca mais vai perder tempo decidindo o que estudar. O sistema mostra exatamente o próximo passo.",
      icon: Map
    },
    {
      id: "02",
      title: "BANCO DE QUESTÕES COMENTADAS",
      description: "Mais de 2.000 questões comentadas com foco em raciocínio clínico e padrão de prova.\nVocê não apenas marca alternativa. Você entende o porquê e aprende como a banca pensa.",
      icon: FileQuestion
    },
    {
      id: "03",
      title: "SIMULADOS COM ANÁLISE DE DESEMPENHO",
      description: "Simulados cronometrados com relatório detalhado de desempenho.\nDescubra onde está errando, acompanhe sua evolução e estude com base em dados reais.",
      icon: Timer
    },
    {
      id: "04",
      title: "CASOS CLÍNICOS INTERATIVOS",
      description: "Tome decisões como se estivesse no plantão.\nDependendo da sua escolha, o desfecho muda. Você aprende o raciocínio clínico no ambiente seguro do estudo.",
      icon: Stethoscope
    },
    {
      id: "05",
      title: "FLASHCARDS E REVISÃO INTELIGENTE",
      description: "Fixação ativa e revisão direcionada para os pontos com maior índice de erro.\nRepetição organizada gera domínio e aumenta sua segurança nas decisões.",
      icon: Copy
    },
    {
      id: "06",
      title: "ÁREA DO CONCURSEIRO",
      description: "Organização por edital e foco no que realmente cai nas provas.\nEstude com estratégia, não no impulso.",
      icon: GraduationCap
    }
  ];

  return (
    <section id="funcionalidades" className="py-24 bg-[#0B0F19] relative">
      <div className="container mx-auto px-4">
        <div className="mb-16">
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Funcionalidades</h2>
           <p className="text-lg text-slate-400">que organizam seus estudos e aumentam sua segurança</p>
           <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className="group relative bg-slate-900/50 border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300">
              <span className="absolute top-6 right-8 text-4xl md:text-5xl font-black text-white/5 group-hover:text-blue-500/10 transition-colors">
                {feature.id}
              </span>

              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4 tracking-wide">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  return (
    <>
    <section className="relative pt-32 pb-10 lg:pt-48 lg:pb-24 overflow-hidden bg-[#02040a]">
      {/* Background Image Layer - Updated opacity and overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/background-hero.png" 
          alt="Enfermagem Background" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
        />
        {/* Dark overlay with gradient to ensure text readability while keeping image visible */}
        <div className="absolute inset-0 bg-[#02040a]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02040a]/80 via-transparent to-[#02040a]" />
      </div>

      {/* Vibrant Gradient Blobs (Glow effects) */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0 animate-pulse-subtle" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-0" />
      <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen z-0" />
      
      {/* Partículas Leves */}
      <ParticlesBackground />

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* TEXT COLUMN (Left) */}
            <div className="flex-1 text-left max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Badge Removido */}
                <div className="mb-6"></div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
                    Você não está atrasada. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        Você só está estudando do jeito errado.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light drop-shadow-md">
                    O EnfermagemPro é o sistema que organiza seus estudos, aumenta seus acertos nas provas e te dá segurança real no plantão.
                    <br/><br/>
                    <span className="text-slate-100 font-medium">Sem conteúdo solto. Sem bagunça. Sem sensação de estar sempre correndo atrás.</span>
                </p>

                {/* CTA Area */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Button size="lg" className="h-14 px-8 text-base md:text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.8)] transition-all hover:scale-105 w-full sm:w-auto">
                        Quero estudar com organização de verdade
                    </Button>
                    
                    {/* Price Info */}
                    <div className="flex flex-col items-start min-w-fit">
                         <span className="text-xs text-slate-400 line-through font-medium">DE R$ 97,00</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-sm text-slate-300">POR</span>
                            <span className="text-xl font-bold text-white">R$ 29,90</span>
                         </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-8 max-w-sm">
                   <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 w-[85%] h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                   </div>
                   <p className="text-xs text-slate-400 mt-2 font-medium flex justify-between">
                      <span>85% das vagas preenchidas</span>
                      <span className="text-white">Corra!</span>
                   </p>
                </div>
            </div>

            {/* IMAGE COLUMN (Right) - Com animação de flutuação */}
            <div className="flex-1 relative w-full flex justify-center lg:justify-end animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="relative z-10 w-full max-w-[800px] animate-float">
                    <img 
                        src="/images/mockup-hero.png" 
                        alt="Plataforma Enfermagem Pro em dispositivos" 
                        className="w-full h-auto drop-shadow-2xl"
                    />
                </div>
                
                {/* Ambient Glow behind mockup */}
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
      
      {/* PRICING SECTION */}
      <section id="planos" className="py-24 relative overflow-hidden bg-[#020617] border-t border-white/5">
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Planos Flexíveis</h2>
               <p className="text-slate-400 text-lg">
                  Comece com o essencial ou vá direto para o nível profissional.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {/* PLANO FREE */}
               <Card className="bg-slate-900/40 border-white/10 hover:border-white/20 transition-all flex flex-col">
                  <CardHeader>
                     <CardTitle className="text-white text-xl">Essencial</CardTitle>
                     <p className="text-sm text-slate-500">Para conhecer a plataforma.</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                     <div className="mb-6">
                        <span className="text-4xl font-bold text-white">R$ 0</span>
                     </div>
                     <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Acesso a 5 questões/dia</li>
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Calculadoras básicas</li>
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 1 Simulado demonstrativo</li>
                     </ul>
                     <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white" asChild>
                        <Link to="/register">Criar Conta Grátis</Link>
                     </Button>
                  </CardContent>
               </Card>

               {/* PLANO PRO */}
               <Card className="bg-slate-900 border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.15)] relative scale-105 z-10 flex flex-col">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                     Mais Vendido
                  </div>
                  <CardHeader>
                     <CardTitle className="text-white text-xl flex items-center gap-2">
                        Profissional <Star className="w-5 h-5 text-yellow-400 fill-current" />
                     </CardTitle>
                     <p className="text-sm text-blue-200">Aprovação acelerada.</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                     <div className="mb-6">
                        <span className="text-sm text-slate-400 line-through">R$ 97,00</span>
                        <div className="flex items-baseline gap-1">
                           <span className="text-5xl font-black text-white">R$ 29,90</span>
                           <span className="text-sm text-slate-400">/mês</span>
                        </div>
                     </div>
                     <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-sm font-medium text-white"><div className="bg-blue-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-blue-400" /></div> Questões ILIMITADAS</li>
                        <li className="flex gap-3 text-sm font-medium text-white"><div className="bg-blue-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-blue-400" /></div> Simulados Personalizados</li>
                        <li className="flex gap-3 text-sm font-medium text-white"><div className="bg-blue-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-blue-400" /></div> Todas as Ferramentas</li>
                        <li className="flex gap-3 text-sm font-medium text-white"><div className="bg-blue-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-blue-400" /></div> Casos Clínicos Completos</li>
                     </ul>
                     <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 shadow-lg shadow-blue-900/50">
                        ASSINAR AGORA
                     </Button>
                  </CardContent>
               </Card>

               {/* PLANO VITALÍCIO */}
               <Card className="bg-slate-900/40 border-white/10 hover:border-white/20 transition-all flex flex-col">
                  <CardHeader>
                     <CardTitle className="text-white text-xl">Vitalício</CardTitle>
                     <p className="text-sm text-slate-500">Pague uma única vez.</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                     <div className="mb-6">
                        <span className="text-4xl font-bold text-white">R$ 497</span>
                        <span className="text-sm">/único</span>
                     </div>
                     <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Tudo do Plano PRO</li>
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Sem mensalidades</li>
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Atualizações futuras inclusas</li>
                     </ul>
                     <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                        Garantir Vitalício
                     </Button>
                  </CardContent>
               </Card>
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden bg-blue-600">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Pronto para transformar sua carreira?
          </h2>
          <Button size="lg" className="h-16 px-12 text-xl font-bold bg-white text-blue-600 hover:bg-slate-100 rounded-full shadow-2xl hover:scale-105 transition-transform">
            Começar Grátis Agora
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#020617] py-12 border-t border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <Syringe className="text-white w-5 h-5" />
             </div>
             <span className="font-bold text-lg text-white">EnfermagemPro</span>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-400">
            <Link to="/terms" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>

          <p className="text-sm text-slate-600">
            &copy; 2025 Enfermagem Pro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}