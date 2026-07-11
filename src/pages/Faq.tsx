import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useActivityTracker } from "@/hooks/useActivityTracker";

const faqs = [
  {
    q: "A EnfermagemPro é indicada para quem?",
    a: "Para estudantes de enfermagem que buscam uma base sólida, técnicos e enfermeiros que desejam aprovação em concursos públicos ou profissionais que buscam mais segurança e consulta rápida na prática clínica do dia a dia."
  },
  {
    q: "Como funcionam os simulados?",
    a: "Você pode gerar simulados personalizados escolhendo a banca examinadora, a disciplina e o tempo de prova. Ao final, o sistema gera um relatório de desempenho mostrando seus pontos fortes e onde você precisa focar mais o estudo."
  },
  {
    q: "As questões são comentadas?",
    a: "Sim. A grande maioria das nossas questões possui comentários detalhados da nossa comunidade de alunos que explicam o porquê da alternativa correta."
  },
  {
    q: "Consigo usar no celular?",
    a: "Com certeza. Todo o ecossistema foi projetado para ser 100% responsivo. A experiência é fluida tanto no computador quanto no smartphone."
  },
  {
    q: "Como cancelar minha assinatura?",
    a: "Você pode gerenciar sua assinatura diretamente pela plataforma da Kiwify ou entrando em contato com nosso suporte pelo WhatsApp."
  }
];

const Faq = () => {
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Ajuda', title: 'Perguntas Frequentes', path: '/faq', icon: 'HelpCircle' });
  }, [addActivity]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Central de Ajuda</h1>
        </div>
        <p className="text-muted-foreground">Perguntas Frequentes (FAQ)</p>
      </div>

      <Card className="shadow-md border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Dúvidas Comuns
          </CardTitle>
          <CardDescription>
            Encontre rapidamente respostas para as principais dúvidas sobre a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0">
                <AccordionTrigger className="text-left font-semibold text-base hover:no-underline hover:text-primary transition-colors py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Faq;