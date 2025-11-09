import { cn } from "@/lib/utils";

const interactiveParts = [
  { id: 'head', name: 'Cabeça (9%)', percentage: '9%', paths: [
    "M 50,35 C 50,15 70,15 70,35 C 70,45 65,48 60,48 C 55,48 50,45 50,35 Z",
    "M 130,35 C 130,15 150,15 150,35 C 150,45 145,48 140,48 C 135,48 130,45 130,35 Z"
  ], labelPositions: [{ x: 60, y: 30 }, { x: 140, y: 30 }] },
  { id: 'torsoFront', name: 'Tronco Anterior (18%)', percentage: '18%', paths: [
    "M 45,50 L 75,50 L 80,110 L 40,110 Z"
  ], labelPositions: [{ x: 60, y: 80 }] },
  { id: 'torsoBack', name: 'Tronco Posterior (18%)', percentage: '18%', paths: [
    "M 125,50 L 155,50 L 160,110 L 120,110 Z"
  ], labelPositions: [{ x: 140, y: 80 }] },
  { id: 'leftArmFront', name: 'Braço Esq. Anterior (4.5%)', percentage: '4.5%', paths: [
    "M 45,52 L 30,60 L 25,105 L 40,108 Z"
  ], labelPositions: [{ x: 33, y: 85 }] },
  { id: 'leftArmBack', name: 'Braço Esq. Posterior (4.5%)', percentage: '4.5%', paths: [
    "M 125,52 L 110,60 L 105,105 L 120,108 Z"
  ], labelPositions: [{ x: 117, y: 85 }] },
  { id: 'rightArmFront', name: 'Braço Dir. Anterior (4.5%)', percentage: '4.5%', paths: [
    "M 75,52 L 90,60 L 95,105 L 80,108 Z"
  ], labelPositions: [{ x: 87, y: 85 }] },
  { id: 'rightArmBack', name: 'Braço Dir. Posterior (4.5%)', percentage: '4.5%', paths: [
    "M 155,52 L 170,60 L 175,105 L 160,108 Z"
  ], labelPositions: [{ x: 163, y: 85 }] },
  { id: 'genitalia', name: 'Genitália (1%)', percentage: '1%', paths: [
    "M 57,110 L 63,110 L 60,120 Z"
  ], labelPositions: [{ x: 60, y: 115 }] },
  { id: 'leftLegFront', name: 'Perna Esq. Anterior (9%)', percentage: '9%', paths: [
    "M 40,112 L 58,112 L 55,200 L 35,200 Z"
  ], labelPositions: [{ x: 48, y: 160 }] },
  { id: 'leftLegBack', name: 'Perna Esq. Posterior (9%)', percentage: '9%', paths: [
    "M 120,112 L 138,112 L 135,200 L 115,200 Z"
  ], labelPositions: [{ x: 128, y: 160 }] },
  { id: 'rightLegFront', name: 'Perna Dir. Anterior (9%)', percentage: '9%', paths: [
    "M 62,112 L 80,112 L 85,200 L 65,200 Z"
  ], labelPositions: [{ x: 72, y: 160 }] },
  { id: 'rightLegBack', name: 'Perna Dir. Posterior (9%)', percentage: '9%', paths: [
    "M 142,112 L 160,112 L 165,200 L 145,200 Z"
  ], labelPositions: [{ x: 152, y: 160 }] },
];

interface InteractiveBodyProps {
  selectedParts: Record<string, boolean>;
  onSelectPart: (partId: string) => void;
}

export const InteractiveBody = ({ selectedParts, onSelectPart }: InteractiveBodyProps) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
        {/* Render paths */}
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

        {/* Render text labels on top */}
        {interactiveParts.map(part => (
          <g key={`${part.id}-label`} className="pointer-events-none">
            {part.labelPositions.map((pos, index) => (
              <text
                key={index}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                className={cn(
                  "text-[10px] font-bold",
                  selectedParts[part.id] ? "fill-white" : "fill-foreground/70"
                )}
              >
                {part.percentage}
              </text>
            ))}
          </g>
        ))}

        <text x="60" y="215" textAnchor="middle" className="text-sm font-semibold fill-foreground">Frente</text>
        <text x="140" y="215" textAnchor="middle" className="text-sm font-semibold fill-foreground">Costas</text>
      </svg>
    </div>
  );
};