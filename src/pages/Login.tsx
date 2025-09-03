import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { LoginDto } from '../types/frontend-types';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const onFinish = async (values: LoginDto) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      if (response.success) {
        message.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      description="Sign in to your account"
    >
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
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
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </Form.Item>

        <div className="text-center">
          <Button type="link" onClick={() => navigate('/signup')}>
            Don't have an account? Sign up
          </Button>
        </div>
      </Form>
    </AuthLayout>
  );
}