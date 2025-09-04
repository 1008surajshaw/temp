import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import OrganizationSelector from './OrganizationSelector';
import { useOrganization } from '../hooks/useOrganization';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentOrg } = useOrganization();
  const { owner } = useAuth();

  // Don't show organization selector if user hasn't created organization yet
  const showOrgSelector = owner?.organizationCreated;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {currentOrg ? `${currentOrg.name} Dashboard` : 'Owner Dashboard'}
            </h1>
            {showOrgSelector && <OrganizationSelector />}
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}