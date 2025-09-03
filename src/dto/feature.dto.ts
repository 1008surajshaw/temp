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