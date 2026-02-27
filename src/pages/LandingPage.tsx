import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, Brain, 
  Timer, ArrowRight, Zap, 
  Syringe, LayoutDashboard,
  Stethoscope, GraduationCap, Star,
  Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
            <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-600 to-slate-800 uppercase tracking-tight opacity-50 hover:opacity-100 hover:from-blue-400 hover:to-cyan-400 transition-all cursor-default">
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-drift"
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

const Hero = () => {
  return (
    <>
    <section className="relative pt-32 pb-10 lg:pt-48 lg:pb-24 overflow-hidden bg-[#02040a]">
      {/* Background Gradients matching high-end style */}
      <div className="absolute top-0 right-0 w-[70%] h-[120%] bg-gradient-to-l from-blue-900/30 via-purple-900/10 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#02040a] to-transparent z-20 pointer-events-none" />
      
      {/* Partículas Leves */}
      <ParticlesBackground />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* TEXT COLUMN (Left) */}
            <div className="flex-1 text-left max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Badge Removido conforme solicitado */}
                <div className="mb-6"></div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                    Você não está atrasada. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        Você só está estudando do jeito errado.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
                    O EnfermagemPro é o sistema que organiza seus estudos, aumenta seus acertos nas provas e te dá segurança real no plantão.
                    <br/><br/>
                    <span className="text-slate-200 font-medium">Sem conteúdo solto. Sem bagunça. Sem sensação de estar sempre correndo atrás.</span>
                </p>

                {/* CTA Area */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Button size="lg" className="h-14 px-8 text-base md:text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.8)] transition-all hover:scale-105 w-full sm:w-auto">
                        Quero estudar com organização de verdade
                    </Button>
                    
                    {/* Price Info */}
                    <div className="flex flex-col items-start min-w-fit">
                         <span className="text-xs text-slate-500 line-through font-medium">DE R$ 97,00</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-sm text-slate-400">POR</span>
                            <span className="text-xl font-bold text-white">R$ 29,90</span>
                         </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-8 max-w-sm">
                   <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 w-[85%] h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                   </div>
                   <p className="text-xs text-slate-500 mt-2 font-medium flex justify-between">
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
                
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-600/20 blur-[120px] -z-10 rounded-full mix-blend-screen" />
            </div>
        </div>
      </div>
    </section>
    
    <InfiniteMarquee />
    </>
  );
};

const FeaturesBento = () => {
  return (
    <section id="funcionalidades" className="py-24 bg-[#0B0F19] relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-500 font-bold tracking-wide uppercase text-sm mb-3">Tudo em um só lugar</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ferramentas que transformam sua rotina.</h3>
          <p className="text-slate-400 text-lg">
            Substituímos apostilas pesadas e calculadoras manuais por tecnologia de ponta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: Large - Banca */}
          <div className="md:col-span-2 row-span-2 rounded-3xl bg-slate-900/50 border border-white/5 p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <LayoutDashboard className="w-40 h-40 text-blue-500" />
             </div>
             <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 border border-blue-600/30">
                   <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">Banca de Questões Inteligente</h4>
                <p className="text-slate-400 mb-6 max-w-md">
                   Mais de 10.000 questões comentadas e filtradas por banca, cargo e assunto. Nosso algoritmo identifica seus pontos fracos e sugere revisões automáticas.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                   <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Filtros avançados</li>
                   <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Comentários de especialistas</li>
                   <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Estatísticas de desempenho</li>
                   <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Modo Simulado Real</li>
                </ul>
             </div>
          </div>

          {/* Card 2: Ferramentas */}
          <div className="rounded-3xl bg-slate-900/50 border border-white/5 p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center mb-6 border border-cyan-600/30">
                   <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Ferramentas de Bolso</h4>
                <p className="text-slate-400 text-sm mb-6">
                   Calculadoras de gotejamento, doses, IMC e escalas (Braden, Glasgow) prontas para o uso no plantão.
                </p>
                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Calculadora</span>
                      <Timer className="w-4 h-4 text-cyan-500" />
                   </div>
                   <div className="text-2xl font-mono font-bold text-white">45 gts/min</div>
                   <div className="text-xs text-slate-400">Volume: 500ml | Tempo: 6h</div>
                  </div>
             </div>
          </div>

          {/* Card 3: Simulação */}
          <div className="rounded-3xl bg-slate-900/50 border border-white/5 p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 border border-purple-600/30">
                   <Stethoscope className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Casos Clínicos Interativos</h4>
                <p className="text-slate-400 text-sm">
                   Treine sua tomada de decisão em cenários realistas de urgência e emergência. Aprenda errando em um ambiente seguro.
                </p>
             </div>
          </div>

          {/* Card 4: Wide - Concursos */}
          <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-white/5 p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
             <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1">
                   <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6 border border-indigo-600/30">
                      <GraduationCap className="w-6 h-6 text-indigo-400" />
                   </div>
                   <h4 className="text-2xl font-bold text-white mb-3">Mural de Concursos em Tempo Real</h4>
                   <p className="text-slate-400 mb-4">
                      Nosso robô varre a internet 24h por dia buscando novos editais para Enfermeiros e Técnicos. Seja o primeiro a saber das vagas.
                   </p>
                   <Button variant="link" className="text-indigo-400 p-0 h-auto hover:text-indigo-300">
                      Ver editais abertos <ArrowRight className="w-4 h-4 ml-1" />
                   </Button>
                </div>
                <div className="w-full md:w-1/2 bg-slate-950 rounded-xl border border-white/10 p-4 shadow-xl">
                   <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20 border-0">Aberto</Badge>
                      <div>
                         <div className="text-sm font-bold text-white">Pref. de São Paulo</div>
                         <div className="text-xs text-slate-500">Salário: R$ 6.500,00</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/20 border-0">Previsto</Badge>
                      <div>
                         <div className="text-sm font-bold text-white">EBSERH Nacional</div>
                         <div className="text-xs text-slate-500">Vagas: +2000</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeaturesBento />
      
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