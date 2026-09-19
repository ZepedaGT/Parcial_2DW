import { apiClient } from './api';
import type { Capacitation, CapacitationEstado } from '../types';

export interface CapacitacionFilters {
  search?: string;
  categoria?: string;
  estado?: CapacitationEstado | '';
}

export const capacitacionService = {
  getAll: async (filters: CapacitacionFilters = {}): Promise<Capacitation[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.categoria) params.set('categoria', filters.categoria);
    if (filters.estado) params.set('estado', filters.estado);

    const response = await apiClient.get<Capacitation[]>(`/capacitation?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Capacitation> => {
    const response = await apiClient.get<Capacitation>(`/capacitation/${id}`);
    return response.data;
  },

  create: async (data: Omit<Capacitation, 'id'>): Promise<Capacitation> => {
    const response = await apiClient.post<Capacitation>('/capacitation', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Capacitation>): Promise<Capacitation> => {
    const response = await apiClient.patch<Capacitation>(`/capacitation/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/capacitation/${id}`);
  },
};
