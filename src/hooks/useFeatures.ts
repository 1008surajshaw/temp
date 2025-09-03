import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { CreateFeatureDto, UpdateFeatureDto } from '../types/frontend-types';

export const useFeatures = (orgId: string) => {
  return useQuery({
    queryKey: ['features', orgId],
    queryFn: () => apiService.getFeatures(orgId),
    enabled: !!orgId,
  });
};

export const useCreateFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFeatureDto) => apiService.createFeature(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['features', variables.organization_id] });
    },
  });
};

export const useUpdateFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeatureDto }) => 
      apiService.updateFeature(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
};

export const useToggleFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.toggleFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
};