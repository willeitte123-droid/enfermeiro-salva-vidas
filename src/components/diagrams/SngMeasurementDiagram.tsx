import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SngMeasurementDiagram = () => (
  <Card className="mt-4 bg-muted/50">
    <CardHeader>
      <CardTitle className="text-base">Diagrama: Medida da Sonda (NEX)</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center p-6">
      <img 
        src="/sng-measurement.png" 
        alt="Diagrama de medida da sonda nasogástrica (NEX), mostrando o trajeto da ponta do nariz, ao lóbulo da orelha e até o apêndice xifoide."
        className="w-full h-auto max-w-xs mx-auto rounded-md shadow-md"
      />
      <p className="text-center text-sm text-muted-foreground mt-4">
        <strong>NEX:</strong> Ponta do <strong>N</strong>ariz → Lóbulo da <strong>O</strong>relha → Apêndice <strong>X</strong>ifoide.
      </p>
    </CardContent>
  </Card>
);

export default SngMeasurementDiagram;