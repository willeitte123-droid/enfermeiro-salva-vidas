import { useOutletContext } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Baby } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import BMICalculator from "@/components/calculators/BMICalculator";
import PregnancyCalculator from "@/components/calculators/PregnancyCalculator";

interface Profile {
  id: string;
}

const IntegratedCalculators = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Calculadoras Integradas</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/tools/integrated-calculators"
              itemType="Ferramenta"
              itemTitle="Calculadoras Integradas"
            />
          )}
        </div>
        <p className="text-muted-foreground">Ferramentas rápidas para cálculos de IMC e gestacionais.</p>
      </div>

      <Tabs defaultValue="pregnancy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="pregnancy" className="py-2 font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-md">
            <Baby className="mr-2 h-4 w-4" />
            Calculadora Gestacional
          </TabsTrigger>
          <TabsTrigger value="imc" className="py-2 font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">
            <Scale className="mr-2 h-4 w-4" />
            Calculadora de IMC
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pregnancy" className="mt-4">
          <PregnancyCalculator />
        </TabsContent>
        <TabsContent value="imc" className="mt-4">
          <BMICalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegratedCalculators;