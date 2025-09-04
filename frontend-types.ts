// ============================================
// FRONTEND TYPESCRIPT TYPES
// ============================================

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// ============================================
// AUTHENTICATION TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  accountType: 'admin' | 'superadmin';
  organizationId?: string;
}

export interface AuthResponse {
  token: string;
  owner: Owner;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  accountType: string;
  organizationId?: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// ORGANIZATION TYPES
// ============================================

export interface CreateOrganizationRequest {
  name: string;
  description: string;
  ownerId: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// FEATURE TYPES
// ============================================

export interface CreateFeatureRequest {
  name: string;
  description: string;
  organizationId: string;
}

export interface UpdateFeatureRequest {
  name?: string;
  description?: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// PLAN TYPES
// ============================================

export interface FeatureLimit {
  featureId: string;
  limit: number;
  isUnlimited: boolean;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  organizationId: string;
  features: FeatureLimit[];
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  price?: number;
  features?: FeatureLimit[];
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  features: FeatureLimit[];
  price: number;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// FEATURE USER TYPES
// ============================================

export interface CreateFeatureUserRequest {
  name: string;
  email: string;
  featureId: string;
  organizationId: string;
}

export interface FeatureUser {
  id: string;
  name: string;
  email: string;
  featureId: string;
  organizationId: string;
  accessToken: string;
  isActive: boolean;
  usageCount: number;
  lastUsed: string;
  createdAt: string;
}

export interface ValidateTokenRequest {
  accessToken: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  userId?: string;
  featureId?: string;
  organizationId?: string;
}

// ============================================
// USER PLAN TYPES
// ============================================

export interface CreateUserPlanRequest {
  userId: string;
  planId: string;
  organizationId: string;
  expiryDate: string; // ISO date string
}

export interface UserPlan {
  id: string;
  userId: string;
  planId: string;
  organizationId: string;
  accessToken: string;
  purchaseDate: string;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpgradePlanRequest {
  newPlanId: string;
}

export interface DowngradePlanRequest {
  newPlanId: string;
}

export interface ExtendExpiryRequest {
  newExpiryDate: string; // ISO date string
}

// ============================================
// USAGE TRACKING TYPES
// ============================================

export interface TrackUsageRequest {
  accessToken: string;
  featureId: string;
}

export interface UsageResponse {
  currentUsage: number;
  limit: number | 'unlimited';
  remaining: number | 'unlimited';
}

export interface Usage {
  id: string;
  userId: string;
  featureId: string;
  planId: string;
  organizationId: string;
  usageCount: number;
  lastUsed: string;
  createdAt: string;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface Analytics {
  id: string;
  organizationId: string;
  featureId: string;
  date: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  limitExceededCount: number;
  averageResponseTime: number;
}

export interface DashboardStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  limitExceededCount: number;
  avgResponseTime: number;
}

// ============================================
// COMMON TYPES
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ============================================
// ERROR TYPES
// ============================================

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

// ============================================
// FORM VALIDATION TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  loading: boolean;
  submitted: boolean;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardData {
  organizations: Organization[];
  features: Feature[];
  plans: Plan[];
  users: FeatureUser[];
  userPlans: UserPlan[];
  analytics: DashboardStats;
}

// ============================================
// UTILITY TYPES
// ============================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// API CLIENT TYPES
// ============================================

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}