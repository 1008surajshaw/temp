import { useState } from 'react';
import { authService } from '../services/auth';
import { LoginRequest, RegisterRequest } from '../types/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      await authService.login(credentials);
      setIsAuthenticated(true);
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    try {
      await authService.register(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    loading
  };
};