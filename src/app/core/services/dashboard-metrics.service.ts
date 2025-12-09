import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { DashboardMetrics } from '../models/dashboard.models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardMetricsService {
  private metrics$ = new BehaviorSubject<DashboardMetrics>({
    totalUsers: 0,
    totalActiveBoutiques: 0,
    totalSales: 0,
    totalRevenue: 0,
    loading: false
  });

  constructor(private supabaseService: SupabaseService) {}

  get metrics(): Observable<DashboardMetrics> {
    return this.metrics$.asObservable();
  }

  async loadMetrics(): Promise<void> {
    try {
      this.updateMetrics({ loading: true, error: undefined });

      const [usersResult, boutiquesResult, salesResult, revenueResult] = await Promise.allSettled([
        this.getTotalUsers(),
        this.getTotalActiveBoutiques(),
        this.getTotalSales(),
        this.getTotalRevenue()
      ]);

      const metrics: DashboardMetrics = {
        totalUsers: usersResult.status === 'fulfilled' ? usersResult.value : 0,
        totalActiveBoutiques: boutiquesResult.status === 'fulfilled' ? boutiquesResult.value : 0,
        totalSales: salesResult.status === 'fulfilled' ? salesResult.value : 0,
        totalRevenue: revenueResult.status === 'fulfilled' ? revenueResult.value : 0,
        loading: false
      };

      // Vérifier s'il y a eu des erreurs
      const errors = [usersResult, boutiquesResult, salesResult, revenueResult]
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason);

      if (errors.length > 0) {
        metrics.error = `Erreur lors du chargement de certaines métriques: ${errors.join(', ')}`;
      }

      this.updateMetrics(metrics);
    } catch (error) {
      this.updateMetrics({
        totalUsers: 0,
        totalActiveBoutiques: 0,
        totalSales: 0,
        totalRevenue: 0,
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  private updateMetrics(metrics: Partial<DashboardMetrics>): void {
    const currentMetrics = this.metrics$.value;
    this.metrics$.next({ ...currentMetrics, ...metrics });
  }

  private async getTotalUsers(): Promise<number> {
    try {
      const { count, error } = await this.supabaseService.client
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'utilisateurs:', error);
      throw error;
    }
  }

  private async getTotalActiveBoutiques(): Promise<number> {
    try {
      const { count, error } = await this.supabaseService.client
        .from('boutiques')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de boutiques actives:', error);
      throw error;
    }
  }

  private async getTotalSales(): Promise<number> {
    try {
      // Essayer d'abord avec boutique_overview si elle existe
      const { data: overviewData, error: overviewError } = await this.supabaseService.client
        .from('boutique_overview')
        .select('total_transactions');

      if (!overviewError && overviewData) {
        return overviewData.reduce((sum, item) => sum + (item.total_transactions || 0), 0);
      }

      // Fallback : essayer avec une table transactions si elle existe
      const { count, error } = await this.supabaseService.client
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      if (error) {
        // Si aucune des deux tables n'existe, retourner 0
        console.warn('Aucune table de transactions trouvée, valeur par défaut: 0');
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre total de ventes:', error);
      throw error;
    }
  }

  private async getTotalRevenue(): Promise<number> {
    try {
      // Essayer d'abord avec boutique_overview si elle existe
      const { data: overviewData, error: overviewError } = await this.supabaseService.client
        .from('boutique_overview')
        .select('total_amount');

      if (!overviewError && overviewData) {
        return overviewData.reduce((sum, item) => sum + (item.total_amount || 0), 0);
      }

      // Fallback : essayer avec une table transactions si elle existe
      const { data: transactionsData, error } = await this.supabaseService.client
        .from('transactions')
        .select('amount');

      if (error) {
        // Si aucune des deux tables n'existe, retourner 0
        console.warn('Aucune table de transactions trouvée, valeur par défaut: 0');
        return 0;
      }

      return transactionsData?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0) || 0;
    } catch (error) {
      console.error('Erreur lors de la récupération du chiffre d\'affaires total:', error);
      throw error;
    }
  }

  // Méthode pour forcer le rafraîchissement des métriques
  async refreshMetrics(): Promise<void> {
    await this.loadMetrics();
  }
}