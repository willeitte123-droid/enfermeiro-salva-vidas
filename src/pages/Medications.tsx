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
      <div className="text-center px-2">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Guia de Medicamentos</h1>
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
        <p className="text-sm sm:text-base text-muted-foreground">Principais medicações injetáveis, indicações e cuidados essenciais</p>
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
                <AccordionItem value={`item-${index}`} className="border rounded-lg px-3 sm:px-4 bg-card shadow-sm">
                  <div className="flex items-start sm:items-center py-3 sm:py-0">
                    <AccordionTrigger className="flex-1 group hover:no-underline text-left py-0 sm:py-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full">
                        <Syringe className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 sm:mt-0 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base sm:text-lg leading-tight">{medication.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">{medication.activeIngredient}</p>
                          {/* Badge visível apenas no mobile, dentro do trigger */}
                          <div className="sm:hidden mt-2">
                            <Badge className="bg-green-600 text-white hover:bg-green-700 text-[10px] px-2 py-0.5 font-normal truncate max-w-full inline-block">
                              {medication.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Badge e Favorito no Desktop */}
                    <div className="hidden sm:flex items-center pl-4 shrink-0">
                      <Badge className="bg-green-600 text-white hover:bg-green-700 whitespace-nowrap mr-3">
                        {medication.category}
                      </Badge>
                      {profile && (
                        <FavoriteButton
                          userId={profile.id}
                          itemId={itemId}
                          itemType="Medicamento"
                          itemTitle={medication.name}
                          isInitiallyFavorited={favoriteSet.has(itemId)}
                          isLoading={isLoadingFavorites}
                        />
                      )}
                    </div>

                    {/* Botão Favorito no Mobile (Badge já está no trigger) */}
                    <div className="sm:hidden pl-2 pt-1">
                      {profile && (
                        <FavoriteButton
                          userId={profile.id}
                          itemId={itemId}
                          itemType="Medicamento"
                          itemTitle={medication.name}
                          isInitiallyFavorited={favoriteSet.has(itemId)}
                          isLoading={isLoadingFavorites}
                        />
                      )}
                    </div>
                  </div>

                  <AccordionContent className="pt-4 space-y-4 border-t border-border/40 mt-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-green-700 mb-1">Indicação</h4>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: medication.indication }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Pill className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-cyan-700 mb-1">Dose Usual</h4>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: medication.dose }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Syringe className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-blue-700 mb-1">Administração</h4>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: medication.administration }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Beaker className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-indigo-700 mb-1">Diluição e Compatibilidade</h4>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: medication.dilution }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-red-700 mb-1">Contraindicação</h4>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: medication.contraindication }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-amber-700 mb-1">Efeitos Adversos / Cuidados</h4>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: medication.adverseEffects }} />
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