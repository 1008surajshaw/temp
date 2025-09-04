import { useState, useEffect } from 'react';
import { planService } from '../services/plan';
import { featureService } from '../services/feature';
import { useOrganization } from '../hooks/useOrganization';
import { Plan, CreatePlanRequest, Feature, FeatureLimit } from '../types/api';
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

  const addFeatureLimit = () => {
    if (features.length === 0) return;
    const newFeatureLimit: FeatureLimit = {
      featureId: features[0].id,
      limit: 100,
      isUnlimited: false
    };
    setNewPlan(prev => ({
      ...prev,
      features: [...prev.features, newFeatureLimit]
    }));
  };

  const removeFeatureLimit = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeatureLimit = (index: number, field: keyof FeatureLimit, value: any) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
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
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Features & Limits</label>
              <button
                type="button"
                onClick={addFeatureLimit}
                className="text-blue-600 hover:text-blue-800 text-sm"
                disabled={features.length === 0}
              >
                + Add Feature
              </button>
            </div>
            
            {newPlan.features.map((featureLimit, index) => (
              <div key={index} className="border rounded-md p-3 mb-2 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <select
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm mr-2"
                    value={featureLimit.featureId}
                    onChange={(e) => updateFeatureLimit(index, 'featureId', e.target.value)}
                  >
                    {features.map((feature) => (
                      <option key={feature.id} value={feature.id}>{feature.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeFeatureLimit(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={featureLimit.isUnlimited}
                      onChange={(e) => updateFeatureLimit(index, 'isUnlimited', e.target.checked)}
                      className="mr-1"
                    />
                    <span className="text-sm">Unlimited</span>
                  </label>
                  
                  {!featureLimit.isUnlimited && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">Limit:</span>
                      <input
                        type="number"
                        min="1"
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        value={featureLimit.limit}
                        onChange={(e) => updateFeatureLimit(index, 'limit', parseInt(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {newPlan.features.length === 0 && (
              <p className="text-gray-500 text-sm">No features added yet. Click "Add Feature" to include features in this plan.</p>
            )}
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