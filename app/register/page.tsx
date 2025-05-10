import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import RegisterClient from './client';

// Komponent serwerowy do sprawdzania sesji i przekierowań
export default async function RegisterPage() {
  // Sprawdź stan uwierzytelnienia po stronie serwera
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Jeśli użytkownik jest już zalogowany, przekieruj na dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // Renderuj komponent kliencki jeśli użytkownik nie jest zalogowany
  return <RegisterClient />;
}
