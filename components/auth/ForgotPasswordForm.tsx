'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { MailOutlined } from '@ant-design/icons';
import { useSupabase } from '@/lib/supabase/provider';

const { Text } = Typography;

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onFinish = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send password reset email');
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

      {success && (
        <Alert 
          message="Password reset email sent. Please check your inbox." 
          type="success" 
          showIcon 
          style={{ marginBottom: '1rem' }} 
        />
      )}

      <Form
        name="forgot-password"
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

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            block
          >
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Text type="secondary">Remembered your password?</Text>
        <Button 
          type="link" 
          onClick={() => router.push('/login')}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 