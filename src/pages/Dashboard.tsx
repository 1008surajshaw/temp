import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import FeaturesPage from './FeaturesPage';
import OrganizationsPage from './OrganizationsPage';
import UsersPage from './UsersPage';
import PlansPage from './PlansPage';
import SubscriptionsPage from './SubscriptionsPage';
import AnalyticsPage from './AnalyticsPage';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import { useOrganization } from '../hooks/useOrganization';
import { useAuth } from '../hooks/useAuth';
const DashboardHome = () => {
  const { currentOrg } = useOrganization();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {currentOrg ? `Welcome to ${currentOrg.name}` : 'Select an Organization'}
      </h1>
      {currentOrg ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Features</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Plans</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">Please create or select an organization to get started.</p>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { owner, loadProfile } = useAuth();
  const { refreshOrganizations } = useOrganization();

  const handleOrganizationCreated = async () => {
    await loadProfile();
    refreshOrganizations();
  };

  // Show sticky modal if user hasn't created organization
  if (owner && !owner.organizationCreated) {
    return (
      <>
        <Layout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome!</h1>
            <p className="text-gray-600">Please create your organization to continue.</p>
          </div>
        </Layout>
        <CreateOrganizationModal onSuccess={handleOrganizationCreated} />
      </>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
      </Routes>
    </Layout>
  );
}