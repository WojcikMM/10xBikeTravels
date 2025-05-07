'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Spin,
  Divider,
  Radio,
  message,
  Alert,
  Space,
  Result,
} from 'antd';
import { SendOutlined, SaveOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '@/lib/auth/auth-provider';
import { useSupabase } from '@/lib/supabase/provider';
import RouteResult from '@/components/routes/RouteResult';
import { generateRoute } from '@/lib/ai/route-generator';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const GenerateContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const StyledCard = styled(Card)`
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const ResultContainer = styled.div`
  margin-top: 2rem;
`;

const ProfileInfoCard = styled(Card)`
  margin-bottom: 1.5rem;
  background-color: #f0f7ff;
  border: 1px solid #91caff;
`;

const GeneratePage = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [form] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [useProfilePreference, setUseProfilePreference] = useState(false);
  const [hasProfileData, setHasProfileData] = useState(false);

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
          setProfile(data);
          // Check if profile has required data
          const hasRequiredData = data.route_priority && data.motorcycle_type;
          setHasProfileData(hasRequiredData);
          // Only enable profile preferences if we have the required data
          setUseProfilePreference(hasRequiredData);
        } else {
          setHasProfileData(false);
          setUseProfilePreference(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('Failed to load profile data');
        setHasProfileData(false);
        setUseProfilePreference(false);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, supabase]);

  const onFinish = async (values: any) => {
    setError(null);
    setGenerating(true);
    setResult(null);

    try {
      // Determine which route priority to use
      const routePriority =
        useProfilePreference && profile?.route_priority
          ? profile.route_priority
          : values.route_priority;

      // Determine which motorcycle type to use
      const motorcycleType =
        useProfilePreference && profile?.motorcycle_type
          ? profile.motorcycle_type
          : values.motorcycle_type;

      // Generate route using AI
      const generatedRoute = await generateRoute({
        startPoint: values.start_point,
        routePriority,
        motorcycleType,
        distance: values.distance_type === 'distance' ? values.distance : undefined,
        duration: values.distance_type === 'duration' ? values.duration : undefined,
      });

      setResult({
        ...generatedRoute,
        inputParams: {
          startPoint: values.start_point,
          routePriority,
          motorcycleType,
          distance: values.distance_type === 'distance' ? values.distance : undefined,
          duration: values.distance_type === 'duration' ? values.duration : undefined,
        },
      });
    } catch (error: any) {
      console.error('Error generating route:', error);
      setError(error.message || 'Failed to generate route. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!user?.id || !result) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('saved_routes').insert({
        user_id: user.id,
        title: result.title,
        summary: result.summary,
        route_data: result.routePoints,
        input_params: result.inputParams,
        created_at: new Date(),
      });

      if (error) throw error;
      message.success('Route saved successfully');
    } catch (error) {
      console.error('Error saving route:', error);
      message.error('Failed to save route');
    } finally {
      setSaving(false);
    }
  };

  return (
    <GenerateContainer>
      <Title level={2}>Generate Motorcycle Route</Title>
      <Paragraph>
        Create a new motorcycle route in Poland based on your preferences and starting point.
      </Paragraph>

      {!hasProfileData && !profileLoading && (
        <ProfileInfoCard>
          <Space direction="vertical">
            <Title level={4}>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              Set Up Your Profile
            </Title>
            <Paragraph>
              To get the most out of MotoTrail, consider setting up your profile with your preferred
              route style and motorcycle type. This will allow you to quickly generate routes that
              match your preferences without having to specify them each time.
            </Paragraph>
            <Button type="primary" onClick={() => (window.location.href = '/dashboard/profile')}>
              Set Up Profile
            </Button>
          </Space>
        </ProfileInfoCard>
      )}

      <StyledCard>
        {profileLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              distance_type: 'distance',
              distance: 150,
              route_priority: 'scenic',
              motorcycle_type: 'standard',
            }}>
            <Form.Item
              name="start_point"
              label="Starting Point"
              rules={[{ required: true, message: 'Please enter a starting point' }]}>
              <Input placeholder="Enter a city or location in Poland" />
            </Form.Item>

            <Form.Item label="Route Preferences">
              <Radio.Group
                value={useProfilePreference}
                onChange={(e) => setUseProfilePreference(e.target.value)}
                style={{ marginBottom: '1rem' }}>
                <Radio value={true} disabled={!hasProfileData}>
                  Use profile preferences
                </Radio>
                <Radio value={false}>Customize for this route</Radio>
              </Radio.Group>

              {profile && useProfilePreference && hasProfileData ? (
                <div>
                  <Alert
                    message="Using your profile preferences"
                    description={
                      <Space direction="vertical">
                        <Text>
                          Route Priority:{' '}
                          {profile.route_priority === 'scenic'
                            ? 'Scenic Route'
                            : profile.route_priority === 'twisty'
                              ? 'Twisty Roads'
                              : 'Avoid Highways'}
                        </Text>
                        {profile.motorcycle_type && (
                          <Text>
                            Motorcycle Type:{' '}
                            {profile.motorcycle_type.charAt(0).toUpperCase() +
                              profile.motorcycle_type.slice(1)}
                          </Text>
                        )}
                      </Space>
                    }
                    type="info"
                    showIcon
                  />
                </div>
              ) : (
                <>
                  <Form.Item
                    name="route_priority"
                    label="Route Priority"
                    rules={[
                      {
                        required: !useProfilePreference,
                        message: 'Please select a route priority',
                      },
                    ]}>
                    <Select placeholder="Select route priority">
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
                </>
              )}
            </Form.Item>

            <Form.Item label="Distance or Duration">
              <Form.Item name="distance_type" noStyle>
                <Radio.Group>
                  <Radio.Button value="distance">Distance (km)</Radio.Button>
                  <Radio.Button value="duration">Duration (hours)</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.distance_type !== currentValues.distance_type
                }>
                {({ getFieldValue }) =>
                  getFieldValue('distance_type') === 'distance' ? (
                    <Form.Item
                      name="distance"
                      rules={[{ required: true, message: 'Please enter a distance' }]}
                      style={{ marginTop: '1rem' }}>
                      <InputNumber min={1} max={500} addonAfter="km" style={{ width: '100%' }} />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="duration"
                      rules={[{ required: true, message: 'Please enter a duration' }]}
                      style={{ marginTop: '1rem' }}>
                      <InputNumber
                        min={0.5}
                        max={10}
                        step={0.5}
                        addonAfter="hours"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={generating}
                size="large">
                Generate Route
              </Button>
            </Form.Item>
          </Form>
        )}
      </StyledCard>

      {error && (
        <ResultContainer>
          <Alert message="Error Generating Route" description={error} type="error" showIcon />
        </ResultContainer>
      )}

      {result && (
        <ResultContainer>
          <RouteResult result={result} onSave={handleSaveRoute} saving={saving} />
        </ResultContainer>
      )}
    </GenerateContainer>
  );
};

export default GeneratePage;
