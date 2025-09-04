import { useState, useEffect } from 'react';
import { userPlanService } from '../services/userPlan';
import { useOrganization } from '../hooks/useOrganization';
import { UserPlan } from '../types/api';

export default function SubscriptionsPage() {
  const { currentOrg } = useOrganization();
  const [subscriptions, setSubscriptions] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentOrg) {
      loadSubscriptions();
    }
  }, [currentOrg]);

  const loadSubscriptions = async () => {
    if (!currentOrg) return;
    
    try {
      const data = await userPlanService.getByOrganization(currentOrg.id);
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentOrg) {
    return <div className="text-center py-8">Please select an organization first.</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscriptions Management</h1>
      </div>

      {subscriptions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
          <p className="text-gray-500">User subscriptions will appear here when created.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <li key={subscription.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">User ID: {subscription.userId}</p>
                    <p className="text-sm text-gray-500">Plan ID: {subscription.planId}</p>
                    <p className="text-xs text-gray-400">
                      Expires: {new Date(subscription.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}