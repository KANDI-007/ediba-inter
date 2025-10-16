import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client pour les opérations côté client (avec RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Client avec service role pour les opérations admin (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Configuration des types TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          full_name: string;
          role: 'admin' | 'comptable' | 'commercial' | 'lecture';
          avatar_url?: string;
          phone?: string;
          address?: string;
          join_date?: string;
          last_login?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          full_name: string;
          role: 'admin' | 'comptable' | 'commercial' | 'lecture';
          avatar_url?: string;
          phone?: string;
          address?: string;
          join_date?: string;
          last_login?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'comptable' | 'commercial' | 'lecture';
          avatar_url?: string;
          phone?: string;
          address?: string;
          join_date?: string;
          last_login?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          raison_sociale: string;
          nom_commercial?: string;
          nif: string;
          rccm?: string;
          adresse: string;
          ville: string;
          telephone: string;
          email?: string;
          contact_principal?: string;
          secteur_activite?: string;
          regime_fiscal: string;
          delai_paiement: number;
          remise: number;
          limite_credit: number;
          statut: 'actif' | 'inactif' | 'suspendu';
          date_creation: string;
          derniere_facture?: string;
          total_facture: number;
          total_encaissement: number;
          solde_impaye: number;
          nombre_factures: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          raison_sociale: string;
          nom_commercial?: string;
          nif: string;
          rccm?: string;
          adresse: string;
          ville: string;
          telephone: string;
          email?: string;
          contact_principal?: string;
          secteur_activite?: string;
          regime_fiscal?: string;
          delai_paiement?: number;
          remise?: number;
          limite_credit?: number;
          statut?: 'actif' | 'inactif' | 'suspendu';
          date_creation?: string;
          derniere_facture?: string;
          total_facture?: number;
          total_encaissement?: number;
          solde_impaye?: number;
          nombre_factures?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          raison_sociale?: string;
          nom_commercial?: string;
          nif?: string;
          rccm?: string;
          adresse?: string;
          ville?: string;
          telephone?: string;
          email?: string;
          contact_principal?: string;
          secteur_activite?: string;
          regime_fiscal?: string;
          delai_paiement?: number;
          remise?: number;
          limite_credit?: number;
          statut?: 'actif' | 'inactif' | 'suspendu';
          date_creation?: string;
          derniere_facture?: string;
          total_facture?: number;
          total_encaissement?: number;
          solde_impaye?: number;
          nombre_factures?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Ajouter d'autres tables selon les besoins
    };
  };
}
