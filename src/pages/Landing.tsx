import { Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <Title level={2}>Feature Management System</Title>
        <Paragraph>
          Manage your organization's features and plans with ease
        </Paragraph>
        
        <div className="space-y-4 mt-8">
          <Button 
            type="primary" 
            size="large" 
            block
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          
          <Button 
            size="large" 
            block
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </div>
      </Card>
    </div>
  );
}