import { Card, Typography, Row, Col, Statistic } from 'antd';
import { UserOutlined, AppstoreOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Title } = Typography;

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <Title level={2}>Welcome back, {user?.name}!</Title>
      
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={25}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Active Features"
              value={12}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Active Plans"
              value={5}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="Recent Activity">
            <p>Dashboard content will be implemented based on user type and requirements.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}