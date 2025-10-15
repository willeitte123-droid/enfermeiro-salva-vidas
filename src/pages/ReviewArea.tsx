import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Library, CheckCircle2, Loader2 } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useQuery } from "@tanstack/react-query";
import * as LucideIcons from "lucide-react";

interface Profile {
  id: string;
}

interface ReviewTopic {
  id: string;
  title: string;
  icon: keyof typeof LucideIcons;
  color: string;
  summary: string;
  details: {
    subtitle: string;
    points: string[];
  }[];
}

const fetchReviewTopics = async (): Promise<ReviewTopic[]> => {
  const response = await fetch('/data/reviewTopics.json');
  if (!response.ok) {
    throw new Error('Não foi possível carregar os tópicos de revisão.');
  }
  return response.json();
};

const ReviewArea = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();

  const { data: reviewTopics = [], isLoading: isLoadingTopics } = useQuery({
    queryKey: ['reviewTopics'],
    queryFn: fetchReviewTopics,
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Área de Revisão</h1>
          <p className="text-muted-foreground">Resumos rápidos e diretos dos principais temas para seus estudos e prática clínica.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/review-area"
            itemType="Guia"
            itemTitle="Área de Revisão"
          />
        )}
      </div>

      {isLoadingTopics ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {reviewTopics.map((topic) => {
            const Icon = LucideIcons[topic.icon] as LucideIcons.LucideIcon;
            return (
              <Card key={topic.id} className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className={`flex items-center gap-3 ${topic.color}`}>
                      {Icon && <Icon />} {topic.title}
                    </CardTitle>
                    {profile && (
                      <FavoriteButton
                        userId={profile.id}
                        itemId={`/review-area#${topic.id}`}
                        itemType="Tópico de Revisão"
                        itemTitle={topic.title}
                      />
                    )}
                  </div>
                  <CardDescription>{topic.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {topic.details.map((detail, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="font-semibold">{detail.subtitle}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-3 pt-2">
                            {detail.points.map((point, pIndex) => (
                              <li key={pIndex} className="flex items-start gap-3 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span dangerouslySetInnerHTML={{ __html: point }} />
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewArea;