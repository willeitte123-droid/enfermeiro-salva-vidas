import React from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface MindMapNode {
  label: string;
  note?: string;
  color?: string;
  children?: MindMapNode[];
}

const Node = ({ data, isRoot = false }: { data: MindMapNode; isRoot?: boolean }) => {
  const hasChildren = data.children && data.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative z-10 px-4 py-3 rounded-lg border shadow-sm transition-all hover:scale-105 hover:shadow-md text-center max-w-[180px] sm:max-w-[220px]",
          isRoot 
            ? "text-lg font-bold shadow-md mb-6 " + (data.color || "bg-primary text-primary-foreground")
            : "text-sm font-medium mb-6 bg-card " + (data.color || "bg-card border-border")
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <span>{data.label}</span>
          {data.note && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 opacity-60 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{data.note}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* Linha vertical conectora (saída do nó) */}
        {hasChildren && (
          <div className="absolute -bottom-6 left-1/2 w-px h-6 bg-border -translate-x-1/2" />
        )}
      </div>

      {hasChildren && (
        <div className="flex items-start justify-center relative">
          {/* Linha horizontal superior conectando os filhos */}
          {data.children!.length > 1 && (
            <div className="absolute top-0 left-0 right-0 h-px bg-border mx-[calc(50%/var(--child-count))] translate-y-[-1px]" 
                 style={{ 
                   left: `calc(100% / ${data.children!.length * 2})`, 
                   right: `calc(100% / ${data.children!.length * 2})` 
                 }} 
            />
          )}
          
          {data.children!.map((child, index) => (
            <div key={index} className="flex flex-col items-center px-2 sm:px-4 relative">
              {/* Linha vertical conectora (entrada do filho) */}
              <div className="w-px h-6 bg-border mb-0" />
              <Node data={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MindMapRenderer = ({ data }: { data: MindMapNode }) => {
  return (
    <div className="w-full overflow-x-auto p-4 pb-12 flex justify-center min-h-[400px] bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-dashed">
      <div className="min-w-max">
        <Node data={data} isRoot />
      </div>
    </div>
  );
};