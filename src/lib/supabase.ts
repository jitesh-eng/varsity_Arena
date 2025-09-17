import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: string;
          name: string;
          type: 'free' | 'paid';
          date: string;
          prize: string;
          entry_fee: number;
          rules: string;
          description: string;
          max_teams: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tournaments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tournaments']['Insert']>;
      };
      registrations: {
        Row: {
          id: string;
          tournament_id: string;
          team_name: string;
          leader_name: string;
          game_uid: string;
          whatsapp_number: string;
          payment_status: 'pending' | 'verified' | 'rejected';
          payment_screenshot_url: string | null;
          registration_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['registrations']['Row'], 'id' | 'created_at' | 'updated_at' | 'registration_id'>;
        Update: Partial<Database['public']['Tables']['registrations']['Insert']>;
      };
      leaderboard: {
        Row: {
          id: string;
          tournament_id: string;
          registration_id: string;
          team_name: string;
          leader_name: string;
          points: number;
          rank: number;
          status: 'active' | 'eliminated' | 'disqualified';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leaderboard']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leaderboard']['Insert']>;
      };
      contact_queries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: 'unread' | 'read' | 'responded';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_queries']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contact_queries']['Insert']>;
      };
    };
  };
};