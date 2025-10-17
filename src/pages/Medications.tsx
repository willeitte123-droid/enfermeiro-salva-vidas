import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Syringe, Search, CheckCircle, XCircle, AlertTriangle, Pill, Beaker } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FavoriteButton from "@/components/FavoriteButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import medicationsData from "@/data/medications.json";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface Profile {
  id: string;
}

interface Medication {
  name: string;
  activeIngredient: string;
  indication: string;
  dose: string;
  administration: string;
  dilution: string;
  contraindication: string;
  adverseEffects: string;
  category: string;
}

const medications: Medication[] = medicationsData;

const Medications = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Guia', title: 'Guia Rápido de Medicamentos', path: '/medications', icon: 'Syringe' });
  }, [addActivity]);

  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', profile?.id, 'Medicamento'],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', profile.id)
        .eq('item_type', 'Medicamento');
      if (error) throw error;
      return data.map(f => f.item_id);
    },
    enabled: !!profile,
  });

  const favoriteSet = useMemo(() => new Set(favoritesData || []), [favoritesData]);

  const filteredMedications = useMemo(() => {
    return medications.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, medications]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Guia Rápido de Medicamentos</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/medications"
              itemType="Guia"
              itemTitle="Guia de Medicamentos"
              isInitiallyFavorited={favoriteSet.has("/medications")}
              isLoading={isLoadingFavorites}
            />
          )}
        </div>
        <p className="text-muted-foreground">Principais medicações injetáveis, indicações e cuidados essenciais</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, princípio ativo ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredMedications.length > 0 ? (
        <div className="space-y-4">
          {filteredMedications.map((medication, index) => {
            const itemId = `/medications#${medication.name.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <Accordion type="single" collapsible key={index}>
                <AccordionItem value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
                  <div className="flex items-center">
                    <AccordionTrigger className="flex-1 group hover:no-underline text-left py-0">
                      <div className="flex items-center gap-3 py-4">
                        <Syringe className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-left">{medication.name}</p>
                          <p className="text-sm text-muted-foreground text-left mt-1">{medication.activeIngredient}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center pl-4">
                      <Badge className="flex-shrink-0 bg-green-600 text-white hover:bg-green-700">{medication.category}</Badge>
                      {profile && (
                        <FavoriteButton
                          userId={profile.id}
                          itemId={itemId}
                          itemType="Medicamento"
                          itemTitle={medication.name}
                          isInitiallyFavorited={favoriteSet.has(itemId)}
                          isLoading={isLoadingFavorites}
                          className="ml-2"
                        />
                      )}
                    </div>
                  </div>
                  <AccordionContent className="pt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-green-700 mb-1">Indicação</h4>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.indication }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Pill className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-cyan-700 mb-1">Dose Usual</h4>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.dose }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Syringe className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-blue-700 mb-1">Administração</h4>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.administration }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Beaker className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-indigo-700 mb-1">Diluição e Compatibilidade</h4>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.dilution }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-red-700 mb-1">Contraindicação</h4>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.contraindication }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-amber-700 mb-1">Efeitos Adversos / Cuidados</h4>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.adverseEffects }} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum medicamento encontrado para "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Medications;