import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { semioTechniqueData } from "@/data/assessment";
import { HandHeart, CheckCircle2, Droplet } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

const SemioTechnique = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const vitalSigns = semioTechniqueData.filter(item => item.id !== 'glycemia');
  const glycemiaAssessment = semioTechniqueData.find(item => item.id === 'glycemia');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Guia de Semiotécnica</h1>
          <p className="text-muted-foreground">Aprenda o 'como fazer' das principais técnicas de avaliação de enfermagem.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/semiotechnique"
            itemType="Guia"
            itemTitle="Guia de Semiotécnica"
          />
        )}
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
                          {sign.technique.map((step, i) => <li key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: step }} />)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="values">
                      <AccordionTrigger>Valores de Referência</AccordionTrigger>
                      <AccordionContent>
                        {sign.normalValues && <p className="font-semibold text-primary">{sign.normalValues}</p>}
                        <div className="mt-4 space-y-2">
                          {sign.alterations?.map(alt => (
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

      {glycemiaAssessment && (
        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
              <Droplet />
              Avaliação Glicêmica
            </CardTitle>
            <CardDescription>Técnica para aferição de glicemia capilar e critérios diagnósticos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["technique"]} className="space-y-4">
              <AccordionItem value="technique" className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="font-semibold">Técnica de Aferição</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4 pt-4">
                    {glycemiaAssessment.technique.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span dangerouslySetInnerHTML={{ __html: step }} />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="values" className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="font-semibold">Valores de Referência</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {glycemiaAssessment.alterations && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Termo</TableHead>
                          <TableHead>Descrição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {glycemiaAssessment.alterations.map(alt => (
                          <TableRow key={alt.term}>
                            <TableCell className="font-semibold">{alt.term}</TableCell>
                            <TableCell dangerouslySetInnerHTML={{ __html: alt.description }} />
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {glycemiaAssessment.glycemiaCriteria && (
                    <>
                      <p className="text-sm font-semibold text-foreground pt-4">Critérios Diagnósticos (mg/dL e %)</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Critério</TableHead>
                            <TableHead className="text-green-600">Normal</TableHead>
                            <TableHead className="text-yellow-600">Pré-Diabetes</TableHead>
                            <TableHead className="text-red-600">Diabetes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {glycemiaAssessment.glycemiaCriteria.map(crit => (
                            <TableRow key={crit.criterion}>
                              <TableCell className="font-semibold">{crit.criterion}</TableCell>
                              <TableCell>{crit.normal}</TableCell>
                              <TableCell>{crit.preDiabetes}</TableCell>
                              <TableCell>{crit.diabetes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SemioTechnique;