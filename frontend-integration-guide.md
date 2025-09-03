# Frontend Integration Guide

## 🚀 API Base URL
```
Base URL: http://localhost:3000/api
```

## 🔐 Authentication Flow

### 1. Register User
```typescript
POST /auth/register
Body: {
  organization_id: string;
  name: string;
  email: string;
  password: string;
  user_type: 'admin' | 'user';
}
Response: {
  success: boolean;
  data: UserResponseDto;
  message: string;
}
```

### 2. Login User
```typescript
POST /auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  success: boolean;
  data: {
    user: UserResponseDto;
    token: string;
  };
  message: string;
}
```

### 3. Verify Email
```typescript
POST /auth/verify-email
Body: {
  token: string;
}
Response: {
  success: boolean;
  message: string;
}
```

## 🏢 Organization Management

### Create Organization (First Step)
```typescript
POST /organizations
Body: {
  name: string;
  description?: string;
}
Response: {
  success: boolean;
  data: OrganizationResponseDto;
}
```

### Get Organization
```typescript
GET /organizations/:id
Response: {
  success: boolean;
  data: OrganizationResponseDto;
}
```

## 👥 User Management

### Get All Users (Paginated)
```typescript
GET /users?page=1&limit=10
Response: {
  success: boolean;
  data: UserResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Get User by ID
```typescript
GET /users/:id
Response: {
  success: boolean;
  data: UserResponseDto;
}
```

### Update User
```typescript
PUT /users/:id
Body: {
  name?: string;
  email?: string;
  is_active?: boolean;
}
Response: {
  success: boolean;
  data: UserResponseDto;
}
```

## ⚡ Feature Management

### Create Feature
```typescript
POST /features
Body: {
  organization_id: string;
  name: string;
  feature_key: string;
  description?: string;
}
Response: {
  success: boolean;
  data: FeatureResponseDto;
}
```

### Get Features by Organization
```typescript
GET /features/organization/:organizationId
Response: {
  success: boolean;
  data: FeatureResponseDto[];
}
```

### Update Feature
```typescript
PUT /features/:id
Body: {
  name?: string;
  feature_key?: string;
  description?: string;
  is_active?: boolean;
}
Response: {
  success: boolean;
  data: FeatureResponseDto;
}
```

### Toggle Feature Status
```typescript
PATCH /features/:id/toggle
Response: {
  success: boolean;
  data: FeatureResponseDto;
}
```

## 💰 Plan Management

### Create Plan
```typescript
POST /plans
Body: {
  organization_id: string;
  name: string;
  description?: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: {
    feature_id: string;
    feature_limit: number;
    is_unlimited: boolean;
  }[];
}
Response: {
  success: boolean;
  data: PlanResponseDto;
}
```

### Get Plans by Organization
```typescript
GET /plans/organization/:organizationId
Response: {
  success: boolean;
  data: PlanResponseDto[];
}
```

### Update Plan
```typescript
PUT /plans/:id
Body: {
  name?: string;
  description?: string;
  price?: number;
  billing_cycle?: 'monthly' | 'yearly';
  is_active?: boolean;
  features?: {
    feature_id: string;
    feature_limit: number;
    is_unlimited: boolean;
  }[];
}
Response: {
  success: boolean;
  data: PlanResponseDto;
}
```

## 📋 Subscription Management

### Create Subscription
```typescript
POST /subscriptions
Body: {
  user_id: string;
  plan_id: string;
  start_date: string; // ISO date
  end_date: string;   // ISO date
  is_active?: boolean;
}
Response: {
  success: boolean;
  data: SubscriptionResponseDto;
}
```

### Get User Subscriptions
```typescript
GET /subscriptions/user/:userId
Response: {
  success: boolean;
  data: SubscriptionResponseDto[];
}
```

### Get Active User Subscriptions
```typescript
GET /subscriptions/user/:userId/active
Response: {
  success: boolean;
  data: SubscriptionResponseDto[];
}
```

### Cancel Subscription
```typescript
PATCH /subscriptions/:id/cancel
Response: {
  success: boolean;
  data: SubscriptionResponseDto;
}
```

## 📊 Usage Tracking

### Create Usage Record
```typescript
POST /usage
Body: {
  user_id: string;
  feature_id: string;
  usage_count: number;
  usage_date?: string; // ISO date
}
Response: {
  success: boolean;
  data: UsageResponseDto;
}
```

### Get User Usage
```typescript
GET /usage/user/:userId
Response: {
  success: boolean;
  data: UsageResponseDto[];
}
```

### Get Total Usage by User and Feature
```typescript
GET /usage/user/:userId/feature/:featureId/total
Response: {
  success: boolean;
  data: {
    total: number;
  };
}
```

## 🔧 Authentication Headers
```typescript
// Add to all authenticated requests
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 📱 Frontend Implementation Flow

### 1. Initial Setup
1. Create Organization
2. Register Admin User
3. Login Admin User
4. Store JWT token

### 2. Feature Setup
1. Create Features for your organization
2. Create Plans with feature limits
3. Assign plans to users

### 3. User Management
1. Create users under organization
2. Assign subscriptions to users
3. Track usage per user/feature

### 4. Dashboard Data
- Get organization details
- List all users with pagination
- Show active subscriptions
- Display usage analytics

## ⚠️ Important Notes

1. **Date Handling**: All dates should be in ISO format (`new Date().toISOString()`)
2. **Error Handling**: All responses have `success: boolean` field
3. **Pagination**: Use `page` and `limit` query parameters
4. **Authentication**: JWT token required for all routes except auth routes
5. **IDs**: All IDs are MongoDB ObjectId strings (24 characters)

## 🎯 Common Frontend Patterns

### API Service Example
```typescript
class ApiService {
  private baseURL = 'http://localhost:3000/api';
  private token = localStorage.getItem('token');

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    return response.json();
  }

  // Auth
  login = (data: LoginDto) => this.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Organizations
  createOrganization = (data: CreateOrganizationDto) => 
    this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });

  // Features
  getFeatures = (orgId: string) => 
    this.request(`/features/organization/${orgId}`);

  // Plans
  createPlan = (data: CreatePlanDto) => 
    this.request('/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
}
```

This guide provides everything your frontend team needs to integrate with the backend API! 🚀