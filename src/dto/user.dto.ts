export interface CreateUserDto {
  organization_id: string;
  name: string;
  email: string;
  password: string;
  user_type?: 'admin' | 'user';
}

export interface VerifyEmailDto {
  token: string;
  resend?: boolean;
}

export interface ResendVerificationDto {
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
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