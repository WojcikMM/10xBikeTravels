'use client';

import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Collapse, 
  Divider, 
  Space, 
  Tag,
  Descriptions,
  message
} from 'antd';
import { SaveOutlined, CopyOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

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

interface RouteResultProps {
  result: {
    title: string;
    summary: string;
    routePoints: any;
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
  viewOnly = false
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

  const getPriorityLabel = (priority?: string) => {
    if (!priority) return null;
    
    switch(priority) {
      case 'scenic': return 'Scenic Route';
      case 'twisty': return 'Twisty Roads';
      case 'avoid_highways': return 'Avoid Highways';
      default: return priority;
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
            <Descriptions.Item label="Distance">
              {result.inputParams.distance} km
            </Descriptions.Item>
          )}
          {result.inputParams?.duration && (
            <Descriptions.Item label="Duration">
              {result.inputParams.duration} hours
            </Descriptions.Item>
          )}
        </Descriptions>
      </StyledCard>
      
      <StyledCard>
        <Title level={4}>Route Points</Title>
        <Paragraph>
          Detailed waypoints for your motorcycle journey:
        </Paragraph>
        
        <Collapse defaultActiveKey={['1']}>
          <Panel header="Route JSON Data" key="1">
            <div style={{ position: 'relative' }}>
              <CopyButton 
                icon={<CopyOutlined />} 
                onClick={handleCopyToClipboard}
                type={copied ? "primary" : "default"}
              >
                {copied ? 'Copied!' : 'Copy'}
              </CopyButton>
              <RoutePointsContainer>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(result.routePoints, null, 2)}
                </pre>
              </RoutePointsContainer>
            </div>
          </Panel>
        </Collapse>
        
        {!viewOnly && onSave && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              size="large"
              onClick={onSave}
              loading={saving}
            >
              Save This Route
            </Button>
          </div>
        )}
      </StyledCard>
    </>
  );
};

export default RouteResult;