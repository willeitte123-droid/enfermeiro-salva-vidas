import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SngMeasurementDiagram = () => (
  <Card className="mt-4 bg-muted/50">
    <CardHeader>
      <CardTitle className="text-base">Diagrama: Medida da Sonda (NEX)</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center p-6">
      <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[200px]">
        {/* Realistic Profile Outline */}
        <path d="M152.6,24.4c-1.2-2.3-3.1-4.2-5.4-5.5c-7.5-4.3-16.8-1.3-21.1,6.2c-1.8,3.2-2.7,6.8-2.7,10.5c0,8.4,3.4,16.4,9.5,22.1
          c-3.8,2.1-7.9,3.6-12.2,4.6c-10.6,2.3-21.6,3.5-32.8,3.5c-14.9,0-29.5-1.9-43.3-5.5c-4.9-1.3-9.6-3-14.1-5.1V240h120V130
          C142.5,130,165,105,165,75C165,55,160,35,152.6,24.4z" className="fill-amber-100 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" />
        
        {/* Ear Detail */}
        <path d="M138.5,80.5c-2.1-1.2-4.5-1.8-7-1.8c-6.8,0-13.1,3.8-16.3,9.8c-1.3,2.4-2,5.1-2,7.9c0,9.3,5.4,17.6,13.5,21.5" fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />

        {/* Measurement Path (NEX) */}
        <path d="M155,42 C145,60 138,75 138,80" fill="none" className="stroke-primary stroke-2" strokeDasharray="4 4" />
        <path d="M138,80 C130,110 110,150 95,180" fill="none" className="stroke-primary stroke-2" strokeDasharray="4 4" />

        {/* Markers and Labels */}
        <circle cx="155" cy="42" r="4" className="fill-primary" />
        <text x="160" y="38" className="text-[10px] fill-foreground font-bold">N</text>

        <circle cx="138" cy="80" r="4" className="fill-primary" />
        <text x="142" y="90" className="text-[10px] fill-foreground font-bold">E</text>

        <circle cx="95" cy="180" r="4" className="fill-primary" />
        <text x="80" y="185" className="text-[10px] fill-foreground font-bold">X</text>
        
        <text x="100" y="245" textAnchor="middle" className="text-[10px] fill-muted-foreground">N (Nariz) → E (Lóbulo da Orelha) → X (Apêndice Xifoide)</text>
      </svg>
    </CardContent>
  </Card>
);

export default SngMeasurementDiagram;