import { Card, Typography } from 'antd';
import { ReactNode } from 'react';

const { Title, Paragraph } = Typography;

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Title level={2}>{title}</Title>
          <Paragraph type="secondary">{description}</Paragraph>
        </div>
        {children}
      </Card>
    </div>
  );
}