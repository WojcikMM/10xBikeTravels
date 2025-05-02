import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  // If no session, redirect to login
  if (!session) {
    redirect('/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}