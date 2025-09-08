// ============================================
// FRONTEND INTEGRATION HELP - COMPLETE PLAN MANAGEMENT
// ============================================

// ============================================
// 💳 PLAN MANAGEMENT PAGE GUIDE
// ============================================

export const PlanPageGuide = {
  pageStructure: {
    layout: "Grid of plan cards with modal for details",
    cardView: "Show basic plan info (name, price, feature count)",
    detailView: "Modal/sidebar with complete feature list and limits",
    actions: "Add/Remove features, Edit limits, Update pricing"
  },
  
  requiredAPIs: [
    "GET /api/plans - Get all plans",
    "GET /api/plans/:id - Get plan details", 
    "GET /api/features - Get available features",
    "PUT /api/plans/:id - Update plan",
    "POST /api/plans - Create new plan",
    "DELETE /api/plans/:id - Delete plan"
  ]
};

// ============================================
// 📋 API ENDPOINTS FOR PLAN MANAGEMENT
// ============================================

export const PlanAPIs = {
  // Get All Plans (Organization Filtered)
  getAllPlans: {
    endpoint: "GET /api/plans",
    auth: "Bearer JWT Token",
    request: "None",
    response: {
      success: true,
      data: [
        {
          id: "string",
          name: "string",
          description: "string", 
          organizationId: "string",
          price: "number",
          billingCycle: "monthly | annually",
          features: [
            {
              featureId: "string",
              limit: "number",
              isUnlimited: "boolean"
            }
          ],
          isActive: "boolean",
          createdAt: "Date"
        }
      ]
    }
  },

  // Get Plan Details with Populated Features
  getPlanDetails: {
    endpoint: "GET /api/plans/:id",
    auth: "Bearer JWT Token",
    request: { params: { id: "string" } },
    response: {
      success: true,
      data: {
        id: "string",
        name: "string",
        description: "string",
        organizationId: "string", 
        price: "number",
        billingCycle: "monthly | annually",
        features: [
          {
            featureId: {
              id: "string",
              name: "string",
              description: "string"
            },
            limit: "number",
            isUnlimited: "boolean"
          }
        ],
        isActive: "boolean",
        createdAt: "Date"
      }
    }
  },

  // Get Available Features
  getFeatures: {
    endpoint: "GET /api/features",
    auth: "Bearer JWT Token", 
    request: "None",
    response: {
      success: true,
      data: [
        {
          id: "string",
          name: "string",
          description: "string",
          organizationId: "string",
          isActive: "boolean"
        }
      ]
    }
  },

  // Update Plan
  updatePlan: {
    endpoint: "PUT /api/plans/:id",
    auth: "Bearer JWT Token",
    request: {
      params: { id: "string" },
      body: {
        name: "string (optional)",
        description: "string (optional)", 
        price: "number (optional)",
        billingCycle: "monthly | annually (optional)",
        features: [
          {
            featureId: "string",
            limit: "number", 
            isUnlimited: "boolean"
          }
        ]
      }
    },
    response: {
      success: true,
      data: "Updated Plan Object"
    }
  },

  // Create New Plan
  createPlan: {
    endpoint: "POST /api/plans",
    auth: "Bearer JWT Token",
    request: {
      body: {
        name: "string (required)",
        description: "string (required)",
        price: "number (required)",
        organizationId: "string (required)",
        billingCycle: "monthly | annually (optional, default: monthly)",
        features: [
          {
            featureId: "string",
            limit: "number",
            isUnlimited: "boolean"
          }
        ]
      }
    },
    response: {
      success: true,
      data: "New Plan Object"
    }
  }
};

// ============================================
// 🎨 REACT PLAN MANAGEMENT COMPONENT
// ============================================

export const ReactPlanComponent = `
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch plans and features on component mount
  useEffect(() => {
    fetchPlans();
    fetchFeatures();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/plans', {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      setPlans(response.data.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/features', {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      setFeatures(response.data.data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    }
  };

  const fetchPlanDetails = async (planId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(\`/api/plans/\${planId}\`, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      setSelectedPlan(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch plan details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlanFeature = async (featureId, newLimit, isUnlimited) => {
    try {
      const updatedFeatures = selectedPlan.features.map(f => 
        f.featureId.id === featureId 
          ? { ...f, limit: newLimit, isUnlimited }
          : f
      );

      const token = localStorage.getItem('authToken');
      const response = await axios.put(\`/api/plans/\${selectedPlan.id}\`, {
        features: updatedFeatures.map(f => ({
          featureId: f.featureId.id,
          limit: f.limit,
          isUnlimited: f.isUnlimited
        }))
      }, {
        headers: { Authorization: \`Bearer \${token}\` }
      });

      setSelectedPlan(response.data.data);
      fetchPlans(); // Refresh plan list
      alert('Plan updated successfully!');
    } catch (error) {
      console.error('Failed to update plan:', error);
      alert('Failed to update plan');
    }
  };

  const addFeatureToPlan = async (featureId) => {
    try {
      const newFeature = {
        featureId,
        limit: 100,
        isUnlimited: false
      };

      const updatedFeatures = [
        ...selectedPlan.features.map(f => ({
          featureId: f.featureId.id,
          limit: f.limit,
          isUnlimited: f.isUnlimited
        })),
        newFeature
      ];

      const token = localStorage.getItem('authToken');
      const response = await axios.put(\`/api/plans/\${selectedPlan.id}\`, {
        features: updatedFeatures
      }, {
        headers: { Authorization: \`Bearer \${token}\` }
      });

      setSelectedPlan(response.data.data);
      fetchPlans();
      alert('Feature added to plan!');
    } catch (error) {
      console.error('Failed to add feature:', error);
      alert('Failed to add feature');
    }
  };

  const removeFeatureFromPlan = async (featureId) => {
    try {
      const updatedFeatures = selectedPlan.features
        .filter(f => f.featureId.id !== featureId)
        .map(f => ({
          featureId: f.featureId.id,
          limit: f.limit,
          isUnlimited: f.isUnlimited
        }));

      const token = localStorage.getItem('authToken');
      const response = await axios.put(\`/api/plans/\${selectedPlan.id}\`, {
        features: updatedFeatures
      }, {
        headers: { Authorization: \`Bearer \${token}\` }
      });

      setSelectedPlan(response.data.data);
      fetchPlans();
      alert('Feature removed from plan!');
    } catch (error) {
      console.error('Failed to remove feature:', error);
      alert('Failed to remove feature');
    }
  };

  const updatePlanPricing = async (newPrice, billingCycle) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(\`/api/plans/\${selectedPlan.id}\`, {
        price: newPrice,
        billingCycle
      }, {
        headers: { Authorization: \`Bearer \${token}\` }
      });

      setSelectedPlan(response.data.data);
      fetchPlans();
      alert('Pricing updated successfully!');
    } catch (error) {
      console.error('Failed to update pricing:', error);
      alert('Failed to update pricing');
    }
  };

  return (
    <div className="plan-management">
      <h1>Plan Management</h1>
      
      {/* Plan Cards Grid */}
      <div className="plan-grid">
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <p className="price">\${plan.price}/{plan.billingCycle}</p>
            <p className="features-count">
              {plan.features.length} Features
            </p>
            <button 
              onClick={() => fetchPlanDetails(plan.id)}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'View Details'}
            </button>
          </div>
        ))}
      </div>

      {/* Plan Details Modal */}
      {showModal && selectedPlan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedPlan.name}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {/* Pricing Section */}
              <div className="pricing-section">
                <h3>Pricing</h3>
                <div className="pricing-controls">
                  <input 
                    type="number" 
                    value={selectedPlan.price}
                    onChange={(e) => updatePlanPricing(
                      parseFloat(e.target.value), 
                      selectedPlan.billingCycle
                    )}
                  />
                  <select 
                    value={selectedPlan.billingCycle}
                    onChange={(e) => updatePlanPricing(
                      selectedPlan.price, 
                      e.target.value
                    )}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>

              {/* Features Section */}
              <div className="features-section">
                <h3>Features & Limits</h3>
                {selectedPlan.features.map(feature => (
                  <div key={feature.featureId.id} className="feature-item">
                    <div className="feature-info">
                      <h4>{feature.featureId.name}</h4>
                      <p>{feature.featureId.description}</p>
                    </div>
                    
                    <div className="feature-controls">
                      <label>
                        <input 
                          type="checkbox"
                          checked={feature.isUnlimited}
                          onChange={(e) => updatePlanFeature(
                            feature.featureId.id,
                            feature.limit,
                            e.target.checked
                          )}
                        />
                        Unlimited
                      </label>
                      
                      {!feature.isUnlimited && (
                        <input 
                          type="number"
                          value={feature.limit}
                          onChange={(e) => updatePlanFeature(
                            feature.featureId.id,
                            parseInt(e.target.value),
                            feature.isUnlimited
                          )}
                          min="0"
                        />
                      )}
                      
                      <button 
                        onClick={() => removeFeatureFromPlan(feature.featureId.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Feature Section */}
              <div className="add-feature-section">
                <h3>Add Feature</h3>
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      addFeatureToPlan(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Select feature to add...</option>
                  {features
                    .filter(f => !selectedPlan.features.some(pf => pf.featureId.id === f.id))
                    .map(feature => (
                      <option key={feature.id} value={feature.id}>
                        {feature.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
`;

// ============================================
// 🎨 CSS STYLES FOR PLAN MANAGEMENT
// ============================================

export const PlanManagementCSS = `
.plan-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.plan-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.plan-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
}

.features-count {
  color: #666;
  margin: 10px 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.pricing-section, .features-section, .add-feature-section {
  margin-bottom: 30px;
}

.pricing-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pricing-controls input, .pricing-controls select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
}

.feature-info h4 {
  margin: 0 0 5px 0;
}

.feature-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.feature-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.feature-controls input[type="number"] {
  width: 80px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
`;

// ============================================
// 📱 MOBILE RESPONSIVE VERSION
// ============================================

export const MobilePlanComponent = `
// Mobile-optimized version with touch-friendly controls
const MobilePlanManagement = () => {
  // Same logic as above but with mobile-specific UI

  return (
    <div className="mobile-plan-management">
      {/* Stack cards vertically on mobile */}
      <div className="mobile-plan-list">
        {plans.map(plan => (
          <div key={plan.id} className="mobile-plan-card">
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <span className="price">\${plan.price}</span>
            </div>
            <div className="plan-details">
              <p>{plan.features.length} features</p>
              <button 
                onClick={() => fetchPlanDetails(plan.id)}
                className="mobile-btn"
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen modal on mobile */}
      {showModal && (
        <div className="mobile-modal">
          <div className="mobile-modal-header">
            <h2>{selectedPlan?.name}</h2>
            <button onClick={() => setShowModal(false)}>×</button>
          </div>
          
          <div className="mobile-modal-content">
            {/* Touch-friendly controls */}
            {/* Same functionality, mobile-optimized UI */}
          </div>
        </div>
      )}
    </div>
  );
};
`;

// ============================================
// 🔄 DATA FLOW SUMMARY
// ============================================

export const DataFlowSummary = {
  pageLoad: [
    "1. GET /api/plans → Display plan cards",
    "2. GET /api/features → Store for adding to plans"
  ],
  
  viewPlanDetails: [
    "1. Click plan card",
    "2. GET /api/plans/:id → Get detailed plan with populated features",
    "3. Show modal with features and limits"
  ],
  
  updateFeatureLimit: [
    "1. Change limit input or toggle unlimited",
    "2. PUT /api/plans/:id with updated features array",
    "3. Update UI with response data"
  ],
  
  addFeature: [
    "1. Select feature from dropdown",
    "2. PUT /api/plans/:id with new feature added to array",
    "3. Refresh plan details"
  ],
  
  removeFeature: [
    "1. Click remove button",
    "2. PUT /api/plans/:id with feature removed from array", 
    "3. Update UI"
  ],
  
  updatePricing: [
    "1. Change price or billing cycle",
    "2. PUT /api/plans/:id with new pricing",
    "3. Update display"
  ]
};

export default {
  PlanPageGuide,
  PlanAPIs,
  ReactPlanComponent,
  PlanManagementCSS,
  MobilePlanComponent,
  DataFlowSummary
};