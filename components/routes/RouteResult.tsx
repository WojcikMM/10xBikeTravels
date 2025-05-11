'use client';

import React, { useState } from 'react';
import { Typography, Card, Button, Divider, Descriptions, message, Tabs, Tooltip } from 'antd';
import {
  SaveOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  GoogleOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { RoutePoint } from '@/lib/ai/openrouter-service';
import { createGoogleMapsUrl } from '@/lib/map-utils';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

// Dynamically import the map component to prevent SSR issues
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      Loading map...
    </div>
  ),
});

const StyledCard = styled(Card)`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const RoutePointsContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
`;

const CopyButton = styled(Button)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const ActionButtonsContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

interface RouteResultProps {
  result: {
    title: string;
    summary: string;
    routePoints: RoutePoint[];
    inputParams: {
      startPoint?: string;
      routePriority?: string;
      motorcycleType?: string;
      distance?: number;
      duration?: number;
    };
  };
  onSave?: () => Promise<void>;
  saving?: boolean;
  viewOnly?: boolean;
}

const RouteResult: React.FC<RouteResultProps> = ({
  result,
  onSave,
  saving = false,
  viewOnly = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    try {
      const jsonString = JSON.stringify(result.routePoints, null, 2);
      navigator.clipboard.writeText(jsonString);
      setCopied(true);
      message.success('Route points copied to clipboard');

      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      message.error('Failed to copy to clipboard');
    }
  };

  const handleOpenInGoogleMaps = () => {
    try {
      const googleMapsUrl = createGoogleMapsUrl(result.routePoints);

      if (!googleMapsUrl) {
        message.error('Unable to create Google Maps URL. Route may be invalid.');
        return;
      }

      // Open Google Maps in a new tab
      window.open(googleMapsUrl, '_blank');
    } catch (error) {
      console.error('Failed to open Google Maps:', error);
      message.error('Failed to open route in Google Maps');
    }
  };

  const handleShareRoute = () => {
    try {
      const googleMapsUrl = createGoogleMapsUrl(result.routePoints);

      if (navigator.share && googleMapsUrl) {
        navigator
          .share({
            title: result.title,
            text: result.summary,
            url: googleMapsUrl,
          })
          .then(() => message.success('Route shared successfully'))
          .catch((error) => {
            console.error('Error sharing route:', error);
            // Fall back to copying URL if sharing fails
            copyUrlToClipboard(googleMapsUrl);
          });
      } else if (googleMapsUrl) {
        // Fallback for browsers without Web Share API
        copyUrlToClipboard(googleMapsUrl);
      } else {
        message.error('Unable to share route. Route may be invalid.');
      }
    } catch (error) {
      console.error('Failed to share route:', error);
      message.error('Failed to share route');
    }
  };

  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => message.success('Route URL copied to clipboard'))
      .catch(() => message.error('Failed to copy URL to clipboard'));
  };

  const getPriorityLabel = (priority?: string) => {
    if (!priority) return null;

    switch (priority) {
      case 'scenic':
        return 'Scenic Route';
      case 'twisty':
        return 'Twisty Roads';
      case 'avoid_highways':
        return 'Avoid Highways';
      default:
        return priority;
    }
  };

  const getMotorcycleTypeLabel = (type?: string) => {
    if (!type) return null;
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <StyledCard>
        <Title level={2}>{result.title}</Title>
        <Paragraph style={{ fontSize: '16px' }}>{result.summary}</Paragraph>

        <Divider />

        <Descriptions title="Route Details" bordered column={{ xs: 1, sm: 2, md: 3 }}>
          {result.inputParams?.startPoint && (
            <Descriptions.Item label="Starting Point">
              {result.inputParams.startPoint}
            </Descriptions.Item>
          )}
          {result.inputParams?.routePriority && (
            <Descriptions.Item label="Priority">
              {getPriorityLabel(result.inputParams.routePriority)}
            </Descriptions.Item>
          )}
          {result.inputParams?.motorcycleType && (
            <Descriptions.Item label="Motorcycle Type">
              {getMotorcycleTypeLabel(result.inputParams.motorcycleType)}
            </Descriptions.Item>
          )}
          {result.inputParams?.distance && (
            <Descriptions.Item label="Distance">{result.inputParams.distance} km</Descriptions.Item>
          )}
          {result.inputParams?.duration && (
            <Descriptions.Item label="Duration">
              {result.inputParams.duration} hours
            </Descriptions.Item>
          )}
        </Descriptions>

        <ActionButtonsContainer>
          <Tooltip title="Open in Google Maps">
            <Button icon={<GoogleOutlined />} onClick={handleOpenInGoogleMaps} type="default">
              Open in Google Maps
            </Button>
          </Tooltip>

          <Tooltip title="Share Route">
            <Button icon={<ShareAltOutlined />} onClick={handleShareRoute} type="default">
              Share Route
            </Button>
          </Tooltip>
        </ActionButtonsContainer>
      </StyledCard>

      <StyledCard>
        <Title level={4}>Route Points</Title>
        <Paragraph>Detailed waypoints for your motorcycle journey:</Paragraph>

        <Tabs defaultActiveKey="map">
          <TabPane
            tab={
              <span>
                <EnvironmentOutlined />
                Map
              </span>
            }
            key="map">
            <RouteMap routePoints={result.routePoints} />
          </TabPane>
          <TabPane tab="Route JSON Data" key="json">
            <div style={{ position: 'relative' }}>
              <CopyButton
                icon={<CopyOutlined />}
                onClick={handleCopyToClipboard}
                type={copied ? 'primary' : 'default'}>
                {copied ? 'Copied!' : 'Copy'}
              </CopyButton>
              <RoutePointsContainer>
                <pre style={{ margin: 0 }}>{JSON.stringify(result.routePoints, null, 2)}</pre>
              </RoutePointsContainer>
            </div>
          </TabPane>
        </Tabs>

        {!viewOnly && onSave && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              onClick={onSave}
              loading={saving}>
              Save This Route
            </Button>
          </div>
        )}
      </StyledCard>
    </>
  );
};

export default RouteResult;
