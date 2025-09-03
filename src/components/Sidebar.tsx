import { Layout, Menu, Button, Typography } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined, 
  AppstoreOutlined,
  CreditCardOutlined,
  BarChartOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Sider } = Layout;
const { Text } = Typography;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '/features',
      icon: <AppstoreOutlined />,
      label: 'Features',
    },
    {
      key: '/plans',
      icon: <CreditCardOutlined />,
      label: 'Plans',
    },
    {
      key: '/subscriptions',
      icon: <BarChartOutlined />,
      label: 'Subscriptions',
    },
  ];

  return (
    <Sider width={250} theme="light" className="border-r">
      <div className="p-4 border-b bg-blue-50">
        <Text strong className="text-blue-900">Feature Management</Text>
        <div className="mt-2">
          <Text type="secondary" className="text-sm text-blue-700">
            {user?.name}
          </Text>
          <div className="text-xs text-blue-600 mt-1">
            👑 Admin Panel
          </div>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="border-0"
      />

      <div className="absolute bottom-4 left-4 right-4">
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={logout}
          className="w-full text-left"
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
}