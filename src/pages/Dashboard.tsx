import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Dashboard page components
const UsersPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1></div>;
const FeaturesPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Features Management</h1></div>;
const PlansPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Plans Management</h1></div>;
const SubscriptionsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Subscriptions Management</h1></div>;
const AnalyticsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Analytics Dashboard</h1></div>;
const OrganizationsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Organizations Management</h1></div>;
const DashboardHome = () => (
  <div className="p-6">
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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
        </Routes>
      </div>
    </div>
  );
}