import { useState, useEffect } from 'react';
import { useOrganization } from '../hooks/useOrganization';
import { analyticsService } from '../services/analytics';
import { DashboardStats, DashboardResponse } from '../types/api';

export default function AnalyticsPage() {
  const { currentOrg } = useOrganization();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (currentOrg) {
      loadAnalytics();
    }
  }, [currentOrg]);

  const loadAnalytics = async () => {
    if (!currentOrg) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getComprehensiveDashboard(currentOrg.id);
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    analyticsService.clearCache();
    await loadAnalytics();
  };

  if (!currentOrg) {
    return <div className="text-center py-8">Please select an organization first.</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refreshAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-center py-8">No analytics data available.</div>;
  }

  const { data: stats } = dashboardData;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">{dashboardData.organizationName}</p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refreshAnalytics}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-blue-600">Total Users</h3>
          <p className="text-2xl font-bold">{stats.overview.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-green-600">Features</h3>
          <p className="text-2xl font-bold">{stats.overview.totalFeatures.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-purple-600">Plans</h3>
          <p className="text-2xl font-bold">{stats.overview.totalPlans.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-orange-600">Active Plans</h3>
          <p className="text-2xl font-bold">{stats.overview.activeUserPlans.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-indigo-600">Revenue</h3>
          <p className="text-2xl font-bold">${stats.overview.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-pink-600">MAU</h3>
          <p className="text-2xl font-bold">{stats.overview.monthlyActiveUsers.toLocaleString()}</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>New Users This Month:</span>
              <span className="font-semibold">{stats.userStats.newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span>Growth Rate:</span>
              <span className="font-semibold text-green-600">{stats.userStats.userGrowthRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Active Today:</span>
              <span className="font-semibold">{stats.userStats.activeUsersToday}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Active Users</h3>
          <div className="space-y-2">
            {stats.userStats.topActiveUsers.slice(0, 5).map((user, index) => (
              <div key={user.userId} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{user.userName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className="text-sm font-semibold">{user.totalUsage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Stats */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Most Popular Features</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Usage</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Avg/User</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.featureStats.mostPopularFeatures.slice(0, 5).map((feature) => (
                <tr key={feature.featureId}>
                  <td className="px-4 py-2 text-sm font-medium">{feature.featureName}</td>
                  <td className="px-4 py-2 text-sm">{feature.userCount}</td>
                  <td className="px-4 py-2 text-sm">{feature.totalUsage.toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm">{feature.avgUsagePerUser.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Popular Plans</h3>
          <div className="space-y-3">
            {stats.planStats.mostPopularPlans.slice(0, 3).map((plan) => (
              <div key={plan.planId} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{plan.planName}</p>
                  <p className="text-sm text-gray-500">${plan.price}/month</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{plan.subscriberCount} users</p>
                  <p className="text-sm text-green-600">${plan.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Usage Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total API Calls:</span>
              <span className="font-semibold">{stats.usageStats.totalApiCalls.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Success Rate:</span>
              <span className="font-semibold text-green-600">{stats.usageStats.successRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Response Time:</span>
              <span className="font-semibold">{stats.usageStats.avgResponseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Limit Exceeded:</span>
              <span className="font-semibold text-red-600">{stats.performanceStats.limitExceededCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}