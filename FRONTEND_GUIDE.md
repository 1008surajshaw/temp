# Frontend Integration Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install axios react-query @types/node
# or
yarn add axios react-query @types/node
```

### 2. Copy Types
```bash
# Copy frontend-types.ts to your frontend project
cp frontend-types.ts ./src/types/api.ts
```

### 3. Environment Variables
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_API_TIMEOUT=10000
```

---

## 🔧 API Client Setup

### Basic Axios Client
```typescript
// src/services/api.ts
import axios from 'axios';
import { ApiResponse } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);
```

---

## 🔐 Authentication Service

```typescript
// src/services/auth.ts
import { apiClient } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, Owner } from '../types/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/owners/login', credentials);
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<Owner> {
    const response = await apiClient.post('/owners/register', userData);
    return response.data;
  },

  async getProfile(): Promise<Owner> {
    const response = await apiClient.get('/owners/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
```

---

## 🏢 Organization Service

```typescript
// src/services/organization.ts
import { apiClient } from './api';
import { Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from '../types/api';

export const organizationService = {
  async getAll(): Promise<Organization[]> {
    const response = await apiClient.get('/organizations');
    return response.data;
  },

  async getById(id: string): Promise<Organization> {
    const response = await apiClient.get(`/organizations/${id}`);
    return response.data;
  },

  async create(data: CreateOrganizationRequest): Promise<Organization> {
    const response = await apiClient.post('/organizations', data);
    return response.data;
  },

  async update(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
    const response = await apiClient.put(`/organizations/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/organizations/${id}`);
  }
};
```

---

## 🎯 Feature Service

```typescript
// src/services/feature.ts
import { apiClient } from './api';
import { Feature, CreateFeatureRequest, UpdateFeatureRequest } from '../types/api';

export const featureService = {
  // Gets features filtered by user's organization (recommended)
  async getAll(): Promise<Feature[]> {
    const response = await apiClient.get('/features');
    return response.data;
  },

  // Gets features for specific organization
  async getByOrganization(organizationId: string): Promise<Feature[]> {
    const response = await apiClient.get(`/features/organization/${organizationId}`);
    return response.data;
  },

  async create(data: CreateFeatureRequest): Promise<Feature> {
    const response = await apiClient.post('/features', data);
    return response.data;
  },

  async update(id: string, data: UpdateFeatureRequest): Promise<Feature> {
    const response = await apiClient.put(`/features/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/features/${id}`);
  }
};
```

---

## 💳 Plan Service

```typescript
// src/services/plan.ts
import { apiClient } from './api';
import { Plan, CreatePlanRequest, UpdatePlanRequest } from '../types/api';

export const planService = {
  // Gets plans filtered by user's organization (recommended)
  async getAll(): Promise<Plan[]> {
    const response = await apiClient.get('/plans');
    return response.data;
  },

  // Gets plans for specific organization
  async getByOrganization(organizationId: string): Promise<Plan[]> {
    const response = await apiClient.get(`/plans/organization/${organizationId}`);
    return response.data;
  },

  async create(data: CreatePlanRequest): Promise<Plan> {
    const response = await apiClient.post('/plans', data);
    return response.data;
  },

  async update(id: string, data: UpdatePlanRequest): Promise<Plan> {
    const response = await apiClient.put(`/plans/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/plans/${id}`);
  }
};
```

---

## 👥 Feature User Service

```typescript
// src/services/featureUser.ts
import { apiClient } from './api';
import { FeatureUser, CreateFeatureUserRequest, ValidateTokenRequest, TokenValidationResponse } from '../types/api';

export const featureUserService = {
  async create(data: CreateFeatureUserRequest): Promise<FeatureUser> {
    const response = await apiClient.post('/feature-users', data);
    return response.data;
  },

  async getById(id: string): Promise<FeatureUser> {
    const response = await apiClient.get(`/feature-users/${id}`);
    return response.data;
  },

  async getByFeature(featureId: string): Promise<FeatureUser[]> {
    const response = await apiClient.get(`/feature-users/feature/${featureId}`);
    return response.data;
  },

  async getByOrganization(organizationId: string): Promise<FeatureUser[]> {
    const response = await apiClient.get(`/feature-users/organization/${organizationId}`);
    return response.data;
  },

  async validateToken(data: ValidateTokenRequest): Promise<TokenValidationResponse> {
    const response = await apiClient.post('/feature-users/validate', data);
    return response.data;
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.patch(`/feature-users/${id}/deactivate`);
  }
};
```

---

## 👥 User Plan Service

```typescript
// src/services/userPlan.ts
import { apiClient } from './api';
import { 
  UserPlan, 
  CreateUserPlanRequest, 
  UpgradePlanRequest, 
  DowngradePlanRequest, 
  ExtendExpiryRequest 
} from '../types/api';

export const userPlanService = {
  async create(data: CreateUserPlanRequest): Promise<UserPlan> {
    const response = await apiClient.post('/user-plans', data);
    return response.data;
  },

  async getById(id: string): Promise<UserPlan> {
    const response = await apiClient.get(`/user-plans/${id}`);
    return response.data;
  },

  async getByUser(userId: string): Promise<UserPlan[]> {
    const response = await apiClient.get(`/user-plans/user/${userId}`);
    return response.data;
  },

  async upgrade(id: string, data: UpgradePlanRequest): Promise<UserPlan> {
    const response = await apiClient.patch(`/user-plans/${id}/upgrade`, data);
    return response.data;
  },

  async downgrade(id: string, data: DowngradePlanRequest): Promise<UserPlan> {
    const response = await apiClient.patch(`/user-plans/${id}/downgrade`, data);
    return response.data;
  },

  async extend(id: string, data: ExtendExpiryRequest): Promise<UserPlan> {
    const response = await apiClient.patch(`/user-plans/${id}/extend`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/user-plans/${id}/remove`);
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.patch(`/user-plans/${id}/deactivate`);
  },

  async getHistory(userId: string): Promise<UserPlan[]> {
    const response = await apiClient.get(`/user-plans/history/${userId}`);
    return response.data;
  }
};
```

---

## 📊 Usage & Analytics Service

```typescript
// src/services/usage.ts
import { apiClient } from './api';
import { TrackUsageRequest, UsageResponse, Usage, Analytics, DashboardStats } from '../types/api';

export const usageService = {
  async track(data: TrackUsageRequest): Promise<UsageResponse> {
    const response = await apiClient.post('/usage/track', data);
    return response.data;
  },

  async getByOrganization(organizationId: string): Promise<Usage[]> {
    const response = await apiClient.get(`/usage/organization/${organizationId}`);
    return response.data;
  },

  async getByFeature(featureId: string): Promise<Usage[]> {
    const response = await apiClient.get(`/usage/feature/${featureId}`);
    return response.data;
  }
};

export const analyticsService = {
  async getOrganizationAnalytics(organizationId: string, startDate?: string, endDate?: string): Promise<Analytics[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/analytics/organization/${organizationId}?${params}`);
    return response.data;
  },

  async getFeatureAnalytics(featureId: string, startDate?: string, endDate?: string): Promise<Analytics[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/analytics/feature/${featureId}?${params}`);
    return response.data;
  },

  async getDashboardStats(organizationId: string): Promise<any> {
    const response = await apiClient.get(`/analytics/dashboard/${organizationId}`);
    return response.data;
  },

  async getComprehensiveDashboard(organizationId: string): Promise<DashboardResponse> {
    const response = await apiClient.get(`/dashboard/organization/${organizationId}`);
    return response;
  }
};
```

---

## 🎣 React Hooks (Optional - with React Query)

```typescript
// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { authService } from '../services/auth';
import { LoginRequest, RegisterRequest } from '../types/api';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation(authService.login, {
    onSuccess: () => {
      queryClient.invalidateQueries('profile');
    }
  });

  const registerMutation = useMutation(authService.register);

  const { data: profile, isLoading } = useQuery(
    'profile',
    authService.getProfile,
    {
      enabled: authService.isAuthenticated(),
      retry: false
    }
  );

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: authService.logout,
    profile,
    isLoading,
    isAuthenticated: authService.isAuthenticated()
  };
};
```

---

## 📱 Component Examples

### Login Form
```typescript
// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types/api';

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### Organization List
```typescript
// src/components/OrganizationList.tsx
import React, { useEffect, useState } from 'react';
import { organizationService } from '../services/organization';
import { Organization } from '../types/api';

export const OrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await organizationService.getAll();
        setOrganizations(data);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Organizations</h2>
      {organizations.map((org) => (
        <div key={org.id}>
          <h3>{org.name}</h3>
          <p>{org.description}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 🔄 Error Handling

```typescript
// src/utils/errorHandler.ts
import { ApiError } from '../types/api';

export const handleApiError = (error: any): string => {
  if (error?.success === false) {
    return error.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  return 'An unexpected error occurred';
};

// Usage in components
try {
  await organizationService.create(data);
} catch (error) {
  const errorMessage = handleApiError(error);
  setError(errorMessage);
}
```

---

## ⚠️ Important Notes

### Organization Context
- **GET /api/features** and **GET /api/plans** automatically filter by user's organization
- Use **GET /api/features/organization/:id** only when you need specific organization data
- Superadmin users see all data, regular admins see only their organization's data

### Authentication Context
- All protected routes require JWT token in Authorization header
- Token contains user's organization context for automatic filtering
- Use organization-specific endpoints when you need cross-organization data (superadmin only)

---

## 🚀 Quick Start Checklist

- [ ] Copy `frontend-types.ts` to your project
- [ ] Set up API client with axios
- [ ] Configure environment variables
- [ ] Implement authentication service
- [ ] Create service files for each entity
- [ ] Add error handling
- [ ] Set up React Query (optional)
- [ ] Create reusable hooks
- [ ] Build components with proper typing
- [ ] Test organization context filtering

**Your backend API is now ready for frontend integration!**