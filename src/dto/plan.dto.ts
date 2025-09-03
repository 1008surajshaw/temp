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

export interface PlanFeatureDto {
  feature_id: string;
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

export interface PlanFeatureResponseDto {
  id: string;
  feature_id: string;
  feature_name: string;
  feature_key: string;
  feature_limit: number;
  is_unlimited: boolean;
}