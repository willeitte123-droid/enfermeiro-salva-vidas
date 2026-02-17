import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, Star, ShieldCheck, Brain, 
  Timer, Award, ArrowRight, ChevronDown, 
  Lock, AlertTriangle, Syringe, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToCheckout = () => {
    const element = document.getElementById("oferta");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-amber-500 selection:text-white overflow-x-hidden">
      
      {/* NAVBAR FLUTUANTE */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
               <Syringe className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Enfermagem<span className="text-blue-500">Pro</span></span>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                Já sou aluno
              </Button>
            </Link>
            <Button onClick={scrollToCheckout} className="bg-amber-500 hover:bg-amber-600 text-black font-bold hidden sm:flex">
              Garantir minha vaga
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
           <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]" />
           <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 text-sm uppercase tracking-wider hover:bg-blue-500/20">
            A Ferramenta Definitiva para Enfermagem
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto">
            A Segurança que Você Precisa no Plantão e a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Estratégia para sua Aprovação.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Pare de perder tempo com materiais desatualizados e insegurança na prática. Tenha acesso a protocolos, calculadoras, flashcards e simulados em uma única plataforma inteligente.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={scrollToCheckout} size="lg" className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all w-full sm:w-auto">
              QUERO ACESSO IMEDIATO
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Compra 100% Segura
            </div>
          </div>

          {/* Video Placeholder / Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto">
             <div className="aspect-video bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center group cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <img src="/images/screenshot2.png" alt="Plataforma Enfermagem Pro" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                <div className="absolute z-20 flex flex-col items-center gap-4">
                   <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                   </div>
                   <p className="text-white font-medium tracking-wide uppercase text-sm">Ver a plataforma por dentro</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS SECTION */}
      <section className="py-20 bg-slate-900 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Você já se sentiu assim?</h2>
            <p className="text-slate-400">A realidade da enfermagem pode ser esmagadora sem as ferramentas certas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-slate-950 border-white/5 hover:border-red-500/30 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Insegurança no Plantão</h3>
                <p className="text-slate-400 leading-relaxed">
                  Medo de errar um cálculo de medicação, esquecer um protocolo de emergência ou não saber avaliar uma ferida corretamente.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950 border-white/5 hover:border-red-500/30 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Overdose de Conteúdo</h3>
                <p className="text-slate-400 leading-relaxed">
                  Milhares de PDFs, apostilas desorganizadas e videoaulas longas que não vão direto ao ponto que cai na prova.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950 border-white/5 hover:border-red-500/30 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Timer className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Falta de Tempo</h3>
                <p className="text-slate-400 leading-relaxed">
                  Trabalhar em plantões exaustivos e não ter energia para estudar horas a fio para o concurso dos sonhos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 mb-6">A Solução Completa</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Seu "Canivete Suíço" para a <br/>
                <span className="text-blue-500">Prática e Estudos</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                O Enfermagem Pro não é apenas um curso. É um ecossistema tecnológico desenhado para enfermeiros e técnicos que querem alta performance.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Banca de Questões Inteligente", desc: "Milhares de questões de concursos filtradas por banca e assunto." },
                  { title: "Ferramentas de Bolso", desc: "Calculadoras de gotejamento, doses, escalas e IMC instantâneas." },
                  { title: "Flashcards de Memorização", desc: "Algoritmo de repetição espaçada para você nunca mais esquecer." },
                  { title: "Simulação Realista", desc: "Cenários clínicos interativos para treinar tomada de decisão." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center shrink-0 border border-blue-600/30">
                      <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <img src="/images/screenshot1.png" alt="App Mobile" className="rounded-2xl border border-white/10 shadow-2xl translate-y-8" />
                <img src="/images/screenshot1.png" alt="App Mobile Ferramentas" className="rounded-2xl border border-white/10 shadow-2xl -translate-y-8" />
              </div>
              {/* Glow Behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/20 blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERS / AUTHORITY */}
      <section className="py-12 border-y border-white/5 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">+10k</div>
              <div className="text-sm md:text-base text-slate-400 font-medium">Questões Cadastradas</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">24h</div>
              <div className="text-sm md:text-base text-slate-400 font-medium">Disponibilidade Offline</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">+50</div>
              <div className="text-sm md:text-base text-slate-400 font-medium">Protocolos e Guias</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">4.9/5</div>
              <div className="text-sm md:text-base text-slate-400 font-medium">Avaliação dos Alunos</div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER SECTION */}
      <section id="oferta" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Escolha o Plano Ideal para sua Carreira</h2>
            <p className="text-slate-400 text-lg">
              Invista menos que um café por dia para ter a ferramenta mais completa de enfermagem do Brasil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            
            {/* PLANO BÁSICO */}
            <Card className="bg-slate-900 border-white/10 text-slate-300 relative order-2 md:order-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-2">Plano Essencial</h3>
                <p className="text-sm text-slate-400 mb-6">Para estudantes iniciantes.</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">R$ 29,90</span>
                  <span className="text-sm">/mês</span>
                </div>
                <Button variant="outline" className="w-full mb-6 border-white/20 hover:bg-white/10 text-white">Começar Agora</Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Acesso às Calculadoras</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Guias de Bolso</li>
                  <li className="flex gap-2 opacity-50"><CheckCircle2 className="w-4 h-4" /> Sem Simulados</li>
                  <li className="flex gap-2 opacity-50"><CheckCircle2 className="w-4 h-4" /> Sem Flashcards</li>
                </ul>
              </CardContent>
            </Card>

            {/* PLANO PRO (DESTAK) */}
            <Card className="bg-slate-800 border-amber-500/50 text-white relative order-1 md:order-2 shadow-2xl scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Mais Vendido
              </div>
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  Plano PRO <Award className="w-5 h-5 text-amber-500" />
                </h3>
                <p className="text-sm text-slate-300 mb-8">Para quem quer ser aprovado.</p>
                <div className="mb-8">
                  <p className="text-sm text-slate-400 line-through mb-1">De R$ 97,00</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">R$ 49,90</span>
                    <span className="text-sm">/mês</span>
                  </div>
                  <p className="text-xs text-amber-400 font-medium mt-2">Cobrado anualmente (R$ 598,80)</p>
                </div>
                <Button className="w-full h-12 text-base font-bold bg-amber-500 hover:bg-amber-600 text-black mb-8 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  QUERO SER PRO
                </Button>
                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex gap-3 items-center"><div className="bg-amber-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-amber-500" /></div> Acesso ILIMITADO a tudo</li>
                  <li className="flex gap-3 items-center"><div className="bg-amber-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-amber-500" /></div> 10.000+ Questões Comentadas</li>
                  <li className="flex gap-3 items-center"><div className="bg-amber-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-amber-500" /></div> Flashcards de Memorização</li>
                  <li className="flex gap-3 items-center"><div className="bg-amber-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-amber-500" /></div> Simulados Personalizados</li>
                  <li className="flex gap-3 items-center"><div className="bg-amber-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-amber-500" /></div> Certificado de Horas</li>
                </ul>
              </CardContent>
            </Card>

            {/* PLANO VITALÍCIO */}
            <Card className="bg-slate-900 border-white/10 text-slate-300 relative order-3">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-2">Acesso Vitalício</h3>
                <p className="text-sm text-slate-400 mb-6">Pague uma única vez.</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">R$ 997,00</span>
                  <span className="text-sm">/único</span>
                </div>
                <Button variant="outline" className="w-full mb-6 border-white/20 hover:bg-white/10 text-white">Assinar Vitalício</Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Tudo do Plano PRO</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Sem mensalidades</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Acesso a atualizações futuras</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Suporte Prioritário</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
               <ShieldCheck className="w-5 h-5 text-green-500" />
               <span className="text-sm"><strong>Garantia de 7 Dias:</strong> Se não gostar, devolvemos 100% do seu dinheiro.</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "Serve para Técnicos e Enfermeiros?", a: "Sim! A plataforma possui filtros específicos para nível médio e superior em todas as questões e simulados." },
              { q: "Consigo usar offline?", a: "Sim, nosso aplicativo (PWA) permite salvar conteúdos como protocolos e calculadoras para uso sem internet no plantão." },
              { q: "Como funciona a garantia?", a: "Você tem 7 dias para testar tudo. Se achar que não valeu a pena, basta enviar um e-mail e reembolsamos sem perguntas." },
              { q: "As questões são atualizadas?", a: "Diariamente. Nossa equipe insere novas provas de concursos assim que os gabaritos oficiais são liberados." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-lg bg-slate-950 px-4">
                <AccordionTrigger className="hover:no-underline text-left py-4 text-base font-semibold">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-400 pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-slate-950 -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Não deixe sua aprovação para depois</h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que estão transformando suas carreiras com o Enfermagem Pro.
          </p>
          <Button onClick={scrollToCheckout} size="lg" className="h-16 px-10 text-xl font-bold bg-white text-blue-900 hover:bg-blue-50 shadow-2xl hover:scale-105 transition-transform">
            QUERO COMEÇAR AGORA
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-slate-950 border-t border-white/10 text-center text-slate-500 text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Enfermagem Pro. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/privacy" className="hover:text-white">Política de Privacidade</Link>
            <Link to="/terms" className="hover:text-white">Termos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}