import { apiClient } from './api';
import { Plan, CreatePlanRequest, UpdatePlanRequest } from '../types/api';

export const planService = {
  async getByOrganization(organizationId: string): Promise<Plan[]> {
    const response = await apiClient.get<Plan[]>(`/plans/organization/${organizationId}`);
    return response.data || [];
  },

  async getById(id: string): Promise<Plan> {
    const response = await apiClient.get<Plan>(`/plans/${id}`);
    return response.data!;
  },

  async create(data: CreatePlanRequest): Promise<Plan> {
    const response = await apiClient.post<Plan>('/plans', data);
    return response.data!;
  },

  async update(id: string, data: UpdatePlanRequest): Promise<Plan> {
    const response = await apiClient.put<Plan>(`/plans/${id}`, data);
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/plans/${id}`);
  }
};