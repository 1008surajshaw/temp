import { useState, useEffect } from 'react';
import { featureUserService } from '../services/featureUser';
import { userPlanService } from '../services/userPlan';
import { planService } from '../services/plan';
import { useOrganization } from '../hooks/useOrganization';
import { FeatureUser, UserPlan, Plan } from '../types/api';
import Modal from '../components/Modal';

export default function UsersPage() {
  const { currentOrg } = useOrganization();
  const [users, setUsers] = useState<FeatureUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<FeatureUser | null>(null);
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [planHistory, setPlanHistory] = useState<UserPlan[]>([]);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (currentOrg) {
      loadUsers();
      loadPlans();
    }
  }, [currentOrg]);

  const loadUsers = async () => {
    if (!currentOrg) return;
    
    try {
      const users = await featureUserService.getByOrganization(currentOrg.id);
      setUsers(users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    if (!currentOrg) return;
    
    try {
      const plans = await planService.getByOrganization(currentOrg.id);
      setAvailablePlans(plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const handleViewDetails = async (user: FeatureUser) => {
    setSelectedUser(user);
    try {
      const [plans, history] = await Promise.all([
        userPlanService.getByUser(user.id),
        userPlanService.getHistory(user.id)
      ]);
      setUserPlans(plans);
      setPlanHistory(history);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to load user details:', error);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      try {
        await featureUserService.deactivate(userId);
        loadUsers();
      } catch (error) {
        console.error('Failed to deactivate user:', error);
      }
    }
  };

  const handleAssignPlan = async () => {
    if (!selectedUser || !selectedPlanId || !expiryDate || !currentOrg) return;

    try {
      await userPlanService.create({
        userId: selectedUser.id,
        planId: selectedPlanId,
        organizationId: currentOrg.id,
        expiryDate: expiryDate
      });
      setSelectedPlanId('');
      setExpiryDate('');
      setShowPlanModal(false);
      handleViewDetails(selectedUser);
    } catch (error) {
      console.error('Failed to assign plan:', error);
    }
  };

  const handleUpgradePlan = async (userPlanId: string, newPlanId: string) => {
    try {
      await userPlanService.upgrade(userPlanId, { newPlanId });
      if (selectedUser) {
        handleViewDetails(selectedUser);
      }
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
    }
  };

  const handleDowngradePlan = async (userPlanId: string, newPlanId: string) => {
    try {
      await userPlanService.downgrade(userPlanId, { newPlanId });
      if (selectedUser) {
        handleViewDetails(selectedUser);
      }
    } catch (error) {
      console.error('Failed to downgrade plan:', error);
    }
  };

  const handleExtendPlan = async (userPlanId: string, newExpiryDate: string) => {
    try {
      await userPlanService.extend(userPlanId, { newExpiryDate });
      if (selectedUser) {
        handleViewDetails(selectedUser);
      }
    } catch (error) {
      console.error('Failed to extend plan:', error);
    }
  };

  const handleRemovePlan = async (userPlanId: string) => {
    if (confirm('Are you sure you want to remove this plan?')) {
      try {
        await userPlanService.remove(userPlanId);
        if (selectedUser) {
          handleViewDetails(selectedUser);
        }
      } catch (error) {
        console.error('Failed to remove plan:', error);
      }
    }
  };

  const getPlanName = (planId: string) => {
    const plan = availablePlans.find(p => p.id === planId);
    return plan ? plan.name : 'Unknown Plan';
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
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      {users.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Users will appear here when you create them through features.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                <p>Usage: {user.usageCount || 0}</p>
                <p>Last Used: {user.lastUsed ? new Date(user.lastUsed).toLocaleDateString() : 'Never'}</p>
                <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(user)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                >
                  View Details
                </button>
                {user.isActive && (
                  <button
                    onClick={() => handleDeactivateUser(user.id)}
                    className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`User Details - ${selectedUser?.name}`}
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Profile */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Profile Information</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                <p><strong>Usage Count:</strong> {selectedUser.usageCount || 0}</p>
                <p><strong>Last Used:</strong> {selectedUser.lastUsed ? new Date(selectedUser.lastUsed).toLocaleString() : 'Never'}</p>
                <p><strong>Access Token:</strong> {selectedUser.accessToken.substring(0, 20)}...</p>
              </div>
            </div>

            {/* Active Plans */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Active Plans</h3>
                <button
                  onClick={() => setShowPlanModal(true)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Assign Plan
                </button>
              </div>
              
              {userPlans.length === 0 ? (
                <p className="text-gray-500">No active plans</p>
              ) : (
                <div className="space-y-3">
                  {userPlans.map((plan) => (
                    <div key={plan.id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{getPlanName(plan.planId)}</p>
                          <p className="text-sm text-gray-600">
                            Expires: {new Date(plan.expiryDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Purchased: {new Date(plan.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2 text-sm">
                        <select
                          onChange={(e) => e.target.value && handleUpgradePlan(plan.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="">Upgrade to...</option>
                          {availablePlans.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        
                        <input
                          type="date"
                          onChange={(e) => e.target.value && handleExtendPlan(plan.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                          title="Extend to date"
                        />
                        
                        <button
                          onClick={() => handleRemovePlan(plan.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan History */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Plan History</h3>
              {planHistory.length === 0 ? (
                <p className="text-gray-500">No plan history</p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {planHistory.map((plan) => (
                    <div key={plan.id} className="text-sm border-l-2 border-gray-200 pl-3">
                      <p className="font-medium">{getPlanName(plan.planId)}</p>
                      <p className="text-gray-600">
                        {new Date(plan.purchaseDate).toLocaleDateString()} - {new Date(plan.expiryDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {plan.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Plan Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title="Assign Plan"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Plan</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a plan...</option>
              {availablePlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowPlanModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignPlan}
              disabled={!selectedPlanId || !expiryDate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Assign Plan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}