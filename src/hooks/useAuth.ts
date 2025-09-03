import { useMutation, useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { LoginDto, RegisterDto, User } from '../types/frontend-types';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginDto) => apiService.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => apiService.register(data),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => apiService.verifyEmail(token),
  });
};

export const useAuth = () => {
  const getStoredUser = (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const getStoredToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const isAuthenticated = () => {
    return !!getStoredToken() && !!getStoredUser();
  };

  return {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: isAuthenticated(),
    logout,
  };
};