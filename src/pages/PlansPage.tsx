import { useState, useEffect } from 'react';
import { planService } from '../services/plan';
import { featureService } from '../services/feature';
import { useOrganization } from '../hooks/useOrganization';
import { Plan, CreatePlanRequest, Feature } from '../types/api';
import Modal from '../components/Modal';

export default function PlansPage() {
  const { currentOrg } = useOrganization();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newPlan, setNewPlan] = useState<CreatePlanRequest>({
    name: '',
    description: '',
    price: 0,
    organizationId: '',
    features: []
  });

  useEffect(() => {
    if (currentOrg) {
      loadData();
    }
  }, [currentOrg]);

  const loadData = async () => {
    if (!currentOrg) return;
    
    try {
      const [plansData, featuresData] = await Promise.all([
        planService.getByOrganization(currentOrg.id),
        featureService.getByOrganization(currentOrg.id)
      ]);
      setPlans(plansData);
      setFeatures(featuresData);
      setNewPlan(prev => ({ ...prev, organizationId: currentOrg.id }));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await planService.create(newPlan);
      setNewPlan({ name: '', description: '', price: 0, organizationId: currentOrg?.id || '', features: [] });
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to create plan:', error);
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
        <h1 className="text-2xl font-bold">Plans Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-2">{plan.description}</p>
            <p className="text-2xl font-bold text-green-600 mb-4">${plan.price}</p>
            <div className="text-sm text-gray-500 mb-4">
              {plan.features.length} features included
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {plan.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Plan"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPlan.name}
              onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={newPlan.description}
              onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPlan.price}
              onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value)})}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}