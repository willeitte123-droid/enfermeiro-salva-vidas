import { useOutletContext } from "react-router-dom";
import FavoriteButton from "@/components/FavoriteButton";
import BMICalculator from "@/components/calculators/BMICalculator";
import PregnancyCalculator from "@/components/calculators/PregnancyCalculator";

interface Profile {
  id: string;
}

const IntegratedCalculators = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Calculadoras Integradas</h1>
          <p className="text-muted-foreground">Ferramentas rápidas para cálculos de IMC e gestacionais.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/tools/integrated-calculators"
            itemType="Ferramenta"
            itemTitle="Calculadoras Integradas"
          />
        )}
      </div>

      <BMICalculator />
      <PregnancyCalculator />
      
    </div>
  );
};

export default IntegratedCalculators;