'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { useRouter } from 'next/navigation';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useSupabase } from '@/lib/supabase/provider';
import Link from 'next/link';

const { Text } = Typography;

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterFormValues) => {
    // Check if passwords match
    if (values.password !== values.confirmPassword) {
      notification.error({
        message: 'Registration Failed',
        description: 'Passwords do not match',
        placement: 'top',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      // Show success notification and redirect to login page
      notification.success({
        message: 'Registration Successful',
        description:
          'Your account has been created. Please check your email to confirm your account.',
        placement: 'top',
      });

      router.push('/login?registration=success');
    } catch (error: any) {
      console.error('Registration error:', error);
      notification.error({
        message: 'Registration Failed',
        description: error.message || 'Failed to register',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form name="register" layout="vertical" onFinish={onFinish} autoComplete="off">
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
          rules={[
            { required: true, message: 'Please input your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" block>
            Register
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Text type="secondary">Already have an account?</Text>
        <Button type="link" onClick={() => router.push('/login')}>
          Log in
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
