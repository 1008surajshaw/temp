import { apiClient } from './api';
import { FeatureUser, CreateFeatureUserRequest, ValidateTokenRequest, TokenValidationResponse } from '../types/api';

export const featureUserService = {
  async create(data: CreateFeatureUserRequest): Promise<FeatureUser> {
    const response = await apiClient.post<FeatureUser>('/feature-users', data);
    return response.data!;
  },

  async getById(id: string): Promise<FeatureUser> {
    const response = await apiClient.get<FeatureUser>(`/feature-users/${id}`);
    return response.data!;
  },

  async getByFeature(featureId: string): Promise<FeatureUser[]> {
    const response = await apiClient.get<FeatureUser[]>(`/feature-users/feature/${featureId}`);
    return response.data || [];
  },

  async getByOrganization(organizationId: string): Promise<FeatureUser[]> {
    const response = await apiClient.get<FeatureUser[]>(`/feature-users/organization/${organizationId}`);
    return response.data || [];
  },

  async validateToken(data: ValidateTokenRequest): Promise<TokenValidationResponse> {
    const response = await apiClient.post<TokenValidationResponse>('/feature-users/validate', data);
    return response.data!;
  },

  async toggleActivity(id: string): Promise<FeatureUser> {
    const response = await apiClient.patch<FeatureUser>('/feature-users/toggle', { id });
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/feature-users/${id}`);
  }
};