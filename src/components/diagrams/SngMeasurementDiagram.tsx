import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SngMeasurementDiagram = () => (
  <Card className="mt-4 bg-muted/50">
    <CardHeader>
      <CardTitle className="text-base">Diagrama: Medida da Sonda (NEX)</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center p-6">
      <svg viewBox="0 0 150 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[200px]">
        {/* Head and torso outline */}
        <path d="M 90,10 C 130,10 140,50 130,70 L 125,90 L 120,170 L 30,170 L 30,100 C 30,70 40,40 90,10 Z" className="fill-amber-100 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" />
        {/* Nose, mouth, ear */}
        <path d="M130,70 C 135,65 140,70 135,75" fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <path d="M120,80 C 125,82 130,80 120,80" fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <path d="M105,65 C 110,60 115,70 105,75 Z" className="fill-amber-200 dark:fill-amber-800/50 stroke-amber-400 dark:stroke-amber-600" />
        {/* Measurement path */}
        <path d="M135,72 C 120,70 110,68 107,68" fill="none" className="stroke-primary stroke-2" strokeDasharray="3 3" />
        <path d="M107,68 C 90,80 80,110 80,130" fill="none" className="stroke-primary stroke-2" strokeDasharray="3 3" />
        {/* Labels */}
        <circle cx="135" cy="72" r="3" className="fill-primary" />
        <text x="138" y="68" className="text-[8px] fill-foreground font-bold">N</text>
        <circle cx="107" cy="68" r="3" className="fill-primary" />
        <text x="98" y="65" className="text-[8px] fill-foreground font-bold">E</text>
        <circle cx="80" cy="130" r="3" className="fill-primary" />
        <text x="70" y="135" className="text-[8px] fill-foreground font-bold">X</text>
        <text x="75" y="175" textAnchor="middle" className="text-[10px] fill-muted-foreground">N (Nariz) → E (Lóbulo da Orelha) → X (Apêndice Xifoide)</text>
      </svg>
    </CardContent>
  </Card>
);

export default SngMeasurementDiagram;