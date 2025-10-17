import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SngMeasurementDiagram = () => (
  <Card className="mt-4 bg-muted/50">
    <CardHeader>
      <CardTitle className="text-base">Diagrama: Medida da Sonda (NEX)</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center p-6">
      <svg viewBox="0 0 250 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-xs mx-auto rounded-md">
        <defs>
          <linearGradient id="skin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'hsl(var(--muted))', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        
        {/* Head and Torso Shape */}
        <path d="M160 20 C 190 40, 200 80, 180 110 L 150 150 L 140 280 L 30 280 L 30 180 C 50 150, 80 110, 100 80 C 120 50, 140 30, 160 20 Z" fill="url(#skin-gradient)" stroke="hsl(var(--border))" strokeWidth="2" />
        
        {/* Anatomical Details */}
        <path d="M160 20 Q 155 30, 162 45" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.5" /> {/* Nose bridge */}
        <path d="M162 45 C 165 48, 160 55, 155 53" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.5" /> {/* Nose tip */}
        <path d="M180 110 C 185 105, 190 115, 180 120 C 175 125, 178 115, 180 110" fill="hsl(var(--accent))" stroke="hsl(var(--border))" /> {/* Ear */}
        <path d="M155 53 C 150 60, 155 65, 150 70" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.5" /> {/* Mouth */}
        <path d="M150 70 C 145 80, 148 90, 152 95" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.5" /> {/* Chin */}
        <path d="M105 220 L 115 230 L 100 235 Z" fill="hsl(var(--accent))" stroke="hsl(var(--border))" /> {/* Xiphoid process area */}

        {/* Measurement Path */}
        <path d="M162 45 C 170 65, 180 90, 180 110" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="5 3" />
        <path d="M180 110 C 160 140, 130 190, 110 225" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="5 3" />

        {/* Markers */}
        <circle cx="162" cy="45" r="5" fill="hsl(var(--primary))" stroke="white" strokeWidth="1.5" />
        <text x="170" y="40" fill="hsl(var(--foreground))" fontWeight="bold" fontSize="14">N</text>
        
        <circle cx="180" cy="110" r="5" fill="hsl(var(--primary))" stroke="white" strokeWidth="1.5" />
        <text x="190" y="115" fill="hsl(var(--foreground))" fontWeight="bold" fontSize="14">E</text>
        
        <circle cx="110" cy="225" r="5" fill="hsl(var(--primary))" stroke="white" strokeWidth="1.5" />
        <text x="95" y="230" fill="hsl(var(--foreground))" fontWeight="bold" fontSize="14">X</text>
      </svg>
      <p className="text-center text-sm text-muted-foreground mt-4">
        <strong>NEX:</strong> Ponta do <strong>N</strong>ariz → Lóbulo da <strong>O</strong>relha → Apêndice <strong>X</strong>ifoide.
      </p>
    </CardContent>
  </Card>
);

export default SngMeasurementDiagram;