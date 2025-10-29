export interface User {
  id: number;
  auth_id: string;
  role: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  profile_photo: string | null;
  statut: boolean;
  updated_at: string;
  created_at: string;
}

// Requête pour obtenir plusieurs utilisateurs
export type GetUsersResponse = User[];
