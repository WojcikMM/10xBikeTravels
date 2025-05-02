'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSupabase } from '@/lib/supabase/provider';

const { Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      // If successful, redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demodemo',
      });

      if (error) throw error;

      // If successful, redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Demo login error:', error);
      setError(error.message || 'Failed to sign in with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <Alert 
          message={error} 
          type="error" 
          showIcon 
          style={{ marginBottom: '1rem' }} 
        />
      )}

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Email" 
            size="large" 
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Password" 
            size="large" 
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            block
          >
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Text type="secondary">Don't have an account?</Text>
        <Button 
          type="link" 
          onClick={handleDemoLogin}
          loading={loading}
        >
          Use Demo Account
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;