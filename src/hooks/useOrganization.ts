import { useState, useEffect } from 'react';
import { organizationService } from '../services/organization';
import { useAuth } from './useAuth';
import { Organization } from '../types/api';

export const useOrganization = () => {
  const { owner } = useAuth();
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(() => {
    const saved = localStorage.getItem('currentOrganization');
    return saved ? JSON.parse(saved) : null;
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    if (owner?.organizationCreated && organizations.length === 0) {
      loadOrganizations();
    }
  }, [owner, organizations.length]);

  const loadOrganizations = async () => {
    if (!owner?.id) return;
    
    try {
      const orgs = await organizationService.getByOwner(owner.id);
      setOrganizations(orgs);
      
      // If no current org or current org not in list, set first one
      if (orgs.length > 0) {
        const savedOrgExists = currentOrg && orgs.find(org => org.id === currentOrg.id);
        if (!savedOrgExists) {
          const newCurrentOrg = orgs[0];
          setCurrentOrg(newCurrentOrg);
          localStorage.setItem('currentOrganization', JSON.stringify(newCurrentOrg));
        }
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    }
  };

  const refreshOrganizations = async () => {
    await loadOrganizations();
  };

  const updateCurrentOrg = (org: Organization) => {
    setCurrentOrg(org);
    localStorage.setItem('currentOrganization', JSON.stringify(org));
  };

  const selectOrganization = (org: Organization) => {
    updateCurrentOrg(org);
  };

  return {
    currentOrg,
    setCurrentOrg: updateCurrentOrg,
    selectOrganization,
    organizations,
    loadOrganizations,
    refreshOrganizations
  };
};