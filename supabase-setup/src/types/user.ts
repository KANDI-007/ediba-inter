export interface User {
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
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
