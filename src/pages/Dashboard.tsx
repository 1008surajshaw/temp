import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import FeaturesPage from './FeaturesPage';
import OrganizationsPage from './OrganizationsPage';
import UsersPage from './UsersPage';

// Dashboard page components
const PlansPage = () => <div><h1 className="text-2xl font-bold">Plans Management</h1></div>;
const SubscriptionsPage = () => <div><h1 className="text-2xl font-bold">Subscriptions Management</h1></div>;
const AnalyticsPage = () => <div><h1 className="text-2xl font-bold">Analytics Dashboard</h1></div>;
const DashboardHome = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Welcome to Owner Dashboard</h1>
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
  </div>
);

export default function Dashboard() {
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