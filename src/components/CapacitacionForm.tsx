import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Capacitation } from '../types';

const capacitacionSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  categoria: z.string().min(2, 'La categoría es obligatoria'),
  instrutor: z.string().min(2, 'El instructor es obligatorio'),
  fecha_inicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  fecha_fin: z.string().min(1, 'La fecha de fin es obligatoria'),
  estado: z.enum(['programada', 'en_curso', 'finalizada', 'cancelada']),
});

export type CapacitacionFormData = z.infer<typeof capacitacionSchema>;

interface CapacitacionFormProps {
  capacitacion?: Capacitation;
  onSubmit: (data: CapacitacionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

function CapacitacionForm({ capacitacion, onSubmit, onCancel, isLoading = false, error }: CapacitacionFormProps) {
  const isEditing = !!capacitacion;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CapacitacionFormData>({
    resolver: zodResolver(capacitacionSchema),
    defaultValues: {
      nombre: '',
      categoria: '',
      instrutor: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'programada',
    },
  });

  useEffect(() => {
    if (capacitacion) {
      reset({
        nombre: capacitacion.nombre,
        categoria: capacitacion.categoria,
        instrutor: capacitacion.instrutor,
        fecha_inicio: capacitacion.fecha_inicio,
        fecha_fin: capacitacion.fecha_fin,
        estado: capacitacion.estado,
      });
    }
  }, [capacitacion, reset]);

  const inputClass = (hasError: boolean) => `
    w-full px-3 py-2 border rounded-lg text-sm transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
    ${hasError ? 'border-red-400 bg-red-50 focus:ring-red-400' : 'border-slate-300 bg-white'}
  `;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
          <input {...register('nombre')} type="text" className={inputClass(!!errors.nombre)} />
          {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoría</label>
          <input {...register('categoria')} type="text" className={inputClass(!!errors.categoria)} />
          {errors.categoria && <p className="mt-1 text-xs text-red-600">{errors.categoria.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Instructor</label>
          <input {...register('instrutor')} type="text" className={inputClass(!!errors.instrutor)} />
          {errors.instrutor && <p className="mt-1 text-xs text-red-600">{errors.instrutor.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
          <select {...register('estado')} className={inputClass(!!errors.estado)}>
            <option value="programada">Programada</option>
            <option value="en_curso">En curso</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha inicio</label>
          <input {...register('fecha_inicio')} type="date" className={inputClass(!!errors.fecha_inicio)} />
          {errors.fecha_inicio && <p className="mt-1 text-xs text-red-600">{errors.fecha_inicio.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha fin</label>
          <input {...register('fecha_fin')} type="date" className={inputClass(!!errors.fecha_fin)} />
          {errors.fecha_fin && <p className="mt-1 text-xs text-red-600">{errors.fecha_fin.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || (!isDirty && isEditing)}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-800 hover:bg-brand-700 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear capacitación'}
        </button>
      </div>
    </form>
  );
}

export default CapacitacionForm;
