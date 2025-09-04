import { apiClient } from './api';
import { UserPlan, CreateUserPlanRequest } from '../types/api';

export const userPlanService = {
  async getByOrganization(organizationId: string): Promise<UserPlan[]> {
    const response = await apiClient.get<UserPlan[]>(`/user-plans/organization/${organizationId}`);
    return response.data || [];
  },

  async create(data: CreateUserPlanRequest): Promise<UserPlan> {
    const response = await apiClient.post<UserPlan>('/user-plans', data);
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/user-plans/${id}`);
  }
};