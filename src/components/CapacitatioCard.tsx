import type { Capacitation, CapacitationEstado } from '../types';

interface CapacitationProps {
  capacitation: Capacitation;
  onSelect?: (capacitation: Capacitation) => void;
  onToggleStatus?: (capacitation: Capacitation) => void;
}

const statusConfig: Record<CapacitationEstado, { bg: string; text: string; label: string }> = {
  programada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Programada' },
  en_curso: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En curso' },
  finalizada: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Finalizada' },
  cancelada: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Cancelada' },
};

function CapacitationCard({ capacitation, onSelect, onToggleStatus }: CapacitationProps) {
  const { nombre, categoria, instrutor, fecha_inicio, fecha_fin, estado } = capacitation;
  const statusStyle = statusConfig[estado];

  return (
    <div
      onClick={() => onSelect?.(capacitation)}
      className={`bg-white rounded-xl border border-slate-200 p-5 w-full hover:shadow-md hover:border-blue-300 transition-all duration-200 ${onSelect ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{nombre}</h3>
          <p className="text-sm text-slate-500">{categoria}</p>
        </div>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus?.(capacitation);
          }}
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text} ${onToggleStatus ? 'cursor-pointer hover:opacity-75' : ''}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p><span className="font-medium text-slate-700">Instructor:</span> {instrutor}</p>
        <p><span className="font-medium text-slate-700">Inicio:</span> {fecha_inicio}</p>
        <p><span className="font-medium text-slate-700">Fin:</span> {fecha_fin}</p>
      </div>
    </div>
  );
}

export default CapacitationCard;