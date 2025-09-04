import { useState } from 'react';
import { organizationService } from '../services/organization';
import { useAuth } from '../hooks/useAuth';
import { CreateOrganizationRequest } from '../types/api';

interface CreateOrganizationModalProps {
  onSuccess: () => void;
}

export default function CreateOrganizationModal({ onSuccess }: CreateOrganizationModalProps) {
  const { owner } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: '',
    description: '',
    ownerId: owner?.id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner) return;

    setLoading(true);
    try {
      await organizationService.create({
        ...formData,
        ownerId: owner.id
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Your Organization</h2>
          <p className="text-gray-600 mt-2">You need to create an organization to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter organization name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your organization"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Organization'}
          </button>
        </form>
      </div>
    </div>
  );
}