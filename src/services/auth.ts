import { apiClient } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, Owner } from '../types/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/owners/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data!;
  },

  async register(userData: RegisterRequest): Promise<Owner> {
    const response = await apiClient.post<Owner>('/owners/register', userData);
    return response.data!;
  },

  async getProfile(): Promise<Owner> {
    const response = await apiClient.get<Owner>('/owners/profile');
    return response.data!;
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