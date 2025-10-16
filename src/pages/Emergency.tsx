import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FavoriteButton from "@/components/FavoriteButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "lucide-react";
import emergencyProtocolsData from "@/data/emergencies.json";

interface Profile {
  id: string;
}

interface ContentLine {
  text: string;
}

interface EmergencyItem {
  title: string;
  icon: keyof typeof LucideIcons;
  color: string;
  openColor: string;
  content: ContentLine[];
}

interface EmergencyCategory {
  category: string;
  color: string;
  items: EmergencyItem[];
}

const emergencyProtocols: EmergencyCategory[] = emergencyProtocolsData;

const Emergency = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', profile?.id, 'Protocolo de Emergência'],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', profile.id)
        .eq('item_type', 'Protocolo de Emergência');
      if (error) throw error;
      return data.map(f => f.item_id);
    },
    enabled: !!profile,
  });

  const favoriteSet = useMemo(() => new Set(favoritesData || []), [favoritesData]);

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
  }, [searchTerm, emergencyProtocols]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Urgências e Emergências</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/emergency"
              itemType="Guia"
              itemTitle="Guia de Emergências"
              isInitiallyFavorited={favoriteSet.has("/emergency")}
              isLoading={isLoadingFavorites}
            />
          )}
        </div>
        <p className="text-muted-foreground">Protocolos rápidos e diretos para atendimento de emergência</p>
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
                    const Icon = LucideIcons[item.icon] as LucideIcons.LucideIcon;
                    const itemId = `/emergency#${item.title.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                      <AccordionItem value={item.title} key={item.title} className="border rounded-lg px-4 bg-card shadow-sm">
                        <div className="flex items-center">
                          <AccordionTrigger className="flex-1 group hover:no-underline text-left py-0">
                            <div className="flex items-center gap-3 py-4">
                              {Icon && <Icon className={`h-5 w-5 ${item.color} transition-colors group-data-[state=open]:${item.openColor}`} />}
                              <span className="font-semibold text-left">{item.title}</span>
                            </div>
                          </AccordionTrigger>
                          <div className="pl-4">
                            {profile && (
                              <FavoriteButton
                                userId={profile.id}
                                itemId={itemId}
                                itemType="Protocolo de Emergência"
                                itemTitle={item.title}
                                isInitiallyFavorited={favoriteSet.has(itemId)}
                                isLoading={isLoadingFavorites}
                              />
                            )}
                          </div>
                        </div>
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