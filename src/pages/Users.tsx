import { Card, Typography } from 'antd';

const { Title } = Typography;

export default function Users() {
  return (
    <div>
      <Title level={2}>Users Management</Title>
      <Card className="mt-6">
        <p>Users management functionality will be implemented here.</p>
      </Card>
    </div>
  );
}