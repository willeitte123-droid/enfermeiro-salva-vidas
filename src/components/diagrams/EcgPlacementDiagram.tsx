import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EcgPlacementDiagram = () => (
  <Card className="mt-4 bg-muted/50">
    <CardHeader>
      <CardTitle className="text-base">Diagrama: Posições Precordiais</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center">
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[250px]">
        {/* Torso shape */}
        <path d="M60,0 C60,15 75,20 100,20 C125,20 140,15 140,0 L160,0 L200,40 L190,220 L10,220 L0,40 L40,0 Z" className="fill-amber-100 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" />
        {/* Clavicles */}
        <path d="M65,25 C80,35 120,35 135,25" fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="4" strokeLinecap="round" />
        {/* Sternum */}
        <path d="M100,25 L100,120" fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="8" strokeLinecap="round" />
        {/* Rib lines */}
        <path d="M45,90 C65,85 135,85 155,90" fill="none" className="stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" /><text x="35" y="90" className="text-[8px] fill-muted-foreground">4º EIC</text>
        <path d="M40,110 C60,105 140,105 160,110" fill="none" className="stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" /><text x="30" y="110" className="text-[8px] fill-muted-foreground">5º EIC</text>
        {/* Electrode placements */}
        <g><circle cx="90" cy="80" r="6" className="fill-primary"/><text x="90" y="70" textAnchor="middle" className="fill-foreground text-[8px] font-bold">V1</text></g>
        <g><circle cx="110" cy="80" r="6" className="fill-primary"/><text x="110" y="70" textAnchor="middle" className="fill-foreground text-[8px] font-bold">V2</text></g>
        <g><circle cx="125" cy="100" r="6" className="fill-primary"/><text x="135" y="95" textAnchor="middle" className="fill-foreground text-[8px] font-bold">V4</text></g>
        <g><circle cx="117.5" cy="90" r="6" className="fill-primary"/><text x="120" y="110" textAnchor="middle" className="fill-foreground text-[8px] font-bold">V3</text></g>
        <g><circle cx="145" cy="105" r="6" className="fill-primary"/><text x="155" y="100" textAnchor="middle" className="fill-foreground text-[8px] font-bold">V5</text></g>
        <g><circle cx="165" cy="110" r="6" className="fill-primary"/><text x="175" y="105" textAnchor="middle" className="fill-foreground text-[8px] font-bold">V6</text></g>
      </svg>
    </CardContent>
  </Card>
);

export default EcgPlacementDiagram;