import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Client, BoutiqueDetail } from '@/core/models/clients.model';
import { SupabaseService } from '@/core/services/supabase.service';
import { ToastService } from '@/core/services/toasts.service';

@Component({
  selector: 'app-client-details',
  imports: [CommonModule, ButtonModule, TagModule, CardModule, TableModule],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss'
})
export class ClientDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  supabaseService = inject(SupabaseService);
  toastService = inject(ToastService);

  client: Client | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.getClientDetails(Number(clientId));
    } else {
      this.error = 'ID du client manquant';
      this.loading = false;
    }
  }

  async getClientDetails(clientId: number): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('client_boutique_overview')
        .select('*')
        .eq('user_id', clientId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        this.client = data as Client;
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération des détails:', error);
      this.error = error.message || 'Erreur lors de la récupération des détails du client';
      this.toastService.showError('Echec', 'Erreur lors de la récupération des détails du client');
    } finally {
      this.loading = false;
    }
  }

  formatDate(date: string | null | undefined): string {
    if (!date) {
      return 'N/A';
    }
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'N/A';
      }
      
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      return 'N/A';
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/clients']);
  }
}

