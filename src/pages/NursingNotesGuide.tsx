import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Pen, User } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import * as LucideIcons from "lucide-react";
import nursingNotesData from "@/data/nursingNotes.json";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface Profile {
  id: string;
}

const NursingNotesGuide = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Guia', title: 'Anotações e Evolução', path: '/nursing-notes', icon: 'BookText' });
  }, [addActivity]);

  const { pageTitle, pageDescription, keyDifferences, bestPractices, annotationExamples, soapieModel } = nursingNotesData;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">{pageTitle}</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/nursing-notes"
              itemType="Guia"
              itemTitle="Anotações e Evolução"
            />
          )}
        </div>
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{keyDifferences.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300"><Pen className="h-5 w-5" />{keyDifferences.annotation.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Quem faz?</strong> {keyDifferences.annotation.who}</p>
              <p><strong>O que é?</strong> {keyDifferences.annotation.what}</p>
              <p><strong>Quando?</strong> {keyDifferences.annotation.when}</p>
              <p><strong>Por quê?</strong> {keyDifferences.annotation.why}</p>
              <p><strong>Como?</strong> {keyDifferences.annotation.how}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300"><User className="h-5 w-5" />{keyDifferences.evolution.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Quem faz?</strong> {keyDifferences.evolution.who}</p>
              <p><strong>O que é?</strong> {keyDifferences.evolution.what}</p>
              <p><strong>Quando?</strong> {keyDifferences.evolution.when}</p>
              <p><strong>Por quê?</strong> {keyDifferences.evolution.why}</p>
              <p><strong>Como?</strong> {keyDifferences.evolution.how}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{bestPractices.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bestPractices.items.map((item, index) => {
            const Icon = LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                {Icon && <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />}
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{annotationExamples.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {annotationExamples.scenarios.map((scenario, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="font-semibold">{scenario.title}</AccordionTrigger>
                <AccordionContent className="pt-4">
                  <blockquote className="border-l-4 border-primary pl-4 italic text-sm text-muted-foreground">
                    {scenario.example}
                  </blockquote>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{soapieModel.title}</CardTitle>
          <CardDescription>{soapieModel.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {soapieModel.steps.map(step => (
              <div key={step.letter} className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{step.letter}</div>
                <div>
                  <h4 className="font-semibold">{step.name}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">{soapieModel.example.title}</CardTitle>
              <CardDescription className="text-sm">{soapieModel.example.scenario}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: soapieModel.example.content.replace(/\n/g, '<br />') }} />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default NursingNotesGuide;