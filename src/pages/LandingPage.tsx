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
  Siren, FlaskConical, ChevronDown, HelpCircle, Instagram, Mail, MessageCircle, Shield, Lock, Skull
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// --- COMPONENTES AUXILIARES ---

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
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
          <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 font-semibold text-sm h-10 transition-transform hover:scale-105">Começar Agora</Button>
        </div>
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
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
  const words = ["+ 2.000 QUESTOES DE ENFERMAGEM", "SIMULADOS POR BANCA", "TRILHA DE ESTUDOS", "REVISÕES INTELIGENTES", "FLASHCARDS", "ÁREA DO CONCURSEIRO", "CASOS CLINICOS", "FERRAMENTAS AVANÇADAS", "URGÊNCIAS E EMERGÊNCIAS", "VIDEO AULAS", "PROTOCOLOS CLINICOS"];
  return (
    <div className="w-full border-y border-blue-500/20 bg-[#050811] overflow-hidden py-8 relative z-20 shadow-[0_0_50px_-10px_rgba(37,99,235,0.15)]">
      <div className="flex animate-marquee whitespace-nowrap items-center w-max will-change-transform">
        {[...words, ...words].map((word, i) => (
          <div key={i} className="flex items-center mx-10">
            <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500">{word}</span>
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
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, delay: `${Math.random() * 5}s`, duration: `${Math.random() * 10 + 10}s`,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div key={p.id} className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-drift will-change-transform" style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: p.duration }} />
      ))}
    </div>
  );
};

const VitalsMonitorDemo = ({ hr, bp, spo2, resp, temp }: { hr: number; bp: string; spo2: number; resp: number; temp: number }) => (
  <div className="bg-black/90 border-4 border-slate-800 rounded-xl p-3 sm:p-6 shadow-2xl relative overflow-hidden font-mono mb-4 w-full">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 relative z-10">
      <div className="space-y-1 text-green-500">
        <span className="text-[10px] uppercase tracking-widest font-bold">ECG</span>
        <div className="flex items-end gap-1"><span className="text-3xl sm:text-5xl font-black">{hr === 0 ? "---" : hr}</span><span className="text-[10px] mb-1">bpm</span></div>
      </div>
      <div className="space-y-1 text-red-500">
        <span className="text-[10px] uppercase tracking-widest font-bold">PNI</span>
        <div className="flex items-end gap-1"><span className="text-2xl sm:text-4xl font-black">{bp}</span><span className="text-[10px] mb-1">mmHg</span></div>
      </div>
      <div className="space-y-1 text-blue-400">
        <span className="text-[10px] uppercase tracking-widest font-bold">SpO2</span>
        <div className="flex items-end gap-1"><span className="text-3xl sm:text-5xl font-black">{spo2}%</span></div>
      </div>
      <div className="flex flex-col justify-between h-full text-yellow-400">
        <div className="text-xl sm:text-2xl font-bold">{resp} <span className="text-[10px] opacity-60">irpm</span></div>
        <div className="text-xl sm:text-2xl font-bold text-purple-400">{temp}°C</div>
      </div>
    </div>
  </div>
);

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

const ClinicalCaseSection = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  return (
    <section className="py-24 bg-[#050811] relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">E se fosse você no plantão agora?</h2>
        </div>
        <div className="max-w-4xl mx-auto">
            <VitalsMonitorDemo hr={selectedOption === 'A' || selectedOption === 'B' ? 0 : 45} bp={selectedOption === 'A' || selectedOption === 'B' ? "0/0" : "220/110"} spo2={selectedOption === 'A' || selectedOption === 'B' ? 0 : 98} resp={selectedOption === 'A' || selectedOption === 'B' ? 0 : 10} temp={37.0} />
            <Card className={cn("border-2 shadow-2xl transition-all duration-500", selectedOption === null ? "border-yellow-500/30 bg-yellow-950/10" : selectedOption === 'C' ? "border-emerald-500/50 bg-emerald-950/20" : "border-red-600/50 bg-red-950/20")}>
              <CardHeader><CardTitle className="text-white text-xl sm:text-2xl">Situação Atual</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                 {selectedOption === null ? (
                    <div className="text-slate-300 text-base leading-relaxed space-y-4"><p>Subitamente, o monitor dispara. Pupila direita dilatou (Midríase - Anisocoria). SSVV: PA 220/110 mmHg | FC 45 bpm | FR Irregular.</p></div>
                 ) : (
                    <div className="space-y-4"><p className="text-white font-medium text-lg">{selectedOption === 'C' ? 'SALVOU A VIDA.' : 'ERRO CRÍTICO.'}</p></div>
                 )}
                 {selectedOption === null ? (
                    <div className="space-y-3 pt-4"><Button variant="outline" className="w-full text-white border-white/10" onClick={() => setSelectedOption('A')}>Administrar Nitroprussiato (Nipride)</Button><Button variant="outline" className="w-full text-white border-white/10" onClick={() => setSelectedOption('B')}>Administrar Atropina</Button><Button variant="outline" className="w-full text-white border-white/10" onClick={() => setSelectedOption('C')}>Hiperventilação + Manitol + Cabeceira elevada</Button></div>
                 ) : <Button onClick={() => setSelectedOption(null)} className="bg-white text-black">Tentar Novamente</Button>}
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
};

const FeaturesList = () => {
  const features = [
    { id: "01", title: "TRILHA DE ESTUDOS", icon: Map, color: "text-blue-400" },
    { id: "02", title: "BANCO DE QUESTÕES", icon: FileQuestion, color: "text-emerald-400" },
    { id: "03", title: "SIMULADOS", icon: Timer, color: "text-purple-400" },
    { id: "04", title: "CASOS CLÍNICOS", icon: Stethoscope, color: "text-cyan-400" },
    { id: "05", title: "FLASHCARDS", icon: Copy, color: "text-amber-400" },
    { id: "06", title: "CONCURSEIRO", icon: GraduationCap, color: "text-rose-400" }
  ];
  return (
    <section id="funcionalidades" className="py-24 bg-[#0B0F19]" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-16">Funcionalidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.id} className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl"><f.icon className={cn("w-10 h-10 mb-4", f.color)} /><h3 className="text-xl font-bold text-white">{f.title}</h3></div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EcosystemSection = () => {
  const tools = [{ title: "Banca de Questões", icon: FileQuestion, image: "/images/ecosystem/banca-de-questoes.png" }, { title: "Simulados", icon: Timer, image: "/images/ecosystem/simulados.png" }, { title: "Video Aulas", icon: MonitorPlay, image: "/images/ecosystem/video-aulas.png" }, { title: "Trilha", icon: Map, image: "/images/ecosystem/trilha-de-estudos.png" }];
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section id="ecossistema" className="py-24 bg-[#02040a] overflow-hidden" style={{ contentVisibility: 'auto' }}>
        <div className="container mx-auto px-4 mb-20"><h2 className="text-4xl font-bold text-white text-center">Tudo em <span className="text-blue-500">um único sistema</span></h2></div>
        <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar py-10">
            <div className="flex animate-marquee-slow will-change-transform">
                {[...tools, ...tools].map((t, i) => (
                    <div key={i} className="relative mx-4 w-[280px] h-[450px] flex-shrink-0 rounded-3xl overflow-hidden border border-white/10 bg-[#050811]"><img src={t.image} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-60" /><div className="absolute bottom-0 p-8 z-20"><t.icon className="w-8 h-8 text-blue-400 mb-2" /><h3 className="text-xl font-bold text-white uppercase">{t.title}</h3></div></div>
                ))}
            </div>
        </div>
    </section>
  );
};

const AppShowcaseSection = () => {
    const screens = [{ image: "/images/showcase-1.png" }, { image: "/images/showcase-2.png" }, { image: "/images/showcase-3.png" }, { image: "/images/showcase-6.png" }, { image: "/images/showcase-7.png" }];
    return (
        <section id="showcase" className="bg-[#050811] pt-20 pb-40" style={{ contentVisibility: 'auto' }}>
            <div className="max-w-6xl mx-auto px-4"><h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-24">Por Dentro da Plataforma</h2><div className="relative">{screens.map((s, i) => (<div key={i} className="sticky mx-auto max-w-5xl rounded-3xl border border-white/10 overflow-hidden mb-12" style={{ top: `${100 + i * 10}px`, zIndex: i + 1 }}><img src={s.image} loading="lazy" decoding="async" className="w-full h-auto" /></div>))}<div className="h-[20vh]" /></div></div>
        </section>
    );
};

const ForWhomSection = () => {
  const personas = [{ title: "Para o Estudante", color: "bg-[#16a34a]" }, { title: "Para o Concurseiro", color: "bg-[#6d28d9]" }, { title: "Para o Profissional", color: "bg-[#facc15]" }];
  return (
    <section className="py-24 bg-[#0B0F19]" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {personas.map((p) => (
          <div key={p.title} className={cn("rounded-[60px] p-8 h-64 flex items-center justify-center text-center", p.color)}><h3 className="text-2xl font-bold text-white">{p.title}</h3></div>
        ))}
      </div>
    </section>
  );
};

const RankingSection = () => (
  <section id="ranking" className="py-24 bg-[#050811] border-t border-white/5 overflow-hidden" style={{ contentVisibility: 'auto' }}>
    <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 text-center lg:text-left"><h2 className="text-4xl font-black text-white mb-6">Top 1 do Ranking</h2><p className="text-slate-400 mb-8 text-lg">Compita e evolua com outros profissionais.</p></div>
      <div className="flex-1"><img src="/images/ranking-mockup.png" loading="lazy" decoding="async" className="w-full h-auto drop-shadow-2xl" /></div>
    </div>
  </section>
);

const TestimonialsSection = () => {
  const testimonials = ["/images/testimonial-1.png", "/images/testimonial-2.png", "/images/testimonial-3.png"];
  return (
    <section id="depoimentos" className="py-24 bg-[#020617] overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="flex w-max animate-marquee-slow">
         {[...testimonials, ...testimonials].map((src, i) => (<div key={i} className="mx-4 w-[300px]"><img src={src} loading="lazy" decoding="async" className="rounded-2xl" /></div>))}
      </div>
    </section>
  );
};

const GuaranteeSection = () => (
  <section className="py-24 bg-[#030014]" style={{ contentVisibility: 'auto' }}>
    <div className="container mx-auto px-4 text-center"><h2 className="text-4xl font-black text-white mb-6">7 dias de garantia total</h2><Button className="bg-emerald-500 text-slate-950 font-bold">Ver planos agora</Button></div>
  </section>
);

const PricingSection = () => (
  <section id="planos" className="py-24 bg-[#020617]" style={{ contentVisibility: 'auto' }}>
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center gap-8">
      <Card className="w-full md:w-[400px] bg-[#0a0f1c] border-emerald-500 p-8 text-center text-white"><CardHeader><CardTitle className="text-3xl">Anual</CardTitle></CardHeader><CardContent><div className="text-5xl font-black text-[#22c55e] mb-6">12x R$ 20,33</div><Button className="w-full bg-[#22c55e]">Assinar Agora</Button></CardContent></Card>
    </div>
  </section>
);

const FAQSection = () => {
  const faqs = [{ q: "Indicada para quem?", a: "Estudantes, técnicos e enfermeiros." }, { q: "Só concursos?", a: "Não, prática clínica também." }];
  return (
    <section id="faq" className="py-24 bg-[#02040a]" style={{ contentVisibility: 'auto' }}>
      <div className="max-w-3xl mx-auto px-4"><h2 className="text-3xl font-black text-white mb-16 text-center">Dúvidas Frequentes</h2><Accordion type="single" collapsible>{faqs.map((f, i) => (<AccordionItem key={i} value={`i-${i}`} className="border-white/10"><AccordionTrigger className="text-white text-left">{f.q}</AccordionTrigger><AccordionContent className="text-slate-400">{f.a}</AccordionContent></AccordionItem>))}</Accordion></div>
    </section>
  );
};

const CreatorSection = () => (
  <section className="py-24 bg-[#030014] border-t border-white/5" style={{ contentVisibility: 'auto' }}>
    <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 max-w-6xl">
      <div className="flex-1 text-slate-400 space-y-6">
        <h2 className="text-4xl font-bold text-white">William Leite?</h2>
        <p>Formado em Enfermagem e pós-graduado em Estomaterapia, William criou a EnfermagemPro para tornar o estudo prático e eficiente.</p>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4"><img src="/images/william-portrait-1.jpg" className="rounded-2xl object-cover h-64 w-full" /><img src="/images/william-portrait-2.jpg" className="rounded-2xl object-cover h-64 w-full" /></div>
    </div>
  </section>
);

const Hero = () => (
  <section className="relative pt-32 pb-10 lg:pt-48 lg:pb-24 bg-[#02040a]">
    <div className="container mx-auto px-4 relative z-20 flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 text-left"><h1 className="text-4xl lg:text-7xl font-bold text-white mb-6">Você não está atrasada. <br/><span className="text-blue-400">Só está estudando do jeito errado.</span></h1><p className="text-lg text-slate-300 mb-10">O EnfermagemPro organiza seus estudos e te dá segurança no plantão.</p><Button size="lg" className="bg-blue-600 font-bold rounded-full h-14 px-8">Quero estudar com organização</Button></div>
      <div className="flex-1"><img src="/images/mockup-hero.png" className="w-full h-auto" /></div>
    </div>
  </section>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-blue-600 overflow-x-hidden">
      <Navbar />
      <Hero />
      <InfiniteMarquee />
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
      {/* FOOTER COM MOCKUP MODERNO */}
      <footer className="bg-black py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
            
            {/* Coluna 1: Contato */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:text-white transition-colors cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm sm:text-base font-medium">(68) 98101-8368</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:text-white transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm sm:text-base font-medium">@enfermagempro_</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:text-white transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm sm:text-base font-medium">suporte@enfermagempro.com</span>
                </div>
              </div>
            </div>

            {/* Coluna 2: Logo (Mockup Style) e Copyright */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/40 transition-all duration-700" />
                <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full p-1 bg-gradient-to-b from-white/20 to-white/5 border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute inset-0 rounded-full border border-blue-500/10 m-3 pointer-events-none" />
                  <div className="absolute inset-0 rounded-full border border-white/5 m-6 pointer-events-none" />
                  <img 
                    src="/images/footer-logo.png" 
                    alt="Logo Enfermagem Pro Circular" 
                    className="w-[85%] h-[85%] object-contain rounded-full brightness-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-[0.3em] text-center mt-4 opacity-70">
                Copyright &copy; 2026 Todos <br/> os direitos reservados.
              </p>
            </div>

            {/* Coluna 3: Políticas */}
            <div className="space-y-6 md:text-right">
              <h3 className="text-2xl font-bold text-white mb-4">Políticas</h3>
              <div className="flex flex-col gap-4">
                <Link to="/privacy" className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base font-medium">
                  Políticas de Privacidade
                </Link>
                <Link to="/terms" className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base font-medium">
                  Termos de Uso
                </Link>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}