import { useState, useEffect } from 'react';
import { organizationService } from '../services/organization';
import { useOrganization } from '../hooks/useOrganization';
import { useAuth } from '../hooks/useAuth';
import { Organization, CreateOrganizationRequest } from '../types/api';
import Modal from '../components/Modal';

export default function OrganizationsPage() {
  const { owner } = useAuth();
  const { organizations, refreshOrganizations, setCurrentOrg } = useOrganization();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newOrganization, setNewOrganization] = useState<CreateOrganizationRequest>({
    name: '',
    description: '',
    ownerId: owner?.id || ''
  });

  useEffect(() => {
    if (owner?.organizationCreated) {
      setLoading(false);
    }
  }, [owner]);

  useEffect(() => {
    if (owner?.id) {
      setNewOrganization(prev => ({ ...prev, ownerId: owner.id }));
    }
  }, [owner]);



  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner?.id) return;
    
    try {
      const newOrg = await organizationService.create(newOrganization);
      setNewOrganization({ name: '', description: '', ownerId: owner.id });
      setShowCreateModal(false);
      await refreshOrganizations();
      // Set the newly created organization as current
      setCurrentOrg(newOrg);
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      try {
        await organizationService.delete(id);
        await refreshOrganizations();
      } catch (error) {
        console.error('Failed to delete organization:', error);
      }
    }
  };

  const handleSelectOrganization = (org: Organization) => {
    setCurrentOrg(org);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Organization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">{org.name}</h3>
            <p className="text-gray-600 mb-4">{org.description}</p>
            <div className="flex justify-between items-center mb-3">
              <span className={`px-2 py-1 rounded text-sm ${
                org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {org.isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => handleDeleteOrganization(org.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
            <button
              onClick={() => handleSelectOrganization(org)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
            >
              Select Organization
            </button>
          </div>
        ))}
      </div>

      {/* Create Organization Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Organization"
      >
        <form onSubmit={handleCreateOrganization} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newOrganization.name}
              onChange={(e) => setNewOrganization({...newOrganization, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={newOrganization.description}
              onChange={(e) => setNewOrganization({...newOrganization, description: e.target.value})}
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