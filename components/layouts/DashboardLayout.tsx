'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Dropdown, Avatar, Space } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { 
  HomeOutlined, 
  RocketOutlined, 
  UserOutlined, 
  LogoutOutlined,
  MenuOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/lib/auth/auth-provider';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 12px;
  }
`;

const MobileMenuButton = styled(Button)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const items = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'generate',
      icon: <RocketOutlined />,
      label: <Link href="/dashboard/generate">Generate Route</Link>,
    },
    {
      key: 'saved-routes',
      icon: <StarOutlined />,
      label: <Link href="/dashboard/saved-routes">Saved Routes</Link>,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">Profile</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => router.push('/dashboard/profile'),
    },
    {
      key: 'signout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: handleSignOut,
    },
  ];

  const getSelectedKeys = () => {
    if (pathname === '/dashboard') return ['dashboard'];
    if (pathname === '/dashboard/generate') return ['generate'];
    if (pathname.startsWith('/dashboard/saved-routes')) return ['saved-routes'];
    if (pathname === '/dashboard/profile') return ['profile'];
    return [];
  };

  if (!mounted) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
        }}
      >
        <Logo>
          {!collapsed && 'MotoTrail'}
        </Logo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 0 : 200 }}>
        <StyledHeader>
          <MobileMenuButton
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div></div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              {user?.email && (
                <Text ellipsis style={{ maxWidth: 150 }}>
                  {user.email}
                </Text>
              )}
            </Space>
          </Dropdown>
        </StyledHeader>
        <Content style={{ margin: '24px 16px', overflow: 'initial' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;