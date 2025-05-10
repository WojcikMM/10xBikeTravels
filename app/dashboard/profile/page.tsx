import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import ProfileClient from './client';

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  const userId = session.user.id;
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return <ProfileClient 
    userId={userId} 
    initialProfileData={profileData || null} 
  />;
}
