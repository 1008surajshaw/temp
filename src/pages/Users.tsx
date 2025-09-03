import { Card, Typography, Table, Tag, Button, Space, Skeleton, Modal, Form, Input, Select, message } from 'antd';
import { UserOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { UserResponseDto } from '../types/frontend-types';

const { Title } = Typography;
const { Option } = Select;

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(1, 100),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User updated successfully!');
      setIsModalOpen(false);
    },
    onError: () => {
      message.error('Failed to update user');
    },
  });

  const users = usersData?.data || [];

  const handleEdit = (user: UserResponseDto) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      is_active: user.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (!editingUser) return;
    
    updateUserMutation.mutate({
      id: editingUser.id,
      data: values,
    });
  };

  const columns = [
    {
      title: 'User Details',
      key: 'details',
      render: (_, record: UserResponseDto) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'User Type',
      dataIndex: 'user_type',
      key: 'user_type',
      render: (userType: string) => (
        <Tag color={userType === 'admin' ? 'gold' : 'blue'}>
          {userType === 'admin' ? '👑 Admin' : '👤 User'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: UserResponseDto) => (
        <div className="space-y-1">
          <Tag color={record.is_active ? 'green' : 'red'} icon={record.is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
            {record.is_active ? 'Active' : 'Inactive'}
          </Tag>
          <Tag color={record.is_verified ? 'green' : 'orange'} size="small">
            {record.is_verified ? 'Verified' : 'Unverified'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: UserResponseDto) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={2} className="text-gray-900 flex items-center gap-2">
          <UserOutlined className="text-blue-600" />
          Users Management
        </Title>
        <div className="text-sm text-gray-500">
          Total Users: {users.length}
        </div>
      </div>

      <Card className="border-gray-200">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            className="border-0"
          />
        )}
      </Card>

      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter name!' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email!' },
              { type: 'email', message: 'Please enter valid email!' }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateUserMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}