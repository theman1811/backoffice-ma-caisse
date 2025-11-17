export interface BoutiqueDetail {
  role: string;
  country: string;
  currency: string;
  categorie: string;
  is_active: boolean;
  created_at: string;
  boutique_id: number;
  boutique_name: string;
}

export interface Client {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  is_active: boolean;
  total_boutiques: number;
  total_boutiques_owned: number;
  boutiques_details: BoutiqueDetail[];
}

export type GetClientsResponse = Client[];
