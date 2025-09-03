import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useCreateUsage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiService.createUsage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-usage'] });
    },
  });
};