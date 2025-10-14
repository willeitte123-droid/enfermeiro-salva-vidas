import { cn } from "@/lib/utils";

const interactiveParts = [
  { id: 'head', name: 'Cabeça (9%)', paths: [
    // Front head
    "M 50,35 C 50,15 70,15 70,35 C 70,45 65,48 60,48 C 55,48 50,45 50,35 Z",
    // Back head
    "M 130,35 C 130,15 150,15 150,35 C 150,45 145,48 140,48 C 135,48 130,45 130,35 Z"
  ]},
  { id: 'torsoFront', name: 'Tronco Anterior (18%)', paths: [
    "M 45,50 L 75,50 L 80,110 L 40,110 Z"
  ]},
  { id: 'torsoBack', name: 'Tronco Posterior (18%)', paths: [
    "M 125,50 L 155,50 L 160,110 L 120,110 Z"
  ]},
  { id: 'leftArm', name: 'Braço Esquerdo (9%)', paths: [
    // Front left arm
    "M 45,52 L 30,60 L 25,105 L 40,108 Z",
    // Back left arm
    "M 125,52 L 110,60 L 105,105 L 120,108 Z"
  ]},
  { id: 'rightArm', name: 'Braço Direito (9%)', paths: [
    // Front right arm
    "M 75,52 L 90,60 L 95,105 L 80,108 Z",
    // Back right arm
    "M 155,52 L 170,60 L 175,105 L 160,108 Z"
  ]},
  { id: 'genitalia', name: 'Genitália (1%)', paths: [
    "M 57,110 L 63,110 L 60,120 Z"
  ]},
  { id: 'leftLeg', name: 'Perna Esquerda (18%)', paths: [
    // Front left leg
    "M 40,112 L 58,112 L 55,200 L 35,200 Z",
    // Back left leg
    "M 120,112 L 138,112 L 135,200 L 115,200 Z"
  ]},
  { id: 'rightLeg', name: 'Perna Direita (18%)', paths: [
    // Front right leg
    "M 62,112 L 80,112 L 85,200 L 65,200 Z",
    // Back right leg
    "M 142,112 L 160,112 L 165,200 L 145,200 Z"
  ]}
];

interface InteractiveBodyProps {
  selectedParts: Record<string, boolean>;
  onSelectPart: (partId: string) => void;
}

export const InteractiveBody = ({ selectedParts, onSelectPart }: InteractiveBodyProps) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
        {interactiveParts.map(part => (
          <g key={part.id} onClick={() => onSelectPart(part.id)} className="cursor-pointer group">
            {part.paths.map((pathData, index) => (
              <path
                key={index}
                d={pathData}
                className={cn(
                  "stroke-muted-foreground/50 stroke-[0.5] transition-all group-hover:stroke-primary group-hover:stroke-2",
                  selectedParts[part.id] ? "fill-red-500" : "fill-muted"
                )}
              />
            ))}
          </g>
        ))}
        <text x="60" y="215" textAnchor="middle" className="text-sm font-semibold fill-foreground">Frente</text>
        <text x="140" y="215" textAnchor="middle" className="text-sm font-semibold fill-foreground">Costas</text>
      </svg>
    </div>
  );
};