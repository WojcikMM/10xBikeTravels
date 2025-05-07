'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
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

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      // Use window.location.href for a full page reload to ensure server sees the session
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login error:', error);
      notification.error({
        message: 'Login Failed',
        description: error.message || 'Failed to sign in',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demodemo',
      });

      if (error) throw error;

      // Use window.location.href for a full page reload to ensure server sees the session
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Demo login error:', error);
      notification.error({
        message: 'Demo Login Failed',
        description: error.message || 'Failed to sign in with demo account',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form name="login" layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}>
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
        </Form.Item>

        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <Button
            type="link"
            onClick={() => router.push('/forgot-password')}
            style={{ padding: 0 }}>
            Forgot password?
          </Button>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" block>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Text type="secondary">Don&apos;t have an account?</Text>
        <Button type="link" onClick={() => router.push('/register')}>
          Register
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        <Text type="secondary">or</Text>
        <Button type="link" onClick={handleDemoLogin} loading={loading}>
          Use Demo Account
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
