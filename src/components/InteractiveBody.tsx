import { cn } from "@/lib/utils";

interface BodyPart {
  id: string;
  name: string;
  value: number;
  path: string | string[];
}

const bodyParts: BodyPart[] = [
  { id: "head", name: "Cabeça", value: 9, path: "M60,5 A30,30 0 1,1 140,5 L140,45 A30,30 0 1,1 60,45 Z" },
  { id: "torsoFront", name: "Tronco Anterior", value: 18, path: "M65,50 h70 v80 h-70 Z" },
  { id: "leftArm", name: "Braço Esquerdo", value: 9, path: "M55,55 l-20,10 l-5,60 l20,-5 Z" },
  { id: "rightArm", name: "Braço Direito", value: 9, path: "M145,55 l20,10 l5,60 l-20,-5 Z" },
  { id: "genitalia", name: "Genitália", value: 1, path: "M90,130 l10,10 l10,-10 Z" },
  { id: "leftLeg", name: "Perna Esquerda", value: 18, path: "M65,130 h30 v80 h-30 Z" },
  { id: "rightLeg", name: "Perna Direita", value: 18, path: "M105,130 h30 v80 h-30 Z" },
  
  { id: "headBack", name: "Cabeça (Costas)", value: 0, path: "M260,5 A30,30 0 1,1 340,5 L340,45 A30,30 0 1,1 260,45 Z" },
  { id: "torsoBack", name: "Tronco Posterior", value: 18, path: "M265,50 h70 v80 h-70 Z" },
  { id: "leftArmBack", name: "Braço Esquerdo (Costas)", value: 0, path: "M255,55 l-20,10 l-5,60 l20,-5 Z" },
  { id: "rightArmBack", name: "Braço Direito (Costas)", value: 0, path: "M345,55 l20,10 l5,60 l-20,-5 Z" },
  { id: "leftLegBack", name: "Perna Esquerda (Costas)", value: 0, path: "M265,130 h30 v80 h-30 Z" },
  { id: "rightLegBack", name: "Perna Direita (Costas)", value: 0, path: "M305,130 h30 v80 h-30 Z" },
];

// Agrupando partes para clique único
const partGroups = [
    { id: 'head', parts: ['head', 'headBack'], value: 9 },
    { id: 'torsoFront', parts: ['torsoFront'], value: 18 },
    { id: 'torsoBack', parts: ['torsoBack'], value: 18 },
    { id: 'leftArm', parts: ['leftArm', 'leftArmBack'], value: 9 },
    { id: 'rightArm', parts: ['rightArm', 'rightArmBack'], value: 9 },
    { id: 'genitalia', parts: ['genitalia'], value: 1 },
    { id: 'leftLeg', parts: ['leftLeg', 'leftLegBack'], value: 18 },
    { id: 'rightLeg', parts: ['rightLeg', 'rightLegBack'], value: 18 },
];

interface InteractiveBodyProps {
  selectedParts: Record<string, boolean>;
  onSelectPart: (partId: string) => void;
}

export const InteractiveBody = ({ selectedParts, onSelectPart }: InteractiveBodyProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
        <text x="100" y="215" textAnchor="middle" className="text-sm font-semibold fill-foreground">Frente</text>
        <text x="300" y="215" textAnchor="middle" className="text-sm font-semibold fill-foreground">Costas</text>
        
        {partGroups.map(group => (
          <g key={group.id} onClick={() => onSelectPart(group.id)} className="cursor-pointer group">
            {group.parts.map(partId => {
              const part = bodyParts.find(p => p.id === partId);
              if (!part) return null;
              return (
                <path
                  key={part.id}
                  d={Array.isArray(part.path) ? part.path.join(' ') : part.path}
                  className={cn(
                    "stroke-muted-foreground stroke-1 transition-all group-hover:stroke-primary group-hover:stroke-2",
                    selectedParts[group.id] ? "fill-red-500" : "fill-muted"
                  )}
                />
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
};