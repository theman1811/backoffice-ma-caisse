import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environnments/environnment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  // Méthodes d'authentification
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getCurrentUser() {
    return await this.supabase.auth.getUser();
  }

  // Méthodes pour les données
  async getData(table: string, select = '*') {
    const { data, error } = await this.supabase
      .from(table)
      .select(select);
    
    if (error) throw error;
    return data;
  }

  async insertData(table: string, data: any) {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  }

  async updateData(table: string, data: any, id: string) {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return result;
  }

  async deleteData(table: string, id: string) {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Vérifie si l'utilisateur est connecté.
   * @returns Promise<boolean> - true si l'utilisateur est connecté, sinon false.
   */
  async isLoggedIn(): Promise<boolean> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      return false;
    }
    return !!data.user;
  }
}