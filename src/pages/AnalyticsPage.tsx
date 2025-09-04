import { useState, useEffect } from 'react';
import { useOrganization } from '../hooks/useOrganization';

export default function AnalyticsPage() {
  const { currentOrg } = useOrganization();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFeatures: 0,
    totalPlans: 0,
    activeSubscriptions: 0
  });

  useEffect(() => {
    if (currentOrg) {
      // Mock data - in real app, fetch from analytics service
      setStats({
        totalUsers: 0,
        totalFeatures: 0,
        totalPlans: 0,
        activeSubscriptions: 0
      });
    }
  }, [currentOrg]);

  if (!currentOrg) {
    return <div className="text-center py-8">Please select an organization first.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-green-600">Active Features</h3>
          <p className="text-3xl font-bold">{stats.totalFeatures}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-purple-600">Total Plans</h3>
          <p className="text-3xl font-bold">{stats.totalPlans}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-orange-600">Active Subscriptions</h3>
          <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Organization: {currentOrg.name}</h3>
        <p className="text-gray-600">Analytics data will be displayed here when available.</p>
      </div>
    </div>
  );
}