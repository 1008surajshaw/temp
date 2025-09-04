import { useState, useEffect } from 'react';
import { useOrganization } from '../hooks/useOrganization';
import { analyticsService } from '../services/analytics';
import { DashboardStats, Analytics } from '../types/api';

export default function AnalyticsPage() {
  const { currentOrg } = useOrganization();
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    limitExceededCount: 0,
    avgResponseTime: 0
  });
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (currentOrg) {
      loadAnalytics();
    }
  }, [currentOrg]);

  const loadAnalytics = async () => {
    if (!currentOrg) return;
    
    setLoading(true);
    try {
      const [dashboardStats, orgAnalytics] = await Promise.all([
        analyticsService.getDashboardStats(currentOrg.id),
        analyticsService.getOrganizationAnalytics(currentOrg.id)
      ]);
      
      setStats(dashboardStats);
      setAnalytics(orgAnalytics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics:', error);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Total Requests</h3>
          <p className="text-3xl font-bold">{stats.totalRequests.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-green-600">Successful</h3>
          <p className="text-3xl font-bold">{stats.successfulRequests.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Failed</h3>
          <p className="text-3xl font-bold">{stats.failedRequests.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-orange-600">Limit Exceeded</h3>
          <p className="text-3xl font-bold">{stats.limitExceededCount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-purple-600">Avg Response</h3>
          <p className="text-3xl font-bold">{stats.avgResponseTime}ms</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Analytics Data</h3>
        {analytics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Response</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.slice(0, 10).map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.totalRequests.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((item.successfulRequests / item.totalRequests) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.averageResponseTime}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No analytics data available yet.</p>
        )}
      </div>
    </div>
  );
}