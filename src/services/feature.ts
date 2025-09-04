import { apiClient } from './api';
import { Feature, CreateFeatureRequest, UpdateFeatureRequest, FeatureUser, CreateFeatureUserRequest } from '../types/api';

export const featureService = {
  async getAll(): Promise<Feature[]> {
    const response = await apiClient.get<Feature[]>('/features');
    return response.data || [];
  },

  async getByOrganization(organizationId: string): Promise<Feature[]> {
    const response = await apiClient.get<Feature[]>(`/features/organization/${organizationId}`);
    return response.data || [];
  },

  async create(data: CreateFeatureRequest): Promise<Feature> {
    const response = await apiClient.post<Feature>('/features', data);
    return response.data!;
  },

  async update(id: string, data: UpdateFeatureRequest): Promise<Feature> {
    const response = await apiClient.put<Feature>(`/features/${id}`, data);
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/features/${id}`);
  },

  // Feature Users
  async getFeatureUsers(featureId: string): Promise<FeatureUser[]> {
    const response = await apiClient.get<FeatureUser[]>(`/features/${featureId}/users`);
    return response.data || [];
  },

  async createFeatureUser(data: CreateFeatureUserRequest): Promise<FeatureUser> {
    const response = await apiClient.post<FeatureUser>('/feature-users', data);
    return response.data!;
  },

  async deleteFeatureUser(userId: string): Promise<void> {
    await apiClient.delete(`/feature-users/${userId}`);
  }
};