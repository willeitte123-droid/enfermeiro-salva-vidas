import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookA } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import technicalTermsData from "@/data/technicalTerms.json";

interface Profile {
  id: string;
}

interface Term {
  term: string;
  definition: string;
}

interface TermGroup {
  letter: string;
  terms: Term[];
}

const TechnicalTerms = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Guia', title: 'Termos Técnicos', path: '/technical-terms', icon: 'BookA' });
  }, [addActivity]);

  const filteredTerms = useMemo(() => {
    if (!searchTerm) {
      return technicalTermsData;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return technicalTermsData
      .map(group => {
        const filtered = group.terms.filter(
          term =>
            term.term.toLowerCase().includes(lowercasedFilter) ||
            term.definition.toLowerCase().includes(lowercasedFilter)
        );
        return { ...group, terms: filtered };
      })
      .filter(group => group.terms.length > 0);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Termos Técnicos</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/technical-terms"
              itemType="Guia"
              itemTitle="Termos Técnicos"
            />
          )}
        </div>
        <p className="text-muted-foreground">Um glossário rápido para os termos mais comuns na prática de enfermagem.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por termo ou definição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTerms.length > 0 ? (
        <Accordion type="multiple" className="space-y-3">
          {filteredTerms.map((group) => (
            <AccordionItem key={group.letter} value={group.letter} className="border rounded-lg px-4 bg-card shadow-sm">
              <AccordionTrigger className="text-2xl font-bold text-primary hover:no-underline">
                {group.letter}
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <dl className="space-y-4">
                  {group.terms.map((term, index) => (
                    <div key={index}>
                      <dt className="font-semibold text-foreground">{term.term}</dt>
                      <dd className="text-sm text-muted-foreground ml-4">{term.definition}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum termo encontrado para "{searchTerm}".
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TechnicalTerms;