import { useState, useEffect } from 'react';
import { featureService } from '../services/feature';
import { featureUserService } from '../services/featureUser';
import { useOrganization } from '../hooks/useOrganization';
import { FeatureUser } from '../types/api';

export default function UsersPage() {
  const { currentOrg } = useOrganization();
  const [users, setUsers] = useState<FeatureUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentOrg) {
      loadUsers();
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
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">Usage: {user.usageCount}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
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