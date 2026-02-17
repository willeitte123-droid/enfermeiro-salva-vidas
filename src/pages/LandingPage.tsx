import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Check, ChevronRight, Menu, X, Star, 
  Zap, Shield, Smartphone, Globe, 
  ArrowRight, Layout, BarChart3, Users, 
  PlayCircle, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Componentes de UI isolados para manter o código limpo
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030014]/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">E</span>
          </div>
          EnfermagemPro
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
          <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a>
          <a href="#planos" className="hover:text-white transition-colors">Planos</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 font-semibold text-sm h-9">
            Começar Agora
          </Button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#030014] border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
          <a href="#funcionalidades" className="text-slate-300 hover:text-white" onClick={() => setIsOpen(false)}>Funcionalidades</a>
          <a href="#planos" className="text-slate-300 hover:text-white" onClick={() => setIsOpen(false)}>Planos</a>
          <Link to="/login" className="text-slate-300 hover:text-white">Login</Link>
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full">Começar Agora</Button>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          Novas questões de 2025 adicionadas
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
          A plataforma definitiva para <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-white">
            Enfermeiros de Alta Performance
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
          Estude para concursos, consulte protocolos clínicos e utilize ferramentas de bolso em um único lugar. A segurança que você precisa no plantão.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all hover:scale-105">
            Quero Acesso Agora
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-sm">
            Ver Funcionalidades
          </Button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl perspective-[2000px] group animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative rounded-xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur shadow-2xl overflow-hidden transform rotate-x-12 group-hover:rotate-x-0 transition-transform duration-700 ease-out p-2">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
            <img 
              src="/images/screenshot2.png" 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-lg border border-white/5 opacity-90 shadow-inner"
            />
          </div>
          {/* Glow Effect under mockup */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-blue-600/20 blur-[60px] -z-10" />
        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  return (
    <section className="py-10 border-b border-white/5 bg-[#030014]">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-medium text-slate-500 mb-8">CONFIADO POR MAIS DE 5.000 PROFISSIONAIS</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Logos Placeholder (Simulando empresas/hospitais) */}
          {["Einstein", "Sírio Libanês", "Rede D'Or", "EBSERH", "Ministério da Saúde"].map((logo) => (
            <div key={logo} className="text-xl font-bold text-slate-300 flex items-center gap-2">
              <Shield className="w-6 h-6" /> {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesBento = () => {
  return (
    <section id="funcionalidades" className="py-24 bg-[#030014] relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Tudo o que você precisa,<br/> sem sair do app.</h2>
          <p className="text-slate-400 text-lg">
            Substituímos apostilas pesadas e calculadoras manuais por tecnologia de ponta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: Banco de Questões (Grande) */}
          <div className="md:col-span-2 row-span-2 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full -z-10 group-hover:bg-blue-600/30 transition-all" />
            
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
                  <Layout className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Banca de Questões Inteligente</h3>
                <p className="text-slate-400 max-w-md">
                  Filtre por banca, ano, cargo e assunto. Comentários detalhados em cada questão e estatísticas de desempenho em tempo real.
                </p>
              </div>

              {/* Mini UI Mockup inside Card */}
              <div className="w-full bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-3/4 bg-slate-700/50 rounded animate-pulse" />
                  <div className="h-2 w-1/2 bg-slate-700/50 rounded animate-pulse" />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="h-8 bg-blue-600/20 rounded border border-blue-600/30" />
                    <div className="h-8 bg-slate-800/50 rounded border border-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Ferramentas (Pequeno) */}
          <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-500/30">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ferramentas de Bolso</h3>
            <p className="text-slate-400 text-sm">
              Calculadoras de gotejamento, doses, escalas e IMC prontas para o plantão.
            </p>
          </div>

          {/* Card 3: Flashcards (Pequeno) */}
          <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30">
              <Brain className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Flashcards</h3>
            <p className="text-slate-400 text-sm">
              Memorização ativa com repetição espaçada. O método mais rápido de aprender.
            </p>
          </div>

          {/* Card 4: Wide - Simulados (Largo) */}
          <div className="md:col-span-3 rounded-3xl bg-slate-900/50 border border-white/10 p-8 md:p-12 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6 border border-amber-500/30">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Simulados Reais de Prova</h3>
              <p className="text-slate-400 text-lg mb-6">
                Crie simulados personalizados com tempo cronometrado e gabarito ao final. A melhor forma de testar seus conhecimentos antes do dia D.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-500" /> Cronômetro Real
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-500" /> Ranking Global
                </div>
              </div>
            </div>
            
            {/* Visual Element Right */}
            <div className="w-full md:w-1/2 relative h-full min-h-[200px] bg-black/20 rounded-xl border border-white/5 p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">85%</div>
                <div className="text-sm text-slate-400 uppercase tracking-widest">Taxa de Acerto Média</div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-amber-500 h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* PRICING */}
    <section id="planos" className="py-24 bg-[#05050A] relative border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Planos Flexíveis</h2>
          <p className="text-slate-400">Comece grátis, faça upgrade quando estiver pronto.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Basic */}
          <Card className="bg-[#0B0F19] border border-white/5 text-slate-300 hover:border-white/10 transition-colors rounded-2xl">
            <CardHeader className="p-8 pb-0">
              <h3 className="text-xl font-medium text-white mb-2">Essencial</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">R$ 0</span>
                <span className="text-sm">/mês</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Para conhecer a plataforma.</p>
            </CardHeader>
            <CardContent className="p-8">
              <Button variant="outline" className="w-full mb-8 border-white/10 hover:bg-white/5 text-white h-12 rounded-xl">
                Criar Conta Grátis
              </Button>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> Acesso a 5 questões/dia</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> Calculadoras básicas</li>
                <li className="flex gap-3 opacity-50"><X className="w-4 h-4" /> Simulados Ilimitados</li>
              </ul>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="bg-[#0f121e] border border-blue-500/50 text-white rounded-2xl relative shadow-2xl shadow-blue-900/20 scale-105 z-10">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Mais Popular
            </div>
            <CardHeader className="p-8 pb-0">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Profissional <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">R$ 29,90</span>
                <span className="text-sm text-slate-400">/mês</span>
              </div>
              <p className="text-sm text-blue-200/80 mt-2">Faturado anualmente.</p>
            </CardHeader>
            <CardContent className="p-8">
              <Button className="w-full mb-8 bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-500/25">
                Assinar Agora
              </Button>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex gap-3"><div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div> Questões ILIMITADAS</li>
                <li className="flex gap-3"><div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div> Simulados Personalizados</li>
                <li className="flex gap-3"><div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div> Todas as Ferramentas</li>
                <li className="flex gap-3"><div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div> Casos Clínicos Completos</li>
              </ul>
            </CardContent>
          </Card>

          {/* Lifetime */}
          <Card className="bg-slate-900/40 border border-white/10 hover:border-white/20 transition-all flex flex-col rounded-2xl">
            <CardHeader className="p-8 pb-0">
              <h3 className="text-xl font-medium text-white mb-2">Vitalício</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">R$ 497</span>
                <span className="text-sm">/único</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Pagamento único. Acesso para sempre.</p>
            </CardHeader>
            <CardContent className="p-8">
              <Button variant="outline" className="w-full mb-8 border-white/10 hover:bg-white/5 text-white h-12 rounded-xl">
                Garantir Vitalício
              </Button>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3"><Check className="w-4 h-4 text-purple-500" /> Tudo do Plano Pro</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-purple-500" /> Sem mensalidades</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-purple-500" /> Atualizações futuras inclusas</li>
              </ul>
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
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Junte-se a milhares de profissionais que usam o Enfermagem Pro todos os dias.
        </p>
        <Button size="lg" className="h-16 px-12 text-xl font-bold bg-white text-blue-600 hover:bg-slate-100 rounded-full shadow-2xl hover:scale-105 transition-transform">
          Começar Grátis Agora
        </Button>
        <p className="mt-6 text-sm text-blue-200/80">
          Não é necessário cartão de crédito para começar.
        </p>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="bg-[#020617] py-12 border-t border-white/5">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
             <span className="text-white text-xs font-bold">E</span>
          </div>
          <span className="font-bold text-white">EnfermagemPro</span>
        </div>
        
        <div className="flex gap-8 text-sm text-slate-400">
          <Link to="/terms" className="hover:text-white transition-colors">Termos</Link>
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