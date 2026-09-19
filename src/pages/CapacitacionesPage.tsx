import { useMemo, useState } from 'react';
import type { Capacitation, CapacitationEstado } from '../types';

const initialCapacitaciones: Capacitation[] = [
  {
    id: 1,
    nombre: 'React Avanzado',
    categoria: 'Frontend',
    instrutor: 'Ana García',
    fecha_inicio: '2026-09-20',
    fecha_fin: '2026-09-24',
    estado: 'programada',
  },
  {
    id: 2,
    nombre: 'SQL para RRHH',
    categoria: 'Datos',
    instrutor: 'Luis Pérez',
    fecha_inicio: '2026-09-18',
    fecha_fin: '2026-09-19',
    estado: 'en_curso',
  },
  {
    id: 3,
    nombre: 'Liderazgo Técnico',
    categoria: 'Gestión',
    instrutor: 'Sofía Ruiz',
    fecha_inicio: '2026-08-10',
    fecha_fin: '2026-08-12',
    estado: 'finalizada',
  },
];

const statusConfig: Record<CapacitationEstado, { bg: string; text: string; label: string }> = {
  programada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Programada' },
  en_curso: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En curso' },
  finalizada: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Finalizada' },
  cancelada: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Cancelada' },
};

const nextStatus: Record<CapacitationEstado, CapacitationEstado> = {
  programada: 'en_curso',
  en_curso: 'finalizada',
  finalizada: 'cancelada',
  cancelada: 'programada',
};

function CapacitacionesPage() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitation[]>(initialCapacitaciones);
  const [selected, setSelected] = useState<Capacitation | null>(null);

  const total = capacitaciones.length;
  const enCurso = capacitaciones.filter(c => c.estado === 'en_curso').length;
  const finalizadas = capacitaciones.filter(c => c.estado === 'finalizada').length;

  const statusSummary = useMemo(() => [
    { label: 'Total', value: total, tone: 'blue' },
    { label: 'En curso', value: enCurso, tone: 'green' },
    { label: 'Finalizadas', value: finalizadas, tone: 'purple' },
  ], [total, enCurso, finalizadas]);

  const handleToggleStatus = (capacitation: Capacitation) => {
    setCapacitaciones(prev => prev.map(item =>
      item.id === capacitation.id ? { ...item, estado: nextStatus[item.estado] } : item
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de capacitaciones</h2>
          <p className="text-slate-500 mt-1">Programa y seguimiento de entrenamiento</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {statusSummary.map(item => (
          <div
            key={item.label}
            className={`flex-1 min-w-[140px] p-4 rounded-xl ${
              item.tone === 'blue' ? 'bg-blue-100 text-blue-800' :
              item.tone === 'green' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}
          >
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-3xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {capacitaciones.map(capacitacion => {
          const style = statusConfig[capacitacion.estado];
          return (
            <div
              key={capacitacion.id}
              onClick={() => setSelected(capacitacion)}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{capacitacion.nombre}</h3>
                  <p className="text-sm text-slate-500">{capacitacion.categoria}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(capacitacion);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${style.bg} ${style.text} cursor-pointer`}
                >
                  {style.label}
                </button>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><span className="font-medium text-slate-700">Instructor:</span> {capacitacion.instrutor}</p>
                <p><span className="font-medium text-slate-700">Inicio:</span> {capacitacion.fecha_inicio}</p>
                <p><span className="font-medium text-slate-700">Fin:</span> {capacitacion.fecha_fin}</p>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900 mb-2">Detalle</p>
          <p><span className="font-medium">Capacitación:</span> {selected.nombre}</p>
          <p><span className="font-medium">Estado:</span> {statusConfig[selected.estado].label}</p>
        </div>
      )}
    </div>
  );
}

export default CapacitacionesPage;
