export interface CreateUsageDto {
  user_id: string;
  feature_id: string;
  usage_count: number;
  usage_date?: Date;
}

export interface UpdateUsageDto {
  usage_count?: number;
  usage_date?: Date;
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