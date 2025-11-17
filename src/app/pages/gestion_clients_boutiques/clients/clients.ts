import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '@/core/services/supabase.service';
import { BoutiqueDetail, Client, GetClientsResponse } from '@/core/models/clients.model';
import { ToastService } from '@/core/services/toasts.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  boutique: string;
  statut: 'Actif' | 'Inactif';
  dateInscription: string;
}

@Component({
  selector: 'app-clients',
  imports: [
    TableModule, 
    ButtonModule, 
    TagModule, 
    CommonModule, 
    ConfirmDialogModule, 
    ToggleSwitchModule,
    FormsModule,
    TooltipModule,
    ToastModule
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class Clients implements OnInit {
  supabaseService= inject(SupabaseService)
  toastService= inject(ToastService)
  confirmationService= inject(ConfirmationService)
  private router = inject(Router)
  clientsData: Client[]= []




  ngOnInit(): void {
    this.getClients()
  }

  toggleStatut(utilisateur: Utilisateur): void {
    utilisateur.statut = utilisateur.statut === 'Actif' ? 'Inactif' : 'Actif';
  }


  async getClients() {
    try {
      const { data, error } = await this.supabaseService.client
        .from('client_boutique_overview')
        .select('*');

      if (error) {
        throw error;
      }

      this.clientsData= data as GetClientsResponse
      console.log('Clients récupérés:', data);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      this.toastService.showError('Echec', 'Une erreur inconnue est survenue lors de la récupération des clients')
    }
  }

  async editStatutClient(client: Client, newValue: boolean) {
    const previousValue = client.is_active;
    
    // Mise à jour optimiste pour réactivité UI
    client.is_active = newValue;
    
    try {
      const { error } = await this.supabaseService.client
        .from('users')
        .update({
          statut: newValue
        })
        .eq('id', client.user_id);

      if (error) {
        throw error;
      }

      // Rafraîchir la vue materialisée
      const { error: refreshError } = await this.supabaseService.client
        .rpc('refresh_specific_view', {
          p_view_name: 'client_boutique_overview'
        });

      if (refreshError) {
        console.error('Erreur lors du rafraîchissement de la vue:', refreshError);
      }

      // Recharger les données pour s'assurer de la cohérence
      await this.getClients();
      this.toastService.showSuccess('Succès', `Le client a été ${newValue ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      // Revert en cas d'erreur
      client.is_active = previousValue;
      console.error('Erreur lors de la mise à jour du statut:', error);
      this.toastService.showError('Echec', 'Une erreur est survenue lors de la modification du statut du client');
    }
  }


  confirmEditStatu(client: Client, newValue: boolean) {
    const previousValue = client.is_active;
    
    // Mettre à jour temporairement pour l'affichage du toggle
    client.is_active = newValue;
    
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir ${newValue ? 'activer' : 'désactiver'} ce client ?`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmer',
      },
      accept: () => {
        this.editStatutClient(client, newValue);
      },
      reject: () => {
        // Remettre le toggle à l'état précédent si l'utilisateur annule
        client.is_active = previousValue;
        this.getClients()
      },
    });
  }

  viewClientDetails(client: Client): void {
    if (client.user_id) {
      this.router.navigate(['/gestion/clients', client.user_id]);
    }
  }

}
