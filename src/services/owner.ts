import { apiClient } from './api';
import { Owner } from '../types/api';

export const ownerService = {
  async getAll(): Promise<Owner[]> {
    const response = await apiClient.get<Owner[]>('/owners');
    return response.data || [];
  },

  async getById(id: string): Promise<Owner> {
    const response = await apiClient.get<Owner>(`/owners/${id}`);
    return response.data!;
  },

  async update(id: string, data: Partial<Owner>): Promise<Owner> {
    const response = await apiClient.put<Owner>(`/owners/${id}`, data);
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/owners/${id}`);
  },

  async deactivate(id: string): Promise<Owner> {
    const response = await apiClient.put<Owner>(`/owners/${id}`, { isActive: false });
    return response.data!;
  },

  async activate(id: string): Promise<Owner> {
    const response = await apiClient.put<Owner>(`/owners/${id}`, { isActive: true });
    return response.data!;
  }
};