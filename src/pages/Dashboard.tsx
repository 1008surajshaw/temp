import { Card, Typography, Row, Col, Statistic, Skeleton, Tag } from 'antd';
import { UserOutlined, AppstoreOutlined, CreditCardOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useFeatures } from '../hooks/useFeatures';
import { usePlans } from '../hooks/usePlans';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

const { Title, Text } = Typography;

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: featuresData, isLoading: featuresLoading } = useFeatures(user?.organization_id || '');
  const { data: plansData, isLoading: plansLoading } = usePlans(user?.organization_id || '');
  
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(1, 100),
  });

  const features = featuresData?.data || [];
  const plans = plansData?.data || [];
  const users = usersData?.data || [];

  const activeFeatures = features.filter(f => f.is_active).length;
  const activePlans = plans.filter(p => p.is_active).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <Title level={2} className="text-blue-900 mb-2">Welcome back, {user?.name}! 👋</Title>
        <div className="flex items-center gap-4">
          <Tag color={user?.is_active ? 'green' : 'red'} icon={user?.is_active ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
            {user?.is_active ? 'Active' : 'Inactive'}
          </Tag>
          <Text type="secondary">{user?.email}</Text>
        </div>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="border-blue-200 hover:border-blue-300 transition-colors">
            {usersLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Statistic
                title="Total Users"
                value={users.length}
                prefix={<UserOutlined className="text-blue-500" />}
                valueStyle={{ color: '#1890ff' }}
              />
            )}
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card className="border-green-200 hover:border-green-300 transition-colors">
            {featuresLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Statistic
                title="Active Features"
                value={activeFeatures}
                suffix={`/ ${features.length}`}
                prefix={<AppstoreOutlined className="text-green-500" />}
                valueStyle={{ color: '#52c41a' }}
              />
            )}
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card className="border-purple-200 hover:border-purple-300 transition-colors">
            {plansLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Statistic
                title="Active Plans"
                value={activePlans}
                suffix={`/ ${plans.length}`}
                prefix={<CreditCardOutlined className="text-purple-500" />}
                valueStyle={{ color: '#722ed1' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="Admin Overview" 
            className="border-gray-200"
          >
            <div className="space-y-4">
              <Text>Manage your organization's features, plans, and users from the sidebar.</Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Text strong className="text-blue-900">Features</Text>
                  <div className="text-sm text-blue-700 mt-1">Create and manage features</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <Text strong className="text-green-900">Plans</Text>
                  <div className="text-sm text-green-700 mt-1">Create subscription plans</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <Text strong className="text-purple-900">Users</Text>
                  <div className="text-sm text-purple-700 mt-1">Manage user accounts</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}