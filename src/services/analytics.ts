import { apiClient } from './api';
import { DashboardStats, DashboardResponse } from '../types/api';

// Cache for analytics data (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const analyticsService = {
  async getComprehensiveDashboard(organizationId: string): Promise<DashboardResponse> {
    const cacheKey = `comprehensive-dashboard-${organizationId}`;
    const cached = getCachedData<DashboardResponse>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await apiClient.get<DashboardResponse>(`/dashboard/organization/${organizationId}`);
    const data = response.data!;
    setCachedData(cacheKey, data);
    return data;
  },

  clearCache(): void {
    cache.clear();
  }
};