import { useCallback, useMemo, useState } from 'react';
import type { Capacitation, CapacitationEstado } from '../types';
import StatsBadge from '../components/StatsBadge';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import CapacitationCard from '../components/CapacitatioCard';
import CapacitacionForm, { type CapacitacionFormData } from '../components/CapacitacionForm';
import {
  useCapacitaciones,
  useCreateCapacitacion,
  useUpdateCapacitacion,
  useDeleteCapacitacion,
} from '../hooks/useCapacitaciones';

const formFieldClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const nextStatus: Record<CapacitationEstado, CapacitationEstado> = {
  programada: 'en_curso',
  en_curso: 'finalizada',
  finalizada: 'cancelada',
  cancelada: 'programada',
};

function CapacitacionesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<CapacitationEstado | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCapacitacion, setEditingCapacitacion] = useState<Capacitation | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: capacitaciones = [], isLoading, isError, error } = useCapacitaciones({
    search: search || undefined,
    categoria: selectedCategoria || undefined,
    estado: selectedEstado || undefined,
  });

  const allCapacitaciones = useMemo(() => capacitaciones ?? [], [capacitaciones]);
  const total = allCapacitaciones.length;
  const enCurso = allCapacitaciones.filter(item => item.estado === 'en_curso').length;
  const finalizadas = allCapacitaciones.filter(item => item.estado === 'finalizada').length;
  const canceladas = allCapacitaciones.filter(item => item.estado === 'cancelada').length;

  const createCapacitacion = useCreateCapacitacion();
  const updateCapacitacion = useUpdateCapacitacion();
  const deleteCapacitacion = useDeleteCapacitacion();

  const categorias = ['Frontend', 'Datos', 'Gestión', 'RH', 'Operaciones'];
  const estados: CapacitationEstado[] = ['programada', 'en_curso', 'finalizada', 'cancelada'];

  const handleOpenCreate = useCallback(() => {
    setEditingCapacitacion(undefined);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((capacitacion: Capacitation) => {
    setEditingCapacitacion(capacitacion);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleToggleStatus = useCallback((capacitacion: Capacitation) => {
    updateCapacitacion.mutate({
      id: capacitacion.id,
      data: { estado: nextStatus[capacitacion.estado] },
    });
  }, [updateCapacitacion]);

  const handleDeleteCapacitacion = useCallback((id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta capacitación?')) return;
    deleteCapacitacion.mutate(id);
  }, [deleteCapacitacion]);

  const handleSubmit = useCallback(async (formData: CapacitacionFormData) => {
    setSubmitError(null);
    try {
      if (editingCapacitacion) {
        await updateCapacitacion.mutateAsync({ id: editingCapacitacion.id, data: formData });
      } else {
        await createCapacitacion.mutateAsync(formData);
      }
      setModalOpen(false);
    } catch {
      setSubmitError('No se pudo guardar la capacitación. Intenta de nuevo.');
    }
  }, [editingCapacitacion, createCapacitacion, updateCapacitacion]);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de capacitaciones</h2>
          <p className="text-slate-500 mt-1">
            {isLoading ? 'Cargando...' : `${allCapacitaciones.length} capacitaciones registradas`}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Nueva capacitación
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <StatsBadge label="Total" value={total} variant="blue" />
        <StatsBadge label="En curso" value={enCurso} variant="green" />
        <StatsBadge label="Finalizadas" value={finalizadas} variant="yellow" />
        <StatsBadge label="Canceladas" value={canceladas} variant="red" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-end gap-3">
        <FormField label="Buscar" className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Buscar por nombre o instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={formFieldClass}
          />
        </FormField>

        <FormField label="Categoría" className="min-w-[180px]">
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className={formFieldClass}
          >
            <option value="">Todas</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Estado" className="min-w-[180px]">
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value as CapacitationEstado | '')}
            className={formFieldClass}
          >
            <option value="">Todos</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>
                {estado === 'programada' ? 'Programada' : estado === 'en_curso' ? 'En curso' : estado === 'finalizada' ? 'Finalizada' : 'Cancelada'}
              </option>
            ))}
          </select>
        </FormField>

        {(search || selectedCategoria || selectedEstado) && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategoria('');
              setSelectedEstado('');
            }}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
          <span>Cargando capacitaciones...</span>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Error al cargar las capacitaciones</p>
          <p className="text-red-500 text-sm mt-1">{(error as Error)?.message || 'Error desconocido'}</p>
        </div>
      )}

      {!isLoading && !isError && allCapacitaciones.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No se encontraron capacitaciones con los filtros aplicados.</p>
        </div>
      )}

      {!isLoading && !isError && allCapacitaciones.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allCapacitaciones.map(capacitacion => (
            <div key={capacitacion.id} className="relative">
              <div className="absolute -top-2.5 -right-2.5 z-10 flex gap-1">
                <button
                  onClick={() => handleOpenEdit(capacitacion)}
                  aria-label="Editar capacitación"
                  title="Editar capacitación"
                  className="w-6 h-6 rounded-full border-2 border-white bg-brand-600 text-white cursor-pointer text-xs leading-5 shadow-md"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteCapacitacion(capacitacion.id)}
                  aria-label="Eliminar capacitación"
                  title="Eliminar capacitación"
                  className="w-6 h-6 rounded-full border-2 border-white bg-red-500 text-white cursor-pointer text-sm leading-5 shadow-md"
                >
                  ×
                </button>
              </div>
              <CapacitationCard
                capacitation={capacitacion}
                onSelect={() => undefined}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        title={editingCapacitacion ? `Editar: ${editingCapacitacion.nombre}` : 'Nueva capacitación'}
        onClose={() => setModalOpen(false)}
      >
        <CapacitacionForm
          capacitacion={editingCapacitacion}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={createCapacitacion.isPending || updateCapacitacion.isPending}
          error={submitError}
        />
      </Modal>
    </div>
  );
}

export default CapacitacionesPage;
