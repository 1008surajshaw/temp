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

  const adminMenuItems = [
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
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const userMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/my-plans',
      icon: <CreditCardOutlined />,
      label: 'My Plans',
    },
    {
      key: '/usage',
      icon: <BarChartOutlined />,
      label: 'Usage',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const menuItems = user?.user_type === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <Sider width={250} theme="light" className="border-r">
      <div className="p-4 border-b">
        <Text strong>Feature Management</Text>
        <div className="mt-2">
          <Text type="secondary" className="text-sm">
            {user?.name} ({user?.user_type})
          </Text>
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