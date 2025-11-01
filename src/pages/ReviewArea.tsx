import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Library, CheckCircle2 } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import * as LucideIcons from "lucide-react";
import reviewTopicsData from "@/data/reviewTopics.json";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { cn } from "@/lib/utils";

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

const reviewTopics: ReviewTopic[] = reviewTopicsData;

const ReviewArea = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Área de Revisão', path: '/review-area', icon: 'Library' });
  }, [addActivity]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Área de Revisão</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/review-area"
              itemType="Guia"
              itemTitle="Área de Revisão"
            />
          )}
        </div>
        <p className="text-muted-foreground">Resumos rápidos e diretos dos principais temas para seus estudos e prática clínica.</p>
      </div>

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
                      <AccordionTrigger className={cn("font-semibold", topic.color)}>{detail.subtitle}</AccordionTrigger>
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
    </div>
  );
};

export default ReviewArea;