import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { BoutiqueOverview } from '@/core/models/boutiques.model';
import { SupabaseService } from '@/core/services/supabase.service';

@Component({
  selector: 'app-boutique-details',
  imports: [CommonModule, ButtonModule, TagModule, CardModule, TableModule],
  templateUrl: './boutique-details.html',
  styleUrl: './boutique-details.scss'
})
export class BoutiqueDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  supabaseService = inject(SupabaseService);

  boutiqueOverview: BoutiqueOverview | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const boutiqueId = this.route.snapshot.paramMap.get('id');
    if (boutiqueId) {
      this.getBoutiqueOverview(Number(boutiqueId));
    } else {
      this.error = 'ID de boutique manquant';
      this.loading = false;
    }
  }

  async getBoutiqueOverview(boutiqueId: number): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('boutique_overview')
        .select('*')
        .eq('boutique_id', boutiqueId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Gérer le cas où users pourrait être une chaîne JSON ou déjà un tableau
        let usersArray = [];
        if (data.users) {
          if (typeof data.users === 'string') {
            try {
              usersArray = JSON.parse(data.users);
            } catch (e) {
              console.error('Erreur lors du parsing JSON des users:', e);
              usersArray = [];
            }
          } else if (Array.isArray(data.users)) {
            usersArray = data.users;
          }
        }

        this.boutiqueOverview = {
          boutique_id: data.boutique_id,
          boutique_name: data.boutique_name || '',
          total_transactions: data.total_transactions || 0,
          total_amount: data.total_amount || 0,
          total_users: data.total_users || 0,
          users: usersArray
        };
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération des détails:', error);
      this.error = error.message || 'Erreur lors de la récupération des détails de la boutique';
    } finally {
      this.loading = false;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  goBack(): void {
    this.router.navigate(['/gestion/boutiques']);
  }
}
