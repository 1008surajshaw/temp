export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  user: {
    id: string;
    organization_id: string;
    name: string;
    email: string;
    user_type: 'admin' | 'user';
    is_active: boolean;
  };
  token: string;
  message: string;
}