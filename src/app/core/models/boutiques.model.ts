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
