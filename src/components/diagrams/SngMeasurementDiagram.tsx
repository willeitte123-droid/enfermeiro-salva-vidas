import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SngMeasurementDiagram = () => (
  <Card className="mt-4 bg-muted/50">
    <CardHeader>
      <CardTitle className="text-base">Diagrama: Medida da Sonda (NEX)</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center p-6">
      <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[200px]">
        {/* Profile Outline */}
        <path d="M150,20 C180,40 185,80 165,105 L140,130 L130,240 L20,240 L20,160 C40,130 70,90 90,60 C110,30 130,10 150,20 Z" className="fill-amber-100 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" />
        
        {/* Anatomical Details */}
        <path d="M150,20 C148,25 152,30 155,28" fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" /> {/* Nose */}
        <path d="M165,105 C170,100 175,110 165,115 Z" className="fill-amber-200 dark:fill-amber-800/50 stroke-amber-400 dark:stroke-amber-600" /> {/* Ear */}
        <path d="M105,190 C110,195 100,205 95,200 Z" className="fill-amber-200 dark:fill-amber-800/50 stroke-amber-400 dark:stroke-amber-600" /> {/* Xiphoid area */}

        {/* Measurement Path (NEX) */}
        <path d="M155,28 C160,50 165,80 165,105" fill="none" className="stroke-primary stroke-2" strokeDasharray="3 3" /> {/* N to E */}
        <path d="M165,105 C150,130 120,170 100,195" fill="none" className="stroke-primary stroke-2" strokeDasharray="3 3" /> {/* E to X */}

        {/* Markers and Labels */}
        <circle cx="155" cy="28" r="4" className="fill-primary" />
        <text x="160" y="25" className="text-[10px] fill-foreground font-bold">N</text>

        <circle cx="165" cy="105" r="4" className="fill-primary" />
        <text x="175" y="110" className="text-[10px] fill-foreground font-bold">E</text>

        <circle cx="100" cy="195" r="4" className="fill-primary" />
        <text x="90" y="205" className="text-[10px] fill-foreground font-bold">X</text>
        
        <text x="100" y="245" textAnchor="middle" className="text-[10px] fill-muted-foreground">N (Nariz) → E (Lóbulo da Orelha) → X (Apêndice Xifoide)</text>
      </svg>
    </CardContent>
  </Card>
);

export default SngMeasurementDiagram;