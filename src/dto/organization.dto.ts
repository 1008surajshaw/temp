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