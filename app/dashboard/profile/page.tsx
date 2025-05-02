'use client';

import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Select, 
  Input, 
  Button, 
  Spin, 
  message 
} from 'antd';
import styled from 'styled-components';
import { useAuth } from '@/lib/auth/auth-provider';
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

const ProfilePage = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          form.setFieldsValue({
            route_priority: data.route_priority,
            motorcycle_type: data.motorcycle_type,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, supabase, form]);

  const onFinish = async (values: any) => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        user_id: user.id,
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
        Set your preferences for route generation. These will be used as defaults when creating new routes.
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
            }}
          >
            <Form.Item
              name="route_priority"
              label="Preferred Route Priority"
              rules={[{ required: true, message: 'Please select a route priority' }]}
            >
              <Select placeholder="Select your preferred route priority">
                <Option value="scenic">Scenic Route</Option>
                <Option value="twisty">Twisty Roads</Option>
                <Option value="avoid_highways">Avoid Highways</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="motorcycle_type"
              label="Motorcycle Type"
            >
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
};

export default ProfilePage;