import { cn } from "@/lib/utils";

const bodyParts = [
  { id: 'head', name: 'Cabeça (9%)', frontPath: "M45.6,24.3c0-9.5,7.7-17.2,17.2-17.2s17.2,7.7,17.2,17.2c0,8.9-6.8,16.3-15.5,17.1v3.5h-3.4v-3.5C52.4,40.6,45.6,33.2,45.6,24.3z", backPath: "M125.6,24.3c0-9.5,7.7-17.2,17.2-17.2s17.2,7.7,17.2,17.2c0,8.9-6.8,16.3-15.5,17.1v3.5h-3.4v-3.5C132.4,40.6,125.6,33.2,125.6,24.3z", labelPosition: { x: 63, y: 30 } },
  { id: 'torsoFront', name: 'Tronco Anterior (18%)', frontPath: "M43.4,48.4h20v65h-20z M63.4,48.4h20v65h-20z", backPath: "", labelPosition: { x: 63, y: 85 } },
  { id: 'torsoBack', name: 'Tronco Posterior (18%)', frontPath: "", backPath: "M123.4,48.4h20v65h-20z M143.4,48.4h20v65h-20z", labelPosition: { x: 143, y: 85 } },
  { id: 'leftArm', name: 'Braço Esquerdo (9%)', frontPath: "M42.1,50.3c-5.2,2.1-10.1,4.6-14.5,7.7c-4.4,3-8.2,6.5-11.1,10.4c-3,3.9-4.9,8.2-5.6,12.8c-0.7,4.6-0.2,9.4,1.5,13.9c1.7,4.5,4.5,8.6,8.2,12.1c3.7,3.5,8.2,6.3,13.2,8.2l-1.6,3.1c-5.3-2-10-4.9-13.9-8.6c-4-3.7-7-8-8.8-12.8c-1.8-4.8-2.4-10-1.6-15.1c0.8-5.1,2.8-10,6-14.3c3.2-4.3,7.3-8.1,12.1-11.4c4.8-3.3,10.1-5.9,15.7-8.1L42.1,50.3z", backPath: "M122.1,50.3c-5.2,2.1-10.1,4.6-14.5,7.7c-4.4,3-8.2,6.5-11.1,10.4c-3,3.9-4.9,8.2-5.6,12.8c-0.7,4.6-0.2,9.4,1.5,13.9c1.7,4.5,4.5,8.6,8.2,12.1c3.7,3.5,8.2,6.3,13.2,8.2l-1.6,3.1c-5.3-2-10-4.9-13.9-8.6c-4-3.7-7-8-8.8-12.8c-1.8-4.8-2.4-10-1.6-15.1c0.8-5.1,2.8-10,6-14.3c3.2-4.3,7.3-8.1,12.1-11.4c4.8-3.3,10.1-5.9,15.7-8.1L122.1,50.3z", labelPosition: { x: 20, y: 90 } },
  { id: 'rightArm', name: 'Braço Direito (9%)', frontPath: "M84.8,50.3c5.2,2.1,10.1,4.6,14.5,7.7c4.4,3,8.2,6.5,11.1,10.4c3,3.9,4.9,8.2,5.6,12.8c0.7,4.6,0.2,9.4-1.5,13.9c-1.7,4.5-4.5,8.6-8.2,12.1c-3.7,3.5-8.2,6.3-13.2,8.2l1.6,3.1c5.3-2,10-4.9,13.9-8.6c4-3.7,7-8,8.8-12.8c1.8-4.8,2.4-10,1.6-15.1c-0.8-5.1-2.8-10-6-14.3c-3.2-4.3-7.3-8.1-12.1-11.4c-4.8-3.3-10.1-5.9-15.7-8.1L84.8,50.3z", backPath: "M164.8,50.3c5.2,2.1,10.1,4.6,14.5,7.7c4.4,3,8.2,6.5,11.1,10.4c3,3.9,4.9,8.2,5.6,12.8c0.7,4.6,0.2,9.4-1.5,13.9c-1.7,4.5-4.5,8.6-8.2,12.1c-3.7,3.5-8.2,6.3-13.2,8.2l1.6,3.1c5.3-2,10-4.9,13.9-8.6c4-3.7,7-8,8.8-12.8c1.8-4.8,2.4-10,1.6-15.1c-0.8-5.1-2.8-10-6-14.3c-3.2-4.3-7.3-8.1-12.1-11.4c-4.8-3.3-10.1-5.9-15.7-8.1L164.8,50.3z", labelPosition: { x: 106, y: 90 } },
  { id: 'genitalia', name: 'Genitália (1%)', frontPath: "M63.4,113.4h20v15h-20z", backPath: "", labelPosition: { x: 63, y: 123 } },
  { id: 'leftLeg', name: 'Perna Esquerda (18%)', frontPath: "M43.4,128.4h20v80h-20z", backPath: "M123.4,128.4h20v80h-20z", labelPosition: { x: 43, y: 170 } },
  { id: 'rightLeg', name: 'Perna Direita (18%)', frontPath: "M63.4,128.4h20v80h-20z", backPath: "M143.4,128.4h20v80h-20z", labelPosition: { x: 63, y: 170 } },
];

interface InteractiveBodyProps {
  selectedParts: Record<string, boolean>;
  onSelectPart: (partId: string) => void;
}

export const InteractiveBody = ({ selectedParts, onSelectPart }: InteractiveBodyProps) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
        <text x="50" y="215" textAnchor="middle" className="text-sm font-semibold fill-foreground">Frente</text>
        <text x="150" y="215" textAnchor="middle" className="text-sm font-semibold fill-foreground">Costas</text>
        
        {bodyParts.map(part => (
          <g key={part.id} onClick={() => onSelectPart(part.id)} className="cursor-pointer group">
            {part.frontPath && (
              <path
                d={part.frontPath}
                className={cn(
                  "stroke-muted-foreground stroke-[0.5] transition-all group-hover:fill-red-500/50",
                  selectedParts[part.id] ? "fill-red-500" : "fill-muted"
                )}
              />
            )}
            {part.backPath && (
              <path
                d={part.backPath}
                className={cn(
                  "stroke-muted-foreground stroke-[0.5] transition-all group-hover:fill-red-500/50",
                  selectedParts[part.id] ? "fill-red-500" : "fill-muted"
                )}
              />
            )}
            {selectedParts[part.id] && (
              <text
                x={part.labelPosition.x}
                y={part.labelPosition.y}
                textAnchor="middle"
                className="text-[8px] font-bold fill-white pointer-events-none"
              >
                {part.name.match(/\(([^)]+)\)/)?.[1]}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};