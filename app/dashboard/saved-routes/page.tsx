'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  List,
  Card,
  Button,
  Spin,
  Empty,
  Popconfirm,
  message,
  Tag,
  Space,
  Divider,
} from 'antd';
import {
  DeleteOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-provider';
import { useSupabase } from '@/lib/supabase/provider';
import { formatDistanceToNow } from 'date-fns';

const { Title, Paragraph, Text } = Typography;

const SavedRoutesContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const StyledCard = styled(Card)`
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const RouteItem = styled(List.Item)`
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const SavedRoutesPage = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const router = useRouter();
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedRoutes = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('saved_routes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRoutes(data || []);
      } catch (error) {
        console.error('Error fetching saved routes:', error);
        message.error('Failed to load saved routes');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRoutes();
  }, [user, supabase]);

  const handleDelete = async (id: string) => {
    if (!user?.id) return;

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('saved_routes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoutes(routes.filter((route) => route.id !== id));
      message.success('Route deleted successfully');
    } catch (error) {
      console.error('Error deleting route:', error);
      message.error('Failed to delete route');
    } finally {
      setDeleting(null);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/saved-routes/${id}`);
  };

  const getRouteTypeTag = (params: any) => {
    const priority = params?.routePriority;

    if (!priority) return null;

    let color = '';
    let text = '';

    switch (priority) {
      case 'scenic':
        color = 'green';
        text = 'Scenic';
        break;
      case 'twisty':
        color = 'blue';
        text = 'Twisty';
        break;
      case 'avoid_highways':
        color = 'orange';
        text = 'No Highways';
        break;
      default:
        return null;
    }

    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <SavedRoutesContainer>
      <Title level={2}>Your Saved Routes</Title>
      <Paragraph>View and manage your previously generated motorcycle routes.</Paragraph>

      <StyledCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Spin size="large" />
          </div>
        ) : routes.length === 0 ? (
          <Empty description="You don't have any saved routes yet" style={{ padding: '3rem 0' }}>
            <Button type="primary" onClick={() => router.push('/dashboard/generate')}>
              Generate Your First Route
            </Button>
          </Empty>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={routes}
            renderItem={(route) => (
              <RouteItem>
                <List.Item.Meta
                  title={
                    <Space size="middle">
                      <Text strong style={{ fontSize: '16px' }}>
                        {route.title}
                      </Text>
                      {route.input_params && getRouteTypeTag(route.input_params)}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text type="secondary">
                        Created{' '}
                        {formatDistanceToNow(new Date(route.created_at), { addSuffix: true })}
                      </Text>
                      <Space size="large">
                        {route.input_params?.startPoint && (
                          <Text>
                            <EnvironmentOutlined /> Starting from: {route.input_params.startPoint}
                          </Text>
                        )}
                        {route.input_params?.distance && (
                          <Text>
                            <ClockCircleOutlined /> {route.input_params.distance} km
                          </Text>
                        )}
                        {route.input_params?.duration && (
                          <Text>
                            <ClockCircleOutlined /> {route.input_params.duration} hours
                          </Text>
                        )}
                      </Space>
                    </Space>
                  }
                />
                <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: '16px' }}>
                  {route.summary}
                </Paragraph>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => handleViewDetails(route.id)}
                    icon={<RightOutlined />}
                  >
                    View Details
                  </Button>
                  <Popconfirm
                    title="Delete this route?"
                    description="Are you sure you want to delete this route? This action cannot be undone."
                    onConfirm={() => handleDelete(route.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />} loading={deleting === route.id}>
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              </RouteItem>
            )}
          />
        )}
      </StyledCard>
    </SavedRoutesContainer>
  );
};

export default SavedRoutesPage;
