import { useState, useEffect } from 'react';
import { featureService } from '../services/feature';
import { organizationService } from '../services/organization';
import { Feature, Organization, CreateFeatureRequest, FeatureUser, CreateFeatureUserRequest } from '../types/api';
import Modal from '../components/Modal';

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [featureUsers, setFeatureUsers] = useState<FeatureUser[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newFeature, setNewFeature] = useState<CreateFeatureRequest>({
    name: '',
    description: '',
    organizationId: ''
  });

  const [newUser, setNewUser] = useState<CreateFeatureUserRequest>({
    name: '',
    email: '',
    featureId: '',
    organizationId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featuresData, orgsData] = await Promise.all([
        featureService.getAll(),
        organizationService.getAll()
      ]);
      setFeatures(featuresData);
      setOrganizations(orgsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await featureService.create(newFeature);
      setNewFeature({ name: '', description: '', organizationId: '' });
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to create feature:', error);
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      try {
        await featureService.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete feature:', error);
      }
    }
  };

  const handleViewUsers = async (feature: Feature) => {
    setSelectedFeature(feature);
    try {
      const users = await featureService.getFeatureUsers(feature.id);
      setFeatureUsers(users);
      setShowUsersModal(true);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeature) return;
    
    try {
      await featureService.createFeatureUser({
        ...newUser,
        featureId: selectedFeature.id,
        organizationId: selectedFeature.organizationId
      });
      setNewUser({ name: '', email: '', featureId: '', organizationId: '' });
      setShowCreateUserModal(false);
      handleViewUsers(selectedFeature);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await featureService.deleteFeatureUser(userId);
        if (selectedFeature) {
          handleViewUsers(selectedFeature);
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Features Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Feature
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm ${
                feature.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {feature.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleViewUsers(feature)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Users
                </button>
                <button
                  onClick={() => handleDeleteFeature(feature.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Feature Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Feature"
      >
        <form onSubmit={handleCreateFeature} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newFeature.name}
              onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={newFeature.description}
              onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Organization</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newFeature.organizationId}
              onChange={(e) => setNewFeature({...newFeature, organizationId: e.target.value})}
            >
              <option value="">Select Organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
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

      {/* Feature Users Modal */}
      <Modal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        title={`Users for ${selectedFeature?.name}`}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Feature Users</h3>
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Add User
            </button>
          </div>
          
          {featureUsers.length === 0 ? (
            <p className="text-gray-500">No users found for this feature.</p>
          ) : (
            <div className="space-y-2">
              {featureUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Usage: {user.usageCount}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        title="Add User to Feature"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowCreateUserModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}