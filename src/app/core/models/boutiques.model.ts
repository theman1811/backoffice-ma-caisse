export interface Boutique {
  id?: number;
  name: string;
  country: string;
  categorie: string;
  currency?: string | null;
  created_by?: number | null;
  created_at: string;
  updated_at?: string | null;
  is_active: boolean;
}


export type getBoutiquesResponse= Boutique[]


export interface BoutiqueOverviewUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface BoutiqueOverview {
  boutique_id: number;
  boutique_name: string;
  total_transactions: number;
  total_amount: number;
  total_users: number;
  users: BoutiqueOverviewUser[];
}

export type GetBoutiquesOverviewResponse = BoutiqueOverview[];

