'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  Button,
  Spin,
  Divider,
  Space,
  Tag,
  Descriptions,
  Alert,
  message,
  Breadcrumb,
} from 'antd';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  RocketOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-provider';
import { useSupabase } from '@/lib/supabase/provider';
import RouteResult from '@/components/routes/RouteResult';

const { Title, Paragraph, Text } = Typography;

const RouteDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const StyledCard = styled(Card)`
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const RouteDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!user?.id || !routeId) return;

      try {
        const { data, error } = await supabase
          .from('saved_routes')
          .select('*')
          .eq('id', routeId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          // Format the data to match the format expected by RouteResult
          setRoute({
            title: data.title,
            summary: data.summary,
            routePoints: data.route_data,
            inputParams: data.input_params,
          });
        } else {
          setError('Route not found');
        }
      } catch (error: any) {
        console.error('Error fetching route details:', error);
        setError(error.message || 'Failed to load route details');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteDetails();
  }, [user, routeId, supabase]);

  return (
    <RouteDetailContainer>
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/saved-routes">Saved Routes</Link> },
          { title: 'Route Details' },
        ]}
        style={{ marginBottom: '1rem' }}
      />

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.back()}
        style={{ marginBottom: '1rem' }}
      >
        Back to Saved Routes
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : route ? (
        <RouteResult result={route} viewOnly={true} />
      ) : (
        <Alert
          message="Not Found"
          description="The requested route could not be found"
          type="warning"
          showIcon
        />
      )}
    </RouteDetailContainer>
  );
};

export default RouteDetailPage;
