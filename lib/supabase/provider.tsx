'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './client';
import { Database } from './database.types';

type SupabaseContext = {
  supabase: typeof supabase;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => supabase);

  useEffect(() => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Handle sign in event
      } else if (event === 'SIGNED_OUT') {
        // Handle sign out event
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client]);

  return <Context.Provider value={{ supabase: client }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
};
