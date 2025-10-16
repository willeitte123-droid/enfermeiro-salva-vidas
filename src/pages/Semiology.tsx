import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, BookOpen } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import * as LucideIcons from "lucide-react";
import assessmentData from "@/data/assessment.json";

interface Profile {
  id: string;
}

interface AnamnesisStep {
  title: string;
  description: string;
}

interface PropaedeuticMethod {
  name: string;
  icon: keyof typeof LucideIcons;
  description: string;
}

interface AssessmentDetail {
  method: string;
  technique: string;
  findings: string[];
}

interface SystemAssessment {
  id: string;
  name: string;
  icon: keyof typeof LucideIcons;
  color: string;
  details: AssessmentDetail[];
}

const { anamnesisSteps, propaedeuticMethods, systemAssessments }: {
  anamnesisSteps: AnamnesisStep[];
  propaedeuticMethods: PropaedeuticMethod[];
  systemAssessments: SystemAssessment[];
} = assessmentData;

const Semiology = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="w-10 flex-shrink-0" /> {/* Spacer */}
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Guia de Semiologia
          </h1>
          <p className="text-muted-foreground">A arte de identificar sinais e sintomas através do exame clínico.</p>
        </div>
        <div className="w-10 flex-shrink-0">
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/semiology"
              itemType="Guia"
              itemTitle="Guia de Semiologia"
            />
          )}
        </div>
      </div>

      <Card className="bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-violet-700 dark:text-violet-300">
            <BookOpen />
            Anamnese: A Entrevista Clínica
          </CardTitle>
          <CardDescription>A base para um diagnóstico preciso começa com uma boa história.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anamnesisSteps.map(step => (
            <div key={step.title} className="p-4 bg-background rounded-lg shadow-sm">
              <h3 className="font-semibold text-primary">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exame Físico: Avaliação por Sistemas</CardTitle>
          <CardDescription>Aplique os métodos propedêuticos para uma avaliação completa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {propaedeuticMethods.map(method => {
              const Icon = LucideIcons[method.icon] as LucideIcons.LucideIcon;
              return (
                <div key={method.name} className="p-4 bg-muted rounded-lg text-center">
                  {Icon && <Icon className="h-8 w-8 text-primary mx-auto mb-2" />}
                  <h4 className="font-semibold">{method.name}</h4>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
              );
            })}
          </div>

          <Tabs defaultValue="respiratory" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              {systemAssessments.map(system => (
                <TabsTrigger key={system.id} value={system.id}>{system.name}</TabsTrigger>
              ))}
            </TabsList>
            {systemAssessments.map(system => {
              const Icon = LucideIcons[system.icon] as LucideIcons.LucideIcon;
              return (
                <TabsContent key={system.id} value={system.id} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-3 ${system.color}`}>
                        {Icon && <Icon />} {system.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible defaultValue={system.details[0].method}>
                        {system.details.map(detail => (
                          <AccordionItem key={detail.method} value={detail.method}>
                            <AccordionTrigger className="font-semibold">{detail.method}</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <p className="text-sm text-muted-foreground italic">{detail.technique}</p>
                              <div>
                                <h5 className="font-semibold text-sm mb-2">Principais Achados:</h5>
                                <ul className="space-y-2">
                                  {detail.findings.map((finding, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{finding}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Semiology;