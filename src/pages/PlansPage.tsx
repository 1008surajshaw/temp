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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
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

  const handleViewDetails = async (planId: string) => {
    try {
      const planDetails = await planService.getById(planId);
      setSelectedPlan(planDetails);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to load plan details:', error);
    }
  };

  const updatePlanFeature = async (featureId: string, newLimit: number, isUnlimited: boolean) => {
    if (!selectedPlan) return;
    
    try {
      const updatedFeatures = selectedPlan.features.map(f => 
        f.featureId === featureId ? { ...f, limit: newLimit, isUnlimited } : f
      );
      
      const updatedPlan = await planService.update(selectedPlan.id, { features: updatedFeatures });
      setSelectedPlan(updatedPlan);
      loadData();
    } catch (error) {
      console.error('Failed to update feature:', error);
    }
  };

  const addFeatureToPlan = async (featureId: string) => {
    if (!selectedPlan) return;
    
    try {
      const newFeature: FeatureLimit = { featureId, limit: 100, isUnlimited: false };
      const updatedFeatures = [...selectedPlan.features, newFeature];
      
      const updatedPlan = await planService.update(selectedPlan.id, { features: updatedFeatures });
      setSelectedPlan(updatedPlan);
      loadData();
    } catch (error) {
      console.error('Failed to add feature:', error);
    }
  };

  const removeFeatureFromPlan = async (featureId: string) => {
    if (!selectedPlan) return;
    
    try {
      const updatedFeatures = selectedPlan.features.filter(f => f.featureId !== featureId);
      const updatedPlan = await planService.update(selectedPlan.id, { features: updatedFeatures });
      setSelectedPlan(updatedPlan);
      loadData();
    } catch (error) {
      console.error('Failed to remove feature:', error);
    }
  };

  const updatePlanPricing = async (price: number) => {
    if (!selectedPlan) return;
    
    try {
      const updatedPlan = await planService.update(selectedPlan.id, { price });
      setSelectedPlan(updatedPlan);
      loadData();
    } catch (error) {
      console.error('Failed to update pricing:', error);
    }
  };

  const getFeatureName = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    return feature ? feature.name : 'Unknown Feature';
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
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm ${
                plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => handleViewDetails(plan.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Manage Details
              </button>
            </div>
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

      {/* Plan Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Manage Plan - ${selectedPlan?.name}`}
      >
        {selectedPlan && (
          <div className="space-y-6">
            {/* Pricing Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Pricing</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Price: $</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={selectedPlan.price}
                  onChange={(e) => updatePlanPricing(parseFloat(e.target.value))}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Features Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Features & Limits</h3>
              {selectedPlan.features.length === 0 ? (
                <p className="text-gray-500">No features added yet.</p>
              ) : (
                <div className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="border rounded p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{getFeatureName(feature.featureId)}</h4>
                        <button
                          onClick={() => removeFeatureFromPlan(feature.featureId)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={feature.isUnlimited}
                            onChange={(e) => updatePlanFeature(
                              feature.featureId,
                              feature.limit,
                              e.target.checked
                            )}
                            className="mr-1"
                          />
                          <span className="text-sm">Unlimited</span>
                        </label>
                        
                        {!feature.isUnlimited && (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">Limit:</span>
                            <input
                              type="number"
                              min="1"
                              value={feature.limit}
                              onChange={(e) => updatePlanFeature(
                                feature.featureId,
                                parseInt(e.target.value),
                                feature.isUnlimited
                              )}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Feature Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Add Feature</h3>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addFeatureToPlan(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select feature to add...</option>
                {features
                  .filter(f => !selectedPlan.features.some(pf => pf.featureId === f.id))
                  .map(feature => (
                    <option key={feature.id} value={feature.id}>
                      {feature.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}