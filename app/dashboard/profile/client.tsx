'use client';

import React, { useState } from 'react';
import { Typography, Card, Form, Select, Button, Spin, message } from 'antd';
import styled from 'styled-components';
import { useSupabase } from '@/lib/supabase/provider';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const StyledCard = styled(Card)`
  margin-top: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

interface ProfileClientProps {
  userId: string;
  initialProfileData: any | null;
}

export default function ProfileClient({ userId, initialProfileData }: ProfileClientProps) {
  const { supabase } = useSupabase();
  const [form] = Form.useForm();
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (initialProfileData) {
    form.setFieldsValue({
      route_priority: initialProfileData.route_priority,
      motorcycle_type: initialProfileData.motorcycle_type,
    });
  }

  const onFinish = async (values: any) => {
    if (!userId) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        user_id: userId,
        route_priority: values.route_priority,
        motorcycle_type: values.motorcycle_type,
        updated_at: new Date(),
      });

      if (error) throw error;
      message.success('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      message.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileContainer>
      <Title level={2}>Your Profile</Title>
      <Paragraph>
        Set your preferences for route generation. These will be used as defaults when creating new
        routes.
      </Paragraph>

      <StyledCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              route_priority: 'scenic',
              motorcycle_type: 'standard',
            }}>
            <Form.Item
              name="route_priority"
              label="Preferred Route Priority"
              rules={[{ required: true, message: 'Please select a route priority' }]}>
              <Select placeholder="Select your preferred route priority">
                <Option value="scenic">Scenic Route</Option>
                <Option value="twisty">Twisty Roads</Option>
                <Option value="avoid_highways">Avoid Highways</Option>
              </Select>
            </Form.Item>

            <Form.Item name="motorcycle_type" label="Motorcycle Type">
              <Select placeholder="Select your motorcycle type">
                <Option value="sport">Sport</Option>
                <Option value="cruiser">Cruiser</Option>
                <Option value="touring">Touring</Option>
                <Option value="adventure">Adventure</Option>
                <Option value="standard">Standard</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving}>
                Save Preferences
              </Button>
            </Form.Item>
          </Form>
        )}
      </StyledCard>
    </ProfileContainer>
  );
}
