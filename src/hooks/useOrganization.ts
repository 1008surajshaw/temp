import { useState, useEffect } from 'react';
import { organizationService } from '../services/organization';
import { Organization } from '../types/api';

export const useOrganization = () => {
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const orgs = await organizationService.getAll();
      setOrganizations(orgs);
      if (orgs.length > 0 && !currentOrg) {
        setCurrentOrg(orgs[0]);
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    }
  };

  return {
    currentOrg,
    setCurrentOrg,
    organizations,
    loadOrganizations
  };
};