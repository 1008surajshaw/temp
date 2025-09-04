import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { LoginRequest, RegisterRequest, Owner } from '../types/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setOwner(profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setOwner(response.owner);
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
    owner,
    loading,
    loadProfile
  };
};