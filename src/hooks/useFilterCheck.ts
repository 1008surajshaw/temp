import { EventQueryType } from '@/types';
import { useMemo } from 'react';

export const useFilterCheck = (formValues: EventQueryType) => {
  const isAnyFilterSelected = useMemo(() => {
    return ['category' ,'format' ,'type' ,'status'].some((key) => {
      const value = formValues[key as keyof EventQueryType];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    });
  }, [formValues]);

  return isAnyFilterSelected;
};
