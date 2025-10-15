import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import FavoriteButton from "@/components/FavoriteButton";
import { emergencyProtocols } from "@/data/emergencies";

interface Profile {
  id: string;
}

const Emergency = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProtocols = useMemo(() => {
    if (!searchTerm) {
      return emergencyProtocols;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return emergencyProtocols
      .map(category => {
        const filteredItems = category.items.filter(
          item =>
            item.title.toLowerCase().includes(lowercasedFilter) ||
            item.content.some(c => c.text.toLowerCase().includes(lowercasedFilter))
        );
        return { ...category, items: filteredItems };
      })
      .filter(category => category.items.length > 0);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Urgências e Emergências</h1>
          <p className="text-muted-foreground">Protocolos rápidos e diretos para atendimento de emergência</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/emergency"
            itemType="Guia"
            itemTitle="Guia de Emergências"
          />
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por emergência (ex: PCR, AVC, IAM...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Atenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive/90">
            Este é um guia de referência rápida. Sempre siga os protocolos institucionais e busque 
            capacitação contínua (BLS/ACLS).
          </p>
        </CardContent>
      </Card>

      {filteredProtocols.length > 0 ? (
        <div className="space-y-6">
          {filteredProtocols.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className={category.color}>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <AccordionItem value={item.title} key={item.title} className="border rounded-lg px-4 bg-card shadow-sm">
                        <AccordionTrigger className="group hover:no-underline text-left">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <Icon className={`h-5 w-5 ${item.color} transition-colors group-data-[state=open]:${item.openColor}`} />
                              <span className="font-semibold text-left">{item.title}</span>
                            </div>
                            {profile && (
                              <FavoriteButton
                                userId={profile.id}
                                itemId={`/emergency#${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                                itemType="Protocolo de Emergência"
                                itemTitle={item.title}
                                className="mr-2"
                              />
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-3">
                          {item.content.map((line, index) => (
                            <div key={index} className="flex items-start gap-3 text-sm" dangerouslySetInnerHTML={{ __html: line.text }} />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum protocolo encontrado para "{searchTerm}".
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Emergency;