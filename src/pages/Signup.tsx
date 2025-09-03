import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { RegisterDto } from '../types/frontend-types';
import AuthLayout from '../components/AuthLayout';

export default function Signup() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [showVerification, setShowVerification] = useState(false);

  const onFinish = async (values: RegisterDto & { confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    const { confirmPassword, ...registerData } = values;
    const dataWithUserType = { ...registerData, user_type: 'user' as const };
    
    try {
      const response = await registerMutation.mutateAsync(dataWithUserType);
      if (response.success) {
        setShowVerification(true);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  if (showVerification) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        description="We've sent you a verification link"
      >
        <div className="text-center space-y-4">
          <p>A verification link has been sent to your email address. Please check your inbox and click the link to verify your account.</p>
          <Button type="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create Account" 
      description="Sign up for a new account"
    >
      <Form
        name="signup"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="organization_id"
          label="Organization ID"
          rules={[{ required: true, message: 'Please input organization ID!' }]}
        >
          <Input placeholder="Enter organization ID" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>



        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[{ required: true, message: 'Please confirm your password!' }]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={registerMutation.isPending}
          >
            Sign Up
          </Button>
        </Form.Item>

        <div className="text-center">
          <Button type="link" onClick={() => navigate('/login')}>
            Already have an account? Sign in
          </Button>
        </div>
      </Form>
    </AuthLayout>
  );
}