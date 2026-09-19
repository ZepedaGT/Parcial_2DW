import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capacitacionService, type CapacitacionFilters } from '../services/capacitacionService';
import type { Capacitation } from '../types';

export const capacitacionKeys = {
  all: ['capacitaciones'] as const,
  list: (filters: CapacitacionFilters) => ['capacitaciones', 'list', filters] as const,
  detail: (id: number) => ['capacitaciones', id] as const,
};

export function useCapacitaciones(filters: CapacitacionFilters = {}) {
  return useQuery({
    queryKey: capacitacionKeys.list(filters),
    queryFn: () => capacitacionService.getAll(filters),
  });
}

export function useCapacitacion(id: number | null) {
  return useQuery({
    queryKey: capacitacionKeys.detail(id ?? 0),
    queryFn: () => capacitacionService.getById(id ?? 0),
    enabled: !!id,
  });
}

export function useCreateCapacitacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Capacitation, 'id'>) => capacitacionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: capacitacionKeys.all });
    },
  });
}

export function useUpdateCapacitacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Capacitation> }) =>
      capacitacionService.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(capacitacionKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: capacitacionKeys.all });
    },
  });
}

export function useDeleteCapacitacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capacitacionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: capacitacionKeys.all });
    },
  });
}
