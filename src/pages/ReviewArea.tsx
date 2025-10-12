import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { reviewTopics } from "@/data/reviewTopics";
import { Library, CheckCircle2 } from "lucide-react";

const ReviewArea = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Área de Revisão</h1>
        <p className="text-muted-foreground">Resumos rápidos e diretos dos principais temas para seus estudos e prática clínica.</p>
      </div>

      <div className="space-y-4">
        {reviewTopics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card key={topic.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 ${topic.color}`}>
                  <Icon /> {topic.title}
                </CardTitle>
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
    </div>
  );
};

export default ReviewArea;