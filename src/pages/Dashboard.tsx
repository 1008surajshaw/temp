import { Card, Typography, Row, Col, Statistic, Skeleton, Tag, Button, message } from 'antd';
import { UserOutlined, AppstoreOutlined, CreditCardOutlined, CheckCircleOutlined, ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useFeatures } from '../hooks/useFeatures';
import { usePlans } from '../hooks/usePlans';
import { useCreateUsage } from '../hooks/useUsage';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

const { Title, Text } = Typography;

export default function Dashboard() {
  const { user } = useAuth();
  const createUsageMutation = useCreateUsage();
  
  const { data: featuresData, isLoading: featuresLoading } = useFeatures(user?.organization_id || '');
  const { data: plansData, isLoading: plansLoading } = usePlans(user?.organization_id || '');
  
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(1, 100),
    enabled: user?.user_type === 'admin',
  });

  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['user-subscriptions', user?.id],
    queryFn: () => apiService.getActiveSubscriptions(user?.id || ''),
    enabled: user?.user_type === 'user' && !!user?.id,
  });

  const features = featuresData?.data || [];
  const plans = plansData?.data || [];
  const users = usersData?.data || [];
  const subscriptions = subscriptionsData?.data || [];

  const activeFeatures = features.filter(f => f.is_active).length;
  const activePlans = plans.filter(p => p.is_active).length;

  const handleQuickUse = async (featureId: string, featureName: string) => {
    if (!user) return;
    
    try {
      await createUsageMutation.mutateAsync({
        user_id: user.id,
        feature_id: featureId,
        usage_count: 1,
        usage_date: new Date().toISOString(),
      });
      message.success(`Used ${featureName} successfully!`);
    } catch (error) {
      message.error('Failed to record usage');
    }
  };

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
        {user?.user_type === 'admin' ? (
          <>
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
          </>
        ) : (
          <>
            <Col xs={24} sm={12} lg={8}>
              <Card className="border-blue-200 hover:border-blue-300 transition-colors">
                {subscriptionsLoading ? (
                  <Skeleton active paragraph={{ rows: 2 }} />
                ) : (
                  <Statistic
                    title="Active Plans"
                    value={subscriptions.length}
                    prefix={<CreditCardOutlined className="text-blue-500" />}
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
                    title="Available Features"
                    value={activeFeatures}
                    prefix={<AppstoreOutlined className="text-green-500" />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                )}
              </Card>
            </Col>
          </>
        )}
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={user?.user_type === 'admin' ? 'Admin Overview' : 'Your Account'} 
            className="border-gray-200"
            extra={
              <Button type="primary" size="small">
                {user?.user_type === 'admin' ? 'Manage' : 'View Details'}
              </Button>
            }
          >
            {user?.user_type === 'admin' ? (
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
            ) : (
              <div className="space-y-4">
                <Text>View your active plans, feature usage, and account details.</Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Text strong className="text-blue-900">Active Plan</Text>
                    <div className="text-sm text-blue-700 mt-1">View your current subscription</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <Text strong className="text-green-900">Usage</Text>
                    <div className="text-sm text-green-700 mt-1">Track feature usage</div>
                  </div>
                </div>
                
                {/* Quick Feature Access */}
                {activeFeatures > 0 && (
                  <div className="mt-6">
                    <Text strong className="text-gray-900">Quick Feature Access:</Text>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {features.filter(f => f.is_active).slice(0, 4).map((feature) => (
                        <Button
                          key={feature.id}
                          type="default"
                          icon={<PlayCircleOutlined />}
                          onClick={() => handleQuickUse(feature.id, feature.name)}
                          loading={createUsageMutation.isPending}
                          className="text-left h-auto p-3 border-green-200 hover:border-green-400"
                        >
                          <div>
                            <div className="font-medium text-green-700">{feature.name}</div>
                            <div className="text-xs text-green-600">{feature.feature_key}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}