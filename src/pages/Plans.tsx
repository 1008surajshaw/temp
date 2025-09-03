import { Card, Typography, Button, Table, Space, Modal, Form, Input, InputNumber, Select, message, Skeleton, Tag, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlans, useCreatePlan, useUpdatePlan } from '../hooks/usePlans';
import { useFeatures } from '../hooks/useFeatures';
import { CreatePlanDto, UpdatePlanDto, PlanResponseDto } from '../types/frontend-types';

const { Title } = Typography;
const { Option } = Select;

export default function Plans() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanResponseDto | null>(null);
  const [form] = Form.useForm();

  const { data: plansData, isLoading } = usePlans(user?.organization_id || '');
  const { data: featuresData } = useFeatures(user?.organization_id || '');
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  const plans = plansData?.data || [];
  const features = featuresData?.data || [];

  const handleCreate = () => {
    setEditingPlan(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (plan: PlanResponseDto) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billing_cycle: plan.billing_cycle,
      features: plan.features.map(f => ({
        feature_id: f.feature_id,
        feature_limit: f.feature_limit,
        is_unlimited: f.is_unlimited,
      })),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingPlan) {
        await updatePlanMutation.mutateAsync({
          id: editingPlan.id,
          data: values as UpdatePlanDto,
        });
        message.success('Plan updated successfully!');
      } else {
        await createPlanMutation.mutateAsync({
          ...values,
          organization_id: user?.organization_id,
        } as CreatePlanDto);
        message.success('Plan created successfully!');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Operation failed!');
    }
  };

  const columns = [
    {
      title: 'Plan Details',
      key: 'details',
      render: (_, record: PlanResponseDto) => (
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          <div className="text-sm text-gray-500">{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, record: PlanResponseDto) => (
        <div className="flex items-center gap-1">
          <DollarOutlined className="text-green-600" />
          <span className="font-medium text-green-600">${record.price}</span>
          <span className="text-sm text-gray-500">/{record.billing_cycle}</span>
        </div>
      ),
    },
    {
      title: 'Features',
      dataIndex: 'features',
      key: 'features',
      render: (features: any[]) => (
        <div className="space-y-1">
          {features.slice(0, 2).map((feature, index) => (
            <Tag key={index} size="small" className="text-xs">
              {feature.feature_name}: {feature.is_unlimited ? '∞' : feature.feature_limit}
            </Tag>
          ))}
          {features.length > 2 && (
            <Tag size="small" className="text-xs">+{features.length - 2} more</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: PlanResponseDto) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          />
        </Space>
      ),
    },
  ];



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <CreditCardOutlined className="text-blue-600" />
          Plans Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Plan
        </Button>
      </div>

      <Card className="border-gray-200">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={plans}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            className="border-0"
          />
        )}
      </Card>

      <Modal
        title={editingPlan ? 'Edit Plan' : 'Create Plan'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Plan Name"
            rules={[{ required: true, message: 'Please enter plan name!' }]}
          >
            <Input placeholder="Enter plan name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Enter plan description" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter price!' }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full"
                prefix="$"
              />
            </Form.Item>

            <Form.Item
              name="billing_cycle"
              label="Billing Cycle"
              rules={[{ required: true, message: 'Please select billing cycle!' }]}
            >
              <Select placeholder="Select billing cycle">
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.List name="features">
            {(fields, { add, remove }) => (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="font-medium">Features</label>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Feature
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="grid grid-cols-12 gap-2 mb-4 p-4 border border-gray-200 rounded">
                    <Form.Item
                      {...restField}
                      name={[name, 'feature_id']}
                      className="col-span-5"
                      rules={[{ required: true, message: 'Select feature!' }]}
                    >
                      <Select placeholder="Select feature">
                        {features.map(feature => (
                          <Option key={feature.id} value={feature.id}>
                            {feature.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'feature_limit']}
                      className="col-span-3"
                    >
                      <InputNumber
                        min={1}
                        placeholder="Limit"
                        className="w-full"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'is_unlimited']}
                      valuePropName="checked"
                      className="col-span-3"
                    >
                      <Checkbox>Unlimited</Checkbox>
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      onClick={() => remove(name)}
                      className="col-span-1"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Form.List>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createPlanMutation.isPending || updatePlanMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingPlan ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}