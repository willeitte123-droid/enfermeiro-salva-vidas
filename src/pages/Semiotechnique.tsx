import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { semioTechniqueData } from "@/data/assessment";
import { HandHeart, CheckCircle2, Info } from "lucide-react";

const SemioTechnique = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Guia de Semiotécnica</h1>
        <p className="text-muted-foreground">Aprenda o 'como fazer' das principais técnicas de avaliação de enfermagem.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <HandHeart className="text-primary" />
            Avaliações Fundamentais
          </CardTitle>
          <CardDescription>Técnicas e valores de referência para os principais parâmetros.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={semioTechniqueData[0].id} className="w-full" orientation="vertical">
            <TabsList className="w-full md:w-1/4 h-auto">
              {semioTechniqueData.map(item => {
                const Icon = item.icon;
                return (
                  <TabsTrigger key={item.id} value={item.id} className="w-full justify-start gap-3 p-3">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="font-semibold">{item.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {semioTechniqueData.map(item => (
              <TabsContent key={item.id} value={item.id} className="w-full md:w-3/4 mt-0 pl-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Coluna da Técnica */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Técnica de Aferição</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {item.technique.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: step }} />
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Coluna dos Valores */}
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle>Valores de Referência</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {item.normalValues && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Normalidade</AlertTitle>
                          <AlertDescription dangerouslySetInnerHTML={{ __html: item.normalValues }} />
                        </Alert>
                      )}
                      
                      {item.alterations && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Termo</TableHead>
                              <TableHead>Descrição</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {item.alterations.map(alt => (
                              <TableRow key={alt.term}>
                                <TableCell className="font-semibold">{alt.term}</TableCell>
                                <TableCell dangerouslySetInnerHTML={{ __html: alt.description }} />
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}

                      {item.glycemiaCriteria && (
                        <>
                          <p className="text-sm text-muted-foreground">Critérios Diagnósticos (mg/dL e %)</p>
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
                              {item.glycemiaCriteria.map(crit => (
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
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SemioTechnique;