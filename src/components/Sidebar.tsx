import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const menuItems = [
  { name: 'Users', path: '/dashboard/users', icon: '👥' },
  { name: 'Features', path: '/dashboard/features', icon: '⚡' },
  { name: 'Plans', path: '/dashboard/plans', icon: '📋' },
  { name: 'Subscriptions', path: '/dashboard/subscriptions', icon: '💳' },
  { name: 'Analytics', path: '/dashboard/analytics', icon: '📊' },
  { name: 'Organizations', path: '/dashboard/organizations', icon: '🏢' },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Owner Dashboard</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}