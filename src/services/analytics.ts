import { apiClient } from './api';
import { DashboardStats, Analytics } from '../types/api';

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
  async getDashboardStats(organizationId: string): Promise<DashboardStats> {
    const cacheKey = `dashboard-stats-${organizationId}`;
    const cached = getCachedData<DashboardStats>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await apiClient.get<DashboardStats>(`/analytics/dashboard/${organizationId}`);
    const data = response.data!;
    setCachedData(cacheKey, data);
    return data;
  },

  async getOrganizationAnalytics(organizationId: string, startDate?: string, endDate?: string): Promise<Analytics[]> {
    const cacheKey = `org-analytics-${organizationId}-${startDate || 'all'}-${endDate || 'all'}`;
    const cached = getCachedData<Analytics[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get<Analytics[]>(`/analytics/organization/${organizationId}?${params}`);
    const data = response.data || [];
    setCachedData(cacheKey, data);
    return data;
  },

  clearCache(): void {
    cache.clear();
  }
};