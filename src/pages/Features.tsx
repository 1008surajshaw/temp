import { Card, Typography, Button, Table, Space, Modal, Form, Input, message, Skeleton, Tag } from 'antd';
import { PlusOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFeatures, useCreateFeature, useUpdateFeature, useToggleFeature } from '../hooks/useFeatures';
import { CreateFeatureDto, UpdateFeatureDto, FeatureResponseDto } from '../types/frontend-types';

const { Title } = Typography;

export default function Features() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureResponseDto | null>(null);
  const [form] = Form.useForm();

  const { data: featuresData, isLoading } = useFeatures(user?.organization_id || '');
  const createFeatureMutation = useCreateFeature();
  const updateFeatureMutation = useUpdateFeature();
  const toggleFeatureMutation = useToggleFeature();

  const features = featuresData?.data || [];

  const handleCreate = () => {
    setEditingFeature(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (feature: FeatureResponseDto) => {
    setEditingFeature(feature);
    form.setFieldsValue({
      name: feature.name,
      feature_key: feature.feature_key,
      description: feature.description,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingFeature) {
        await updateFeatureMutation.mutateAsync({
          id: editingFeature.id,
          data: values as UpdateFeatureDto,
        });
        message.success('Feature updated successfully!');
      } else {
        await createFeatureMutation.mutateAsync({
          ...values,
          organization_id: user?.organization_id,
        } as CreateFeatureDto);
        message.success('Feature created successfully!');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Operation failed!');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleFeatureMutation.mutateAsync(id);
      message.success('Feature status updated!');
    } catch (error) {
      message.error('Failed to update feature status!');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: FeatureResponseDto) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-sm text-gray-500">{record.feature_key}</div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <div className="text-gray-600 max-w-xs truncate">{text || 'No description'}</div>
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
      render: (_, record: FeatureResponseDto) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button
            type="text"
            onClick={() => handleToggle(record.id)}
            loading={toggleFeatureMutation.isPending}
            className={record.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
          >
            {record.is_active ? 'Disable' : 'Enable'}
          </Button>
        </Space>
      ),
    },
  ];



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <AppstoreOutlined className="text-blue-600" />
          Features Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Feature
        </Button>
      </div>

      <Card className="border-gray-200">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={features}
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
        title={editingFeature ? 'Edit Feature' : 'Create Feature'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Feature Name"
            rules={[{ required: true, message: 'Please enter feature name!' }]}
          >
            <Input placeholder="Enter feature name" />
          </Form.Item>

          <Form.Item
            name="feature_key"
            label="Feature Key"
            rules={[{ required: true, message: 'Please enter feature key!' }]}
          >
            <Input placeholder="Enter unique feature key" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter feature description"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createFeatureMutation.isPending || updateFeatureMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingFeature ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}