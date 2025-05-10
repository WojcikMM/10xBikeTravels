import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import { SupabaseProvider } from '@/lib/supabase/provider';
import { AuthProvider } from '@/lib/auth/auth-provider';
import StyledComponentsRegistry from '@/lib/styled-components-registry';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MotoTrail - Motorcycle Route Generator',
  description: 'Generate exciting motorcycle routes in Poland',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1890ff',
                colorSuccess: '#52c41a',
                colorWarning: '#faad14',
                colorError: '#f5222d',
                colorInfo: '#1890ff',
                borderRadius: 6,
              },
            }}>
            <SupabaseProvider>
              <AuthProvider>{children}</AuthProvider>
            </SupabaseProvider>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
