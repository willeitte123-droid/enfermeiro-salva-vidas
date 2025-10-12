import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { vitalSigns, glycemiaAssessment } from "@/data/assessment";
import { HandHeart, CheckCircle2, Droplet } from "lucide-react";

const SemioTechnique = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Guia de Semiotécnica</h1>
        <p className="text-muted-foreground">Aprenda o 'como fazer' das principais técnicas de avaliação de enfermagem.</p>
      </div>

      <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-teal-700 dark:text-teal-300">
            <HandHeart />
            Aferição de Sinais Vitais
          </CardTitle>
          <CardDescription>A base da avaliação do estado de saúde do paciente.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vitalSigns.map(sign => {
            const Icon = sign.icon;
            return (
              <Card key={sign.id}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 ${sign.color}`}>
                    <Icon /> {sign.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="technique">
                      <AccordionTrigger>Técnica</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-4 list-disc">
                          {sign.technique.map((step, i) => <li key={i} className="text-sm">{step}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="values">
                      <AccordionTrigger>Valores de Referência</AccordionTrigger>
                      <AccordionContent>
                        <p className="font-semibold text-primary">{sign.normalValues}</p>
                        <div className="mt-4 space-y-2">
                          {sign.alterations.map(alt => (
                            <div key={alt.term} className="text-sm">
                              <span className="font-semibold">{alt.term}:</span>
                              <span className="text-muted-foreground ml-2">{alt.description}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
            <Droplet />
            Avaliação Glicêmica
          </CardTitle>
          <CardDescription>Técnica para aferição de glicemia capilar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-3 ${glycemiaAssessment.color}`}>
                <glycemiaAssessment.icon /> {glycemiaAssessment.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="technique">
                  <AccordionTrigger>Técnica</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-4 list-disc">
                      {glycemiaAssessment.technique.map((step, i) => <li key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: step }} />)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="values">
                  <AccordionTrigger>Valores de Referência</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-semibold text-primary">{glycemiaAssessment.normalValues}</p>
                    <div className="mt-4 space-y-2">
                      {glycemiaAssessment.alterations.map(alt => (
                        <div key={alt.term} className="text-sm">
                          <span className="font-semibold">{alt.term}:</span>
                          <span className="text-muted-foreground ml-2">{alt.description}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SemioTechnique;