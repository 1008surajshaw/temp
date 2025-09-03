import { Card, Typography, Button, Skeleton, Tag, message, Modal } from 'antd';
import { CreditCardOutlined, DollarOutlined, CheckOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlans } from '../hooks/usePlans';
import { useCreateSubscription } from '../hooks/useSubscriptions';
import { PlanResponseDto } from '../types/frontend-types';

const { Title, Text } = Typography;

export default function AvailablePlans() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: plansData, isLoading } = usePlans(user?.organization_id || '');
  const createSubscriptionMutation = useCreateSubscription();

  const plans = plansData?.data || [];
  const activePlans = plans.filter(p => p.is_active);

  const handlePurchase = (plan: PlanResponseDto) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPlan || !user) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (selectedPlan.billing_cycle === 'yearly' ? 12 : 1));

    try {
      await createSubscriptionMutation.mutateAsync({
        user_id: user.id,
        plan_id: selectedPlan.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
      });
      
      message.success(`Successfully subscribed to ${selectedPlan.name}!`);
      setIsModalOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      message.error('Failed to create subscription');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <CreditCardOutlined className="text-blue-600" />
          Available Plans
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title level={2} className="text-gray-900 flex items-center gap-2">
        <CreditCardOutlined className="text-blue-600" />
        Available Plans
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePlans.map((plan) => (
          <Card
            key={plan.id}
            className="border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
            bodyStyle={{ padding: '24px' }}
          >
            <div className="space-y-4">
              {/* Plan Header */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
                <div className="flex items-center justify-center gap-1">
                  <DollarOutlined className="text-green-600" />
                  <span className="text-3xl font-bold text-green-600">${plan.price}</span>
                  <span className="text-gray-500">/{plan.billing_cycle}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 border-b pb-2">
                  Included Features:
                </div>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckOutlined className="text-green-500 text-xs" />
                      <span className="text-gray-700">{feature.feature_name}</span>
                    </div>
                    <Tag size="small" color="blue">
                      {feature.is_unlimited ? 'Unlimited' : `${feature.feature_limit} uses`}
                    </Tag>
                  </div>
                ))}
              </div>

              {/* Purchase Button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={() => handlePurchase(plan)}
                className="bg-blue-600 hover:bg-blue-700 mt-6"
                loading={createSubscriptionMutation.isPending && selectedPlan?.id === plan.id}
              >
                Subscribe Now
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {activePlans.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Text type="secondary">No active plans available at the moment.</Text>
          </div>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Subscription"
        open={isModalOpen}
        onOk={confirmPurchase}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createSubscriptionMutation.isPending}
        okText="Confirm Purchase"
        cancelText="Cancel"
      >
        {selectedPlan && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">{selectedPlan.name}</h4>
              <p className="text-blue-700 text-sm mt-1">{selectedPlan.description}</p>
              <div className="flex items-center gap-1 mt-2">
                <DollarOutlined className="text-green-600" />
                <span className="text-lg font-bold text-green-600">${selectedPlan.price}</span>
                <span className="text-gray-500">/{selectedPlan.billing_cycle}</span>
              </div>
            </div>
            
            <div>
              <Text strong>Features included:</Text>
              <ul className="mt-2 space-y-1">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckOutlined className="text-green-500 text-xs" />
                    {feature.feature_name}: {feature.is_unlimited ? 'Unlimited' : `${feature.feature_limit} uses`}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <Text className="text-yellow-800 text-sm">
                💡 Note: This is a demo version. No actual payment will be processed.
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}