import { cn } from "@/lib/utils";

const interactiveParts = [
  { id: 'head', name: 'Cabeça (9%)', paths: ["M62.8,5.3c-9.5,0-17.2,7.7-17.2,17.2s7.7,17.2,17.2,17.2s17.2-7.7,17.2-17.2S72.3,5.3,62.8,5.3z", "M137.2,5.3c-9.5,0-17.2,7.7-17.2,17.2s7.7,17.2,17.2,17.2s17.2-7.7,17.2-17.2S146.7,5.3,137.2,5.3z"] },
  { id: 'torsoFront', name: 'Tronco Anterior (18%)', paths: ["M45,42.5h35.5v65H45z"] },
  { id: 'torsoBack', name: 'Tronco Posterior (18%)', paths: ["M120,42.5h35.5v65H120z"] },
  { id: 'leftArm', name: 'Braço Esquerdo (9%)', paths: ["M42,45.5c-4.5,1.8-8.8,4-12.7,6.7c-4,2.7-7.2,5.9-9.7,9.5c-2.5,3.6-4.3,7.5-5,11.7c-0.7,4.2-0.2,8.6,1.5,12.7c1.7,4.1,4.4,7.9,8,11c3.6,3.2,8,5.6,12.8,7.3l-1.4,2.8c-5.1-1.8-9.8-4.4-13.7-7.8c-3.9-3.4-6.8-7.4-8.5-11.8c-1.7-4.4-2.3-9.2-1.5-13.9c0.8-4.7,2.6-9.2,5.4-13.2c2.8-4,6.2-7.5,10.5-10.4c4.3-2.9,9-5.3,13.8-7.2L42,45.5z", "M117,45.5c-4.5,1.8-8.8,4-12.7,6.7c-4,2.7-7.2,5.9-9.7,9.5c-2.5,3.6-4.3,7.5-5,11.7c-0.7,4.2-0.2,8.6,1.5,12.7c1.7,4.1,4.4,7.9,8,11c3.6,3.2,8,5.6,12.8,7.3l-1.4,2.8c-5.1-1.8-9.8-4.4-13.7-7.8c-3.9-3.4-6.8-7.4-8.5-11.8c-1.7-4.4-2.3-9.2-1.5-13.9c0.8-4.7,2.6-9.2,5.4-13.2c2.8-4,6.2-7.5,10.5-10.4c4.3-2.9,9-5.3,13.8-7.2L117,45.5z"] },
  { id: 'rightArm', name: 'Braço Direito (9%)', paths: ["M83.5,45.5c4.5,1.8,8.8,4,12.7,6.7c4,2.7,7.2,5.9,9.7,9.5c2.5,3.6,4.3,7.5,5,11.7c0.7,4.2,0.2,8.6-1.5,12.7c-1.7,4.1-4.4,7.9-8,11c-3.6,3.2-8,5.6-12.8,7.3l1.4,2.8c5.1-1.8,9.8-4.4,13.7-7.8c3.9-3.4,6.8-7.4,8.5-11.8c1.7-4.4,2.3-9.2,1.5-13.9c-0.8-4.7-2.6-9.2-5.4-13.2c-2.8-4-6.2-7.5-10.5-10.4c-4.3-2.9,9-5.3,13.8-7.2L83.5,45.5z", "M158.5,45.5c4.5,1.8,8.8,4,12.7,6.7c4,2.7,7.2,5.9,9.7,9.5c2.5,3.6,4.3,7.5,5,11.7c0.7,4.2,0.2,8.6-1.5,12.7c-1.7,4.1-4.4,7.9-8,11c-3.6,3.2-8,5.6-12.8,7.3l1.4,2.8c5.1-1.8,9.8-4.4,13.7-7.8c3.9-3.4,6.8-7.4,8.5-11.8c1.7-4.4,2.3-9.2,1.5-13.9c-0.8-4.7-2.6-9.2-5.4-13.2c-2.8-4,6.2-7.5,10.5-10.4c4.3-2.9,9-5.3,13.8-7.2L158.5,45.5z"] },
  { id: 'genitalia', name: 'Genitália (1%)', paths: ["M58,107.5l5,10l5-10H58z"] },
  { id: 'leftLeg', name: 'Perna Esquerda (18%)', paths: ["M45,110.5h15.5v90H45z", "M120,110.5h15.5v90H120z"] },
  { id: 'rightLeg', name: 'Perna Direita (18%)', paths: ["M65,110.5h15.5v90H65z", "M140,110.5h15.5v90H140z"] },
];

interface InteractiveBodyProps {
  selectedParts: Record<string, boolean>;
  onSelectPart: (partId: string) => void;
}

export const InteractiveBody = ({ selectedParts, onSelectPart }: InteractiveBodyProps) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
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
        <text x="62.5" y="235" textAnchor="middle" className="text-sm font-semibold fill-foreground">Frente</text>
        <text x="137.5" y="235" textAnchor="middle" className="text-sm font-semibold fill-foreground">Costas</text>
      </svg>
    </div>
  );
};