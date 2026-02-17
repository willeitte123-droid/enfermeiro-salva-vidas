import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, ShieldCheck, Brain, 
  Timer, ArrowRight, Zap, 
  Lock, Syringe, Smartphone, LayoutDashboard,
  Stethoscope, GraduationCap, ChevronRight, Star,
  Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* --- NAVBAR FLUTUANTE (GLASSMORPHISM) --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#020617]/40 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Syringe className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Enfermagem<span className="text-blue-500">Pro</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("recursos")} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Recursos</button>
            <button onClick={() => scrollToSection("depoimentos")} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Depoimentos</button>
            <button onClick={() => scrollToSection("faq")} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                Entrar
              </Button>
            </Link>
            <Button onClick={() => scrollToSection("oferta")} className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full px-6 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300">
              Assinar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#020617] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
            <button onClick={() => scrollToSection("recursos")} className="text-left text-lg font-medium text-slate-300">Recursos</button>
            <button onClick={() => scrollToSection("oferta")} className="text-left text-lg font-medium text-slate-300">Planos</button>
            <div className="h-px bg-white/10 my-2" />
            <Link to="/login" className="text-lg font-medium text-slate-300">Entrar na Plataforma</Link>
            <Button onClick={() => scrollToSection("oferta")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12">
              Quero ser Pro
            </Button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none">
           <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-subtle" />
           <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" />
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          
          {/* Badge de Novidade */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            A plataforma #1 para Profissionais de Enfermagem
          </div>
          
          {/* Título Principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Domine o Plantão.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">Acelere sua Carreira.</span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            Tenha segurança total na prática clínica e passe nos concursos mais difíceis com a única plataforma que une <strong>Inteligência Artificial</strong>, <strong>Simulação Realista</strong> e <strong>Conteúdo Premium</strong>.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Button onClick={() => scrollToSection("oferta")} size="lg" className="h-14 px-8 text-lg font-bold bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all w-full sm:w-auto rounded-full group">
              Começar Agora
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-medium border-white/10 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto rounded-full backdrop-blur-sm">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Garantia de 7 dias</span>
            </Button>
          </div>

          {/* Social Proof Mini */}
          <div className="mt-12 flex items-center gap-4 animate-in fade-in duration-1000 delay-500">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-xs font-bold overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-slate-400"><span className="text-white font-bold">4.9/5</span> de satisfação</p>
            </div>
          </div>

          {/* Dashboard Preview (3D Perspective) */}
          <div className="mt-20 relative w-full max-w-6xl mx-auto perspective-1000 group">
             {/* Glow Behind */}
             <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full -z-10 group-hover:bg-blue-500/30 transition-all duration-700" />
             
             <div className="relative rounded-xl border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm p-2 shadow-2xl transform rotate-x-12 group-hover:rotate-x-0 transition-transform duration-700 ease-out">
                <div className="rounded-lg overflow-hidden bg-[#020617] border border-white/5">
                   <img src="/images/screenshot2.png" alt="Dashboard Preview" className="w-full h-auto opacity-90" />
                </div>
                {/* Floating Elements */}
                <div className="absolute -right-6 -bottom-10 md:bottom-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl animate-bounce-slow hidden md:block">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                         <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-xs text-slate-400 font-bold uppercase">Meta Semanal</p>
                         <p className="text-white font-bold">100% Concluída</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES (BENTO GRID) --- */}
      <section id="recursos" className="py-24 bg-[#0B0F19] relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-blue-500 font-bold tracking-wide uppercase text-sm mb-3">Tudo em um só lugar</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ferramentas que transformam sua rotina.</h3>
            <p className="text-slate-400 text-lg">
              Substitua dezenas de apps, apostilas e anotações soltas por uma plataforma unificada e inteligente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            
            {/* Card 1: Large - Banca */}
            <div className="md:col-span-2 rounded-3xl bg-slate-900/50 border border-white/5 p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
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

      {/* --- PRICING SECTION --- */}
      <section id="oferta" className="py-24 relative overflow-hidden bg-[#020617]">
         {/* Light glow top */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Invista na sua Carreira</h2>
               <p className="text-slate-400 text-lg">
                  Planos acessíveis que cabem no bolso de qualquer estudante ou profissional.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               
               {/* PLANO FREE */}
               <Card className="bg-slate-900/40 border-white/10 hover:border-white/20 transition-all flex flex-col">
                  <CardHeader>
                     <CardTitle className="text-white text-xl">Gratuito</CardTitle>
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

               {/* PLANO PRO (DESTAQUE) */}
               <Card className="bg-slate-900 border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.15)] relative scale-105 z-10 flex flex-col">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                     Recomendado
                  </div>
                  <CardHeader>
                     <CardTitle className="text-white text-xl flex items-center gap-2">
                        Plano PRO <Star className="w-5 h-5 text-yellow-400 fill-current" />
                     </CardTitle>
                     <p className="text-sm text-blue-200">Para quem quer aprovação.</p>
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

               {/* PLANO ANUAL */}
               <Card className="bg-slate-900/40 border-white/10 hover:border-white/20 transition-all flex flex-col">
                  <CardHeader>
                     <CardTitle className="text-white text-xl">Anual (12 meses)</CardTitle>
                     <p className="text-sm text-green-400">Economize 30%</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                     <div className="mb-6">
                        <span className="text-4xl font-bold text-white">R$ 249,00</span>
                        <span className="text-sm text-slate-400">/ano</span>
                     </div>
                     <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Tudo do Plano PRO</li>
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Acesso offline (App)</li>
                        <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Certificado de 120h</li>
                     </ul>
                     <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10">
                        Assinar Anual
                     </Button>
                  </CardContent>
               </Card>

            </div>

            <div className="mt-12 text-center">
               <div className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-white/10 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-slate-300">Garantia incondicional de <strong>7 dias</strong>. Risco zero.</span>
               </div>
            </div>
         </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-[#0B0F19]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-white">Dúvidas Frequentes</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "Serve para estudantes?", a: "Com certeza! Temos trilhas de estudo específicas para quem ainda está na graduação ou curso técnico, focando nas bases da enfermagem." },
              { q: "Posso cancelar quando quiser?", a: "Sim. Não há fidelidade no plano mensal. Você cancela com um clique no seu painel e o acesso continua até o fim do ciclo pago." },
              { q: "As questões são atualizadas?", a: "Diariamente. Nossa equipe e sistema automatizado inserem novas provas de concursos assim que os gabaritos oficiais são liberados." },
              { q: "Tem aplicativo?", a: "Sim! Nossa plataforma é um PWA (Progressive Web App). Você pode instalar no celular e usar como um aplicativo nativo, inclusive com funções offline." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-xl bg-slate-900 px-2 overflow-hidden data-[state=open]:border-blue-500/50 transition-colors">
                <AccordionTrigger className="hover:no-underline px-4 py-4 text-base font-semibold text-slate-200 hover:text-white transition-colors">{faq.q}</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-400 text-base leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-[#020617] border-t border-white/5 text-slate-500 text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <Syringe className="text-white w-5 h-5" />
             </div>
             <span className="font-bold text-lg text-white">EnfermagemPro</span>
          </div>
          
          <div className="flex gap-8">
            <Link to="/terms" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>

          <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}