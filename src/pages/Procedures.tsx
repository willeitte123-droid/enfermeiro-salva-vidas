import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, CheckSquare, Search } from "lucide-react";
import { procedures } from "@/data/procedures";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Procedures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = useMemo(() => {
    const allCategories = procedures.map(p => p.category);
    return ["Todos", ...Array.from(new Set(allCategories))];
  }, []);

  const filteredProcedures = useMemo(() => {
    return procedures
      .filter(proc => activeCategory === "Todos" || proc.category === activeCategory)
      .filter(proc =>
        proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, activeCategory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Guia de Procedimentos</h1>
        <p className="text-muted-foreground">Checklists passo a passo para os principais procedimentos de enfermagem</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por procedimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap h-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filteredProcedures.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredProcedures.map((proc, index) => {
            const Icon = proc.icon;
            return (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="group hover:no-underline text-left">
                  <div className="flex items-center gap-4">
                    <Icon className={`h-6 w-6 ${proc.color} flex-shrink-0 transition-colors group-data-[state=open]:${proc.openColor}`} />
                    <div>
                      <h3 className="font-semibold text-lg">{proc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{proc.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div>
                    <h4 className="font-semibold text-primary mb-3">Materiais Essenciais</h4>
                    <div className="flex flex-wrap gap-2">
                      {proc.materials.map((material, i) => (
                        <Badge key={i} variant="secondary">{material}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-3">Passo a Passo</h4>
                    <ol className="space-y-3">
                      {proc.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span dangerouslySetInnerHTML={{ __html: step }} />
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Pontos Críticos</AlertTitle>
                    <AlertDescription>
                      {proc.observations}
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum procedimento encontrado para os filtros selecionados.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Procedures;