'use client';

import React from 'react';
import { Typography, Card } from 'antd';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ActionCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ActionCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const CardImage = styled.div`
  position: relative;
  height: 180px;
  margin-bottom: 1rem;
`;

interface DashboardClientProps {
  initialUserEmail: string | undefined;
  displayName: string;
}

// Komponent kliencki z UI dashboardu
export default function DashboardClient({ initialUserEmail, displayName }: DashboardClientProps) {
  return (
    <DashboardContainer>
      <div>
        <Title level={2}>Welcome, {displayName}</Title>
        <Paragraph>
          Ready to hit the road? Generate exciting motorcycle routes tailored to your preferences,
          or view your saved routes.
        </Paragraph>
      </div>

      <ActionCardsContainer>
        <Link href="/dashboard/generate" style={{ textDecoration: 'none' }}>
          <ActionCard hoverable>
            <CardImage>
              <Image
                src="https://images.unsplash.com/photo-1643913236750-39f654883299?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "
                alt="Generate route"
                fill
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </CardImage>
            <Title level={4}>Generate New Route</Title>
            <Paragraph>
              Create a new motorcycle route based on your preferences and starting point
            </Paragraph>
          </ActionCard>
        </Link>

        <Link href="/dashboard/saved-routes" style={{ textDecoration: 'none' }}>
          <ActionCard hoverable>
            <CardImage>
              <Image
                src="https://images.unsplash.com/photo-1686766250114-2e95bfb0f848?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Saved routes"
                fill
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </CardImage>
            <Title level={4}>Saved Routes</Title>
            <Paragraph>
              View and manage your previously generated and saved motorcycle routes
            </Paragraph>
          </ActionCard>
        </Link>

        <Link href="/dashboard/profile" style={{ textDecoration: 'none' }}>
          <ActionCard hoverable>
            <CardImage>
              <Image
                src="https://images.unsplash.com/photo-1611004061856-ccc3cbe944b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Profile"
                fill
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </CardImage>
            <Title level={4}>Your Profile</Title>
            <Paragraph>
              Update your preferences to customize route generation to your style
            </Paragraph>
          </ActionCard>
        </Link>
      </ActionCardsContainer>
    </DashboardContainer>
  );
}
