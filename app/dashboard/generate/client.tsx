'use client';

import React, { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase/provider';
import RouteResult from '@/components/routes/RouteResult';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
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

interface GenerateClientProps {
  userId: string;
  profileData: any;
  hasProfileData: boolean;
  initialResult: any;
  initialError: string | null;
  searchParams: any;
}

const GenerateClient = ({ 
  userId, 
  profileData, 
  hasProfileData, 
  initialResult, 
  initialError,
  searchParams
}: GenerateClientProps) => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [error] = useState<string | null>(initialError);
  const [result] = useState<any>(initialResult);
  const [useProfilePreference, setUseProfilePreference] = useState(hasProfileData);

  
  React.useEffect(() => {
    form.setFieldsValue({
      start_point: searchParams.start_point || '',
      route_priority: searchParams.route_priority || 'scenic',
      motorcycle_type: searchParams.motorcycle_type || 'standard',
      distance_type: searchParams.distance_type || 'distance',
      distance: searchParams.distance ? parseInt(searchParams.distance) : 150,
      duration: searchParams.duration ? parseFloat(searchParams.duration) : 2,
    });
  }, [form, searchParams]);

  const onFinish = async (values: any) => {
    const routePriority =
      useProfilePreference && profileData?.route_priority
        ? profileData.route_priority
        : values.route_priority;

    const motorcycleType =
      useProfilePreference && profileData?.motorcycle_type
        ? profileData.motorcycle_type
        : values.motorcycle_type;

    let url = `?start_point=${encodeURIComponent(values.start_point)}&route_priority=${routePriority}&motorcycle_type=${motorcycleType}&distance_type=${values.distance_type}&generate=true`;
    
    if (values.distance_type === 'distance') {
      url += `&distance=${values.distance}`;
    } else {
      url += `&duration=${values.duration}`;
    }
    
    router.push(url);
  };

  const handleSaveRoute = async () => {
    if (!userId || !result) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('saved_routes').insert({
        user_id: userId,
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

      {!hasProfileData && (
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
            <Button type="primary" onClick={() => router.push('/dashboard/profile')}>
              Set Up Profile
            </Button>
          </Space>
        </ProfileInfoCard>
      )}

      <StyledCard>
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

            {profileData && useProfilePreference && hasProfileData ? (
              <div>
                <Alert
                  message="Using your profile preferences"
                  description={
                    <Space direction="vertical">
                      <Text>
                        Route Priority:{' '}
                        {profileData.route_priority === 'scenic'
                          ? 'Scenic Route'
                          : profileData.route_priority === 'twisty'
                            ? 'Twisty Roads'
                            : 'Avoid Highways'}
                      </Text>
                      {profileData.motorcycle_type && (
                        <Text>
                          Motorcycle Type:{' '}
                          {profileData.motorcycle_type.charAt(0).toUpperCase() +
                            profileData.motorcycle_type.slice(1)}
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
                      message: 'Proszę wybrać priorytet trasy',
                    },
                  ]}>
                  <Select placeholder="Select route priority">
                    <Option value="scenic">Scenic Route</Option>
                    <Option value="twisty">Twisty Roads</Option>
                    <Option value="avoid_highways">Avoid Highways</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="motorcycle_type" label="Typ motocykla">
                  <Select placeholder="Wybierz typ swojego motocykla">
                    <Option value="sport">Sportowy</Option>
                    <Option value="cruiser">Cruiser</Option>
                    <Option value="touring">Turystyczny</Option>
                    <Option value="adventure">Adventure</Option>
                    <Option value="standard">Standardowy</Option>
                    <Option value="other">Inny</Option>
                  </Select>
                </Form.Item>
              </>
            )}
          </Form.Item>

          <Form.Item label="Dystans lub czas trwania">
            <Form.Item name="distance_type" noStyle>
              <Radio.Group>
                <Radio.Button value="distance">Dystans (km)</Radio.Button>
                <Radio.Button value="duration">Czas trwania (godziny)</Radio.Button>
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
                    rules={[{ required: true, message: 'Proszę podać dystans' }]}
                    style={{ marginTop: '1rem' }}>
                    <InputNumber min={1} max={500} addonAfter="km" style={{ width: '100%' }} />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="duration"
                    rules={[{ required: true, message: 'Proszę podać czas trwania' }]}
                    style={{ marginTop: '1rem' }}>
                    <InputNumber
                      min={0.5}
                      max={10}
                      step={0.5}
                      addonAfter="godziny"
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
              size="large">
              Generuj trasę
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>

      {error && (
        <ResultContainer>
          <Alert message="Błąd generowania trasy" description={error} type="error" showIcon />
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

export default GenerateClient;