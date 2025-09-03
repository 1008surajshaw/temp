import { Card, Typography } from 'antd';

const { Title } = Typography;

export default function Plans() {
  return (
    <div>
      <Title level={2}>Plans Management</Title>
      <Card className="mt-6">
        <p>Plans management functionality will be implemented here.</p>
      </Card>
    </div>
  );
}