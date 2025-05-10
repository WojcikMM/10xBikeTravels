import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import DashboardClient from './client';

// Komponent serwerowy do sprawdzania sesji i przekierowań
export default async function DashboardPage() {
  // Sprawdź stan uwierzytelnienia po stronie serwera
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Jeśli użytkownik nie jest zalogowany, przekieruj na stronę logowania
  if (!session) {
    redirect('/login');
  }
  
  // Pobierz dane użytkownika, które będą przekazane do komponentu klienckiego
  const user = session.user;
  const emailPrefix = user.email ? user.email.split('@')[0] : 'Rider';
  
  // Renderuj komponent kliencki, przekazując dane z serwera
  return <DashboardClient initialUserEmail={user.email} displayName={emailPrefix} />;
}
