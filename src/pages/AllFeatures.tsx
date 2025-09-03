import { Card, Typography, Skeleton, Tag, Empty, Button, message } from 'antd';
import { AppstoreOutlined, CheckCircleOutlined, StopOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useFeatures } from '../hooks/useFeatures';
import { useCreateUsage } from '../hooks/useUsage';

const { Title, Text } = Typography;

export default function AllFeatures() {
  const { user } = useAuth();
  const { data: featuresData, isLoading } = useFeatures(user?.organization_id || '');
  const createUsageMutation = useCreateUsage();

  const features = featuresData?.data || [];

  const handleUseFeature = async (featureId: string, featureName: string) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <AppstoreOutlined className="text-blue-600" />
          All Features
        </Title>
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="space-y-6">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <AppstoreOutlined className="text-blue-600" />
          All Features
        </Title>
        <Card>
          <Empty
            description="No features available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title level={2} className="text-gray-900 flex items-center gap-2">
        <AppstoreOutlined className="text-blue-600" />
        All Features
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className={`transition-colors ${
              feature.is_active 
                ? 'border-green-200 hover:border-green-300 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
            }`}
            bodyStyle={{ padding: '20px' }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{feature.name}</h3>
                <Tag 
                  color={feature.is_active ? 'green' : 'red'} 
                  icon={feature.is_active ? <CheckCircleOutlined /> : <StopOutlined />}
                >
                  {feature.is_active ? 'Available' : 'Unavailable'}
                </Tag>
              </div>
              
              <p className="text-sm text-gray-600">
                {feature.description || 'No description available'}
              </p>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                  <strong>Key:</strong> {feature.feature_key}
                </div>
                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                  <strong>Created:</strong> {new Date(feature.createdAt).toLocaleDateString()}
                </div>
              </div>

              {feature.is_active ? (
                <div className="space-y-3">
                  <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                    <Text className="text-green-800 text-sm">
                      ✅ This feature is available in your current plan
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleUseFeature(feature.id, feature.name)}
                    loading={createUsageMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 border-green-600"
                  >
                    Use Feature
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                  <Text className="text-gray-600 text-sm">
                    ❌ Not available in your current plan
                  </Text>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <div className="text-center space-y-2">
          <Text className="text-blue-900">
            💡 <strong>Tip:</strong> Features marked as "Available" can be used with your current subscription.
          </Text>
          <br />
          <Text type="secondary" className="text-blue-700">
            Contact your administrator if you need access to unavailable features.
          </Text>
        </div>
      </Card>
    </div>
  );
}