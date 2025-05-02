'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import styled from 'styled-components';
import LoginForm from '@/components/auth/LoginForm';

const { Title, Paragraph } = Typography;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  
  @media (max-width: 480px) {
    box-shadow: none;
  }
`;

const LoginPage = () => {
  return (
    <LoginContainer>
      <StyledCard>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome to MotoTrail
        </Title>
        <Paragraph style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Discover exciting motorcycle routes in Poland
        </Paragraph>
        <LoginForm />
      </StyledCard>
    </LoginContainer>
  );
};

export default LoginPage;