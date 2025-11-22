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

const TreeNode = ({ node, level = 0 }: { node: MindMapNode; level?: number }) => {
  const hasChildren = node.children && node.children.length > 0;

  // Cores padrão baseadas no nível se não forem fornecidas
  const defaultColors = [
    "bg-gradient-to-br from-slate-700 to-slate-900 text-white", // Nível 0
    "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200", // Nível 1
    "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300", // Nível 2
  ];

  const nodeColor = node.color || defaultColors[Math.min(level, 2)];
  const isRoot = level === 0;

  return (
    <li className="relative px-2 pt-6 text-center list-none flex flex-col items-center">
      <div 
        className={cn(
          "relative z-10 flex items-center justify-center gap-2 transition-all duration-300 cursor-default group",
          "animate-in zoom-in-50 duration-500 slide-in-from-bottom-4",
          isRoot 
            ? "py-4 px-8 rounded-2xl shadow-xl text-lg font-bold tracking-tight mb-4 scale-100" 
            : "py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 text-sm font-medium",
          nodeColor
        )}
      >
        <span className="drop-shadow-sm">{node.label}</span>
        
        {node.note && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="ml-1 p-0.5 rounded-full bg-white/20 hover:bg-white/40 cursor-help transition-colors">
                  <Info className="w-3.5 h-3.5" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-slate-900 text-slate-50 border-slate-800">
                <p className="text-xs leading-relaxed">{node.note}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {hasChildren && (
        <>
          {/* Linha vertical saindo do pai */}
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
          
          <ul className="flex flex-row justify-center pt-6 relative">
            {/* Linha horizontal conectora superior */}
            <div className="absolute top-0 left-0 w-full h-6 overflow-hidden">
               {/* Esta lógica CSS cria os arcos conectores */}
            </div>
            
            {node.children!.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
};

export const MindMapRenderer = ({ data }: { data: MindMapNode }) => {
  return (
    <div className="mindmap-container w-full overflow-auto p-8 flex justify-center bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 min-h-[500px]">
      <style>{`
        .mindmap-tree ul {
          padding-top: 20px; 
          position: relative;
          display: flex;
          justify-content: center;
        }
        
        .mindmap-tree li {
          float: left; text-align: center;
          list-style-type: none;
          position: relative;
          padding: 20px 5px 0 5px;
        }
        
        /* Conectores (Linhas) */
        .mindmap-tree li::before, .mindmap-tree li::after {
          content: '';
          position: absolute; top: 0; right: 50%;
          border-top: 2px solid #cbd5e1;
          width: 50%; height: 20px;
        }
        
        /* Modo escuro para as linhas */
        .dark .mindmap-tree li::before, .dark .mindmap-tree li::after {
          border-color: #334155;
        }
        
        .mindmap-tree li::after {
          right: auto; left: 50%;
          border-left: 2px solid #cbd5e1;
        }
        
        .dark .mindmap-tree li::after {
          border-left: 2px solid #334155;
        }
        
        /* Remove conectores dos extremos */
        .mindmap-tree li:only-child::after, .mindmap-tree li:only-child::before {
          display: none;
        }
        
        .mindmap-tree li:only-child { padding-top: 0; }
        
        .mindmap-tree li:first-child::before, .mindmap-tree li:last-child::after {
          border: 0 none;
        }
        
        .mindmap-tree li:last-child::before{
          border-right: 2px solid #cbd5e1;
          border-radius: 0 12px 0 0;
        }
        
        .dark .mindmap-tree li:last-child::before{
          border-right: 2px solid #334155;
        }
        
        .mindmap-tree li:first-child::after{
          border-radius: 12px 0 0 0;
        }
        
        /* Linha vertical descendo para o nó */
        .mindmap-tree ul::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          border-left: 2px solid #cbd5e1;
          width: 0; height: 20px;
        }
        
        .dark .mindmap-tree ul::before {
          border-color: #334155;
        }
      `}</style>
      
      <div className="mindmap-tree">
        <ul>
          <TreeNode node={data} />
        </ul>
      </div>
    </div>
  );
};