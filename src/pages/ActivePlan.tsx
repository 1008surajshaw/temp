import { Card, Typography, Skeleton, Tag, Progress, Empty } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

const { Title, Text } = Typography;

export default function ActivePlan() {
  const { user } = useAuth();

  const { data: subscriptionsData, isLoading } = useQuery({
    queryKey: ['user-subscriptions', user?.id],
    queryFn: () => apiService.getActiveSubscriptions(user?.id || ''),
    enabled: !!user?.id,
  });

  const subscriptions = subscriptionsData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <CreditCardOutlined className="text-blue-600" />
          Active Plan
        </Title>
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="space-y-6">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <CreditCardOutlined className="text-blue-600" />
          Active Plan
        </Title>
        <Card>
          <Empty
            description="No active plans found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title level={2} className="text-gray-900 flex items-center gap-2">
        <CreditCardOutlined className="text-blue-600" />
        Active Plan
      </Title>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subscriptions.map((subscription) => {
          const startDate = new Date(subscription.start_date);
          const endDate = new Date(subscription.end_date);
          const now = new Date();
          const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const progress = Math.max(0, Math.min(100, ((totalDays - remainingDays) / totalDays) * 100));

          return (
            <Card
              key={subscription.id}
              className="border-blue-200 hover:border-blue-300 transition-colors"
              title={
                <div className="flex items-center justify-between">
                  <span className="text-blue-900">{subscription.plan_name}</span>
                  <Tag 
                    color={subscription.is_active ? 'green' : 'red'} 
                    icon={subscription.is_active ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                  >
                    {subscription.is_active ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text type="secondary" className="text-sm">Start Date</Text>
                    <div className="font-medium">{startDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Text type="secondary" className="text-sm">End Date</Text>
                    <div className="font-medium">{endDate.toLocaleDateString()}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Text type="secondary" className="text-sm">Subscription Progress</Text>
                    <Text className="text-sm font-medium">
                      {remainingDays > 0 ? `${remainingDays} days left` : 'Expired'}
                    </Text>
                  </div>
                  <Progress 
                    percent={progress} 
                    strokeColor={remainingDays > 7 ? '#52c41a' : remainingDays > 0 ? '#faad14' : '#ff4d4f'}
                    showInfo={false}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <Text className="text-blue-900 text-sm">
                    This plan gives you access to all included features. 
                    Check the "All Features" section to see what's available.
                  </Text>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}