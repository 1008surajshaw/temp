// Frontend TypeScript Types
// Copy these types to your frontend project

// ============= API Response Types =============
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============= Authentication Types =============
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  organization_id: string;
  name: string;
  email: string;
  password: string;
  user_type: 'admin' | 'user';
}

export interface VerifyEmailDto {
  token: string;
}

export interface AuthResponse {
  user: UserResponseDto;
  token: string;
}

// ============= Organization Types =============
export interface CreateOrganizationDto {
  name: string;
  description?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface OrganizationResponseDto {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= User Types =============
export interface CreateUserDto {
  organization_id: string;
  name: string;
  email: string;
  password: string;
  user_type: 'admin' | 'user';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  user_type?: 'admin' | 'user';
  is_active?: boolean;
  is_verified?: boolean;
}

export interface UserResponseDto {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  user_type: 'admin' | 'user';
  is_active: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Feature Types =============
export interface CreateFeatureDto {
  organization_id: string;
  name: string;
  feature_key: string;
  description?: string;
}

export interface UpdateFeatureDto {
  name?: string;
  feature_key?: string;
  description?: string;
  is_active?: boolean;
}

export interface FeatureResponseDto {
  id: string;
  organization_id: string;
  name: string;
  feature_key: string;
  description: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Plan Types =============
export interface PlanFeatureDto {
  feature_id: string;
  feature_limit: number;
  is_unlimited: boolean;
}

export interface CreatePlanDto {
  organization_id: string;
  name: string;
  description?: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: PlanFeatureDto[];
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  price?: number;
  billing_cycle?: 'monthly' | 'yearly';
  is_active?: boolean;
  features?: PlanFeatureDto[];
}

export interface PlanFeatureResponseDto {
  id: string;
  feature_id: string;
  feature_name: string;
  feature_key: string;
  feature_limit: number;
  is_unlimited: boolean;
}

export interface PlanResponseDto {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  is_active: boolean;
  features: PlanFeatureResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

// ============= Subscription Types =============
export interface CreateSubscriptionDto {
  user_id: string;
  plan_id: string;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
  is_active?: boolean;
}

export interface UpdateSubscriptionDto {
  start_date?: string; // ISO date string
  end_date?: string;   // ISO date string
  is_active?: boolean;
}

export interface SubscriptionResponseDto {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Usage Types =============
export interface CreateUsageDto {
  user_id: string;
  feature_id: string;
  usage_count: number;
  usage_date?: string; // ISO date string
}

export interface UpdateUsageDto {
  usage_count?: number;
  usage_date?: string; // ISO date string
}

export interface UsageResponseDto {
  id: string;
  user_id: string;
  feature_id: string;
  feature_name: string;
  feature_key: string;
  usage_count: number;
  usage_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Frontend Utility Types =============
export interface User {
  id: string;
  name: string;
  email: string;
  user_type: 'admin' | 'user';
  is_active: boolean;
  is_verified: boolean;
  organization_id: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Feature {
  id: string;
  name: string;
  feature_key: string;
  description: string;
  is_active: boolean;
  organization_id: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  is_active: boolean;
  features: PlanFeatureResponseDto[];
  organization_id: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
}

export interface Usage {
  id: string;
  user_id: string;
  feature_id: string;
  feature_name: string;
  feature_key: string;
  usage_count: number;
  usage_date: Date;
}

// ============= Form Types for Frontend =============
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  organization_id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  user_type: 'admin' | 'user';
}

export interface OrganizationForm {
  name: string;
  description: string;
}

export interface FeatureForm {
  name: string;
  feature_key: string;
  description: string;
}

export interface PlanForm {
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: {
    feature_id: string;
    feature_limit: number;
    is_unlimited: boolean;
  }[];
}

export interface SubscriptionForm {
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
}

// ============= API Service Types =============
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

// ============= State Management Types =============
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface OrganizationState {
  current: Organization | null;
  isLoading: boolean;
}

export interface UsersState {
  users: User[];
  currentUser: User | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
}

export interface FeaturesState {
  features: Feature[];
  isLoading: boolean;
}

export interface PlansState {
  plans: Plan[];
  currentPlan: Plan | null;
  isLoading: boolean;
}

export interface SubscriptionsState {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  isLoading: boolean;
}

export interface UsageState {
  usage: Usage[];
  totalUsage: Record<string, number>; // featureId -> total
  isLoading: boolean;
}