import { Card, Typography } from 'antd';

const { Title } = Typography;

export default function Features() {
  return (
    <div>
      <Title level={2}>Features Management</Title>
      <Card className="mt-6">
        <p>Features management functionality will be implemented here.</p>
      </Card>
    </div>
  );
}