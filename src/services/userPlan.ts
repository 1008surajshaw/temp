import { apiClient } from './api';
import { UserPlan, CreateUserPlanRequest, UpgradePlanRequest, DowngradePlanRequest, ExtendExpiryRequest } from '../types/api';

export const userPlanService = {
  async create(data: CreateUserPlanRequest): Promise<UserPlan> {
    const response = await apiClient.post<UserPlan>('/user-plans', data);
    return response.data!;
  },

  async getById(id: string): Promise<UserPlan> {
    const response = await apiClient.get<UserPlan>(`/user-plans/${id}`);
    return response.data!;
  },

  async getByUser(userId: string): Promise<UserPlan[]> {
    const response = await apiClient.get<UserPlan[]>(`/user-plans/user/${userId}`);
    return response.data || [];
  },

  async upgrade(id: string, data: UpgradePlanRequest): Promise<UserPlan> {
    const response = await apiClient.patch<UserPlan>(`/user-plans/${id}/upgrade`, data);
    return response.data!;
  },

  async downgrade(id: string, data: DowngradePlanRequest): Promise<UserPlan> {
    const response = await apiClient.patch<UserPlan>(`/user-plans/${id}/downgrade`, data);
    return response.data!;
  },

  async extend(id: string, data: ExtendExpiryRequest): Promise<UserPlan> {
    const response = await apiClient.patch<UserPlan>(`/user-plans/${id}/extend`, data);
    return response.data!;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/user-plans/${id}/remove`);
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.patch(`/user-plans/${id}/deactivate`);
  },

  async getHistory(userId: string): Promise<UserPlan[]> {
    const response = await apiClient.get<UserPlan[]>(`/user-plans/history/${userId}`);
    return response.data || [];
  }
};