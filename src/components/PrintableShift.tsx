import React from "react";
import { Shift } from "@/pages/ShiftManager";
import { Stethoscope } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PrintableShiftProps {
  shift: Shift | null;
}

export const PrintableShift = React.forwardRef<HTMLDivElement, PrintableShiftProps>(({ shift }, ref) => {
  if (!shift) return null;

  return (
    <div ref={ref} className="p-8 font-sans text-black">
      <header className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Enfermagem Pro</h1>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">Escala de Plantão</h2>
          <p className="text-sm">Impresso em: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
        </div>
      </header>

      <main>
        <h3 className="text-3xl font-bold text-center mb-2">{shift.period} - {shift.title}</h3>
        <p className="text-center text-lg mb-8">{format(new Date(shift.shift_date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {shift.team_members.map(member => (
            <div key={member.id} className="border border-gray-300 rounded-lg p-4 break-inside-avoid">
              <h4 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">{member.name}</h4>
              {member.patient_assignments.length > 0 ? (
                <ul className="grid grid-cols-2 gap-2">
                  {member.patient_assignments.map(assignment => (
                    <li key={assignment.id} className="text-base font-medium p-2 bg-gray-100 rounded text-center">
                      {assignment.bed_number}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhum leito atribuído.</p>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 mt-12 pt-4 border-t">
        Gerado por Enfermagem Pro
      </footer>
    </div>
  );
});