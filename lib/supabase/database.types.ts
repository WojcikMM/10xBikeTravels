/* eslint-disable no-unused-vars */
// This file is used to define the database schema for Supabase
// It is used by the Supabase client to generate types for the database
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          route_priority: string | null;
          motorcycle_type: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          route_priority?: string | null;
          motorcycle_type?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          route_priority?: string | null;
          motorcycle_type?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      saved_routes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          summary: string;
          route_data: Json;
          input_params: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          summary: string;
          route_data: Json;
          input_params: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          summary?: string;
          route_data?: Json;
          input_params?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      [_: string]: never;
    };
    Functions: {
      [_: string]: never;
    };
    Enums: {
      [_: string]: never;
    };
  };
}
