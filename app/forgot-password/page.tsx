import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import ForgotPasswordClient from './client';

// Komponent serwerowy do sprawdzania sesji i przekierowań
export default async function ForgotPasswordPage() {
  // Sprawdź stan uwierzytelnienia po stronie serwera
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Jeśli użytkownik jest zalogowany, przekieruj na dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // Renderuj komponent kliencki resetowania hasła
  return <ForgotPasswordClient />;
}
