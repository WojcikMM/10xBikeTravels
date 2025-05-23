import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { createServerClient } from '@/lib/supabase/server';
import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayoutWrapper({ children }: { children: ReactNode }) {
  // Create the server client with cookies
  const supabase = createServerClient();

  // Get the session
  const { data, error } = await supabase.auth.getSession();

  // If there was an error or no session, redirect to login
  if (error || !data.session) {
    console.error('Auth error or no session:', error);
    redirect('/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
