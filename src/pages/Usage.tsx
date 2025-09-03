import { Card, Typography, Skeleton, Empty, Progress, Statistic } from 'antd';
import { BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

const { Title, Text } = Typography;

export default function Usage() {
  const { user } = useAuth();

  const { data: usageData, isLoading } = useQuery({
    queryKey: ['user-usage', user?.id],
    queryFn: () => apiService.getUserUsage(user?.id || ''),
    enabled: !!user?.id,
  });

  const usage = usageData?.data || [];

  // Group usage by feature
  const usageByFeature = usage.reduce((acc: any, item) => {
    const key = item.feature_id;
    if (!acc[key]) {
      acc[key] = {
        feature_name: item.feature_name,
        feature_key: item.feature_key,
        total_usage: 0,
        records: []
      };
    }
    acc[key].total_usage += item.usage_count;
    acc[key].records.push(item);
    return acc;
  }, {});

  const featureUsageArray = Object.values(usageByFeature);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <BarChartOutlined className="text-blue-600" />
          Usage Analytics
        </Title>
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  if (usage.length === 0) {
    return (
      <div className="space-y-6">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <BarChartOutlined className="text-blue-600" />
          Usage Analytics
        </Title>
        <Card>
          <Empty
            description="No usage data available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  const totalUsage = usage.reduce((sum, item) => sum + item.usage_count, 0);
  const mostUsedFeature = featureUsageArray.reduce((max: any, current: any) => 
    current.total_usage > (max?.total_usage || 0) ? current : max, null
  );

  return (
    <div className="space-y-6">
      <Title level={2} className="text-gray-900 flex items-center gap-2">
        <BarChartOutlined className="text-blue-600" />
        Usage Analytics
      </Title>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 hover:border-blue-300 transition-colors">
          <Statistic
            title="Total Usage"
            value={totalUsage}
            prefix={<BarChartOutlined className="text-blue-500" />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
        
        <Card className="border-green-200 hover:border-green-300 transition-colors">
          <Statistic
            title="Features Used"
            value={featureUsageArray.length}
            prefix={<TrophyOutlined className="text-green-500" />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
        
        <Card className="border-purple-200 hover:border-purple-300 transition-colors">
          <div>
            <Text type="secondary" className="text-sm">Most Used Feature</Text>
            <div className="text-xl font-semibold text-purple-600 mt-1">
              {mostUsedFeature?.feature_name || 'N/A'}
            </div>
            <Text type="secondary" className="text-sm">
              {mostUsedFeature?.total_usage || 0} times
            </Text>
          </div>
        </Card>
      </div>

      {/* Feature Usage Breakdown */}
      <Card title="Feature Usage Breakdown" className="border-gray-200">
        <div className="space-y-6">
          {featureUsageArray.map((feature: any, index) => {
            const percentage = totalUsage > 0 ? (feature.total_usage / totalUsage) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Text strong className="text-gray-900">{feature.feature_name}</Text>
                    <div className="text-sm text-gray-500">{feature.feature_key}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{feature.total_usage}</div>
                    <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress 
                  percent={percentage} 
                  strokeColor="#1890ff"
                  showInfo={false}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Usage */}
      <Card title="Recent Usage" className="border-gray-200">
        <div className="space-y-3">
          {usage.slice(0, 10).map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <Text strong className="text-gray-900">{item.feature_name}</Text>
                <div className="text-sm text-gray-500">
                  {new Date(item.usage_date).toLocaleDateString()} - Used {item.usage_count} times
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                  {item.feature_key}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}