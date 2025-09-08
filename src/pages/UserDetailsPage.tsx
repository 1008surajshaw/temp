import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userPlanService } from '../services/userPlan';
import { featureUserService } from '../services/featureUser';

interface UserDetails {
  user: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    billingCycle: string;
  };
  subscription: {
    id: string;
    purchaseDate: string;
    expiryDate: string;
    isActive: boolean;
    daysRemaining: number;
  };
  features: Array<{
    featureId: string;
    featureName: string;
    featureDescription: string;
    limit: number | string;
    currentUsage: number;
    remaining: number | string;
    isUnlimited: boolean;
    usagePercentage: number;
    lastUsed: string | null;
  }>;
  organization: {
    id: string;
    name: string;
  };
}

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [planHistory, setPlanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserDetails();
    }
  }, [userId]);

  const loadUserDetails = async () => {
    if (!userId) return;
    
    try {
      // Get user basic info first
      const user = await featureUserService.getById(userId);
      
      // Get user details using access token
      const details = await userPlanService.getUserDetails(user.accessToken);
      setUserDetails(details);
      
      // Get plan history
      const history = await userPlanService.getHistory(userId);
      setPlanHistory(history);
    } catch (error) {
      console.error('Failed to load user details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!userDetails) {
    return <div className="text-center py-8">User not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="text-sm text-gray-600">
          <span>Users</span> &gt; <span className="font-medium">{userDetails.user.name}</span>
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{userDetails.user.name}</h1>
            <p className="text-gray-600">{userDetails.user.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            userDetails.user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {userDetails.user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Organization:</span>
            <p className="font-medium">{userDetails.organization.name}</p>
          </div>
          <div>
            <span className="text-gray-500">User ID:</span>
            <p className="font-mono text-xs">{userDetails.user.id}</p>
          </div>
        </div>
      </div>

      {/* Current Plan Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-lg">{userDetails.plan.name}</h3>
            <p className="text-gray-600 mb-2">{userDetails.plan.description}</p>
            <p className="text-2xl font-bold text-green-600">
              ${userDetails.plan.price}/{userDetails.plan.billingCycle}
            </p>
          </div>
          <div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Purchase Date:</span>
                <span>{new Date(userDetails.subscription.purchaseDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expiry Date:</span>
                <span>{new Date(userDetails.subscription.expiryDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Days Remaining:</span>
                <span className={`font-medium ${
                  userDetails.subscription.daysRemaining < 7 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {userDetails.subscription.daysRemaining} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  userDetails.subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {userDetails.subscription.isActive ? 'Active' : 'Expired'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Usage Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Feature Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userDetails.features.map((feature, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{feature.featureName}</h3>
                  <p className="text-sm text-gray-600">{feature.featureDescription}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {feature.lastUsed ? new Date(feature.lastUsed).toLocaleDateString() : 'Never used'}
                </span>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Usage: {feature.currentUsage}</span>
                  <span>
                    {feature.isUnlimited ? 'Unlimited' : `Limit: ${feature.limit}`}
                  </span>
                </div>
                
                {!feature.isUnlimited && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        feature.usagePercentage > 80 ? 'bg-red-500' : 
                        feature.usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(feature.usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{feature.usagePercentage.toFixed(1)}% used</span>
                  <span>
                    {feature.isUnlimited ? 'Unlimited remaining' : `${feature.remaining} remaining`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Plan History</h2>
        {planHistory.length === 0 ? (
          <p className="text-gray-500">No plan history available</p>
        ) : (
          <div className="space-y-3">
            {planHistory.map((plan, index) => (
              <div key={plan.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Plan #{index + 1}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(plan.purchaseDate).toLocaleDateString()} - {new Date(plan.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.isActive ? 'Active' : 'Expired'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}