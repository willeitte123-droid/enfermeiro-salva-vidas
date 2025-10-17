import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AvpSitesDiagram = () => (
  <Card className="mt-4 bg-muted/50">
    <CardHeader>
      <CardTitle className="text-base">Diagrama: Sítios Comuns de AVP</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center p-6">
      <svg viewBox="0 0 150 250" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[150px]">
        {/* Arm outline */}
        <path d="M 50,0 L 100,0 L 120,100 L 130,240 L 20,240 L 30,100 Z" className="fill-amber-100 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" />
        {/* Veins */}
        <path d="M 80,20 C 70,60 60,80 55,120 L 50, 220" fill="none" className="stroke-blue-400 dark:stroke-blue-600" strokeWidth="3" />
        <path d="M 90,50 C 95,80 100,100 105, 220" fill="none" className="stroke-blue-400 dark:stroke-blue-600" strokeWidth="3" />
        <path d="M 55,120 C 75,115 100,110 105,125" fill="none" className="stroke-blue-400 dark:stroke-blue-600" strokeWidth="3" />
        {/* Labels */}
        <text x="40" y="70" className="text-[10px] fill-foreground font-semibold" transform="rotate(-20 40,70)">Cefálica</text>
        <text x="110" y="80" className="text-[10px] fill-foreground font-semibold" transform="rotate(15 110,80)">Basílica</text>
        <text x="75" y="110" className="text-[10px] fill-foreground font-semibold">Cubital Mediana</text>
        <text x="75" y="180" className="text-[10px] fill-foreground font-semibold">Veias do Dorso</text>
        <text x="75" y="195" className="text-[10px] fill-foreground font-semibold">da Mão</text>
      </svg>
    </CardContent>
  </Card>
);

export default AvpSitesDiagram;