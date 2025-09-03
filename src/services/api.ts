import { 
  ApiResponse, 
  LoginDto, 
  RegisterDto, 
  AuthResponse, 
  CreateOrganizationDto, 
  OrganizationResponseDto,
  CreateFeatureDto,
  UpdateFeatureDto,
  FeatureResponseDto,
  CreatePlanDto,
  UpdatePlanDto,
  PlanResponseDto,
  UserResponseDto,
  PaginatedResponse,
  SubscriptionResponseDto,
  UsageResponseDto
} from '../types/frontend-types';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  // Auth endpoints
  async login(data: LoginDto): Promise<ApiResponse<AuthResponse>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterDto): Promise<ApiResponse<any>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Organization endpoints
  async createOrganization(data: CreateOrganizationDto): Promise<ApiResponse<OrganizationResponseDto>> {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrganization(id: string): Promise<ApiResponse<OrganizationResponseDto>> {
    return this.request(`/organizations/${id}`);
  }

  // User endpoints
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<UserResponseDto>> {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  async updateUser(id: string, data: any): Promise<ApiResponse<UserResponseDto>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Feature endpoints
  async getFeatures(orgId: string): Promise<ApiResponse<FeatureResponseDto[]>> {
    return this.request(`/features/organization/${orgId}`);
  }

  async createFeature(data: CreateFeatureDto): Promise<ApiResponse<FeatureResponseDto>> {
    return this.request('/features', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFeature(id: string, data: UpdateFeatureDto): Promise<ApiResponse<FeatureResponseDto>> {
    return this.request(`/features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleFeature(id: string): Promise<ApiResponse<FeatureResponseDto>> {
    return this.request(`/features/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // Plan endpoints
  async getPlans(orgId: string): Promise<ApiResponse<PlanResponseDto[]>> {
    return this.request(`/plans/organization/${orgId}`);
  }

  async createPlan(data: CreatePlanDto): Promise<ApiResponse<PlanResponseDto>> {
    return this.request('/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlan(id: string, data: UpdatePlanDto): Promise<ApiResponse<PlanResponseDto>> {
    return this.request(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Subscription endpoints
  async getUserSubscriptions(userId: string): Promise<ApiResponse<SubscriptionResponseDto[]>> {
    return this.request(`/subscriptions/user/${userId}`);
  }

  async getActiveSubscriptions(userId: string): Promise<ApiResponse<SubscriptionResponseDto[]>> {
    return this.request(`/subscriptions/user/${userId}/active`);
  }

  // Subscription endpoints
  async createSubscription(data: any): Promise<ApiResponse<any>> {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelSubscription(id: string): Promise<ApiResponse<any>> {
    return this.request(`/subscriptions/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  // Usage endpoints
  async getUserUsage(userId: string): Promise<ApiResponse<UsageResponseDto[]>> {
    return this.request(`/usage/user/${userId}`);
  }

  async createUsage(data: any): Promise<ApiResponse<any>> {
    return this.request('/usage', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTotalUsage(userId: string, featureId: string): Promise<ApiResponse<{ total: number }>> {
    return this.request(`/usage/user/${userId}/feature/${featureId}/total`);
  }
}

export const apiService = new ApiService();