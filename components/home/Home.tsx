'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/supabase/database.types';
import { Spin } from 'antd';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #1a1a1a, #2d2d2d);
`;

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };

    checkSession();
  }, [supabase, router]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  return null;
}