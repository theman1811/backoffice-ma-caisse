import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Boutique, getBoutiquesResponse } from '@/core/models/boutiques.model';
import { SupabaseService } from '@/core/services/supabase.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ToastService } from '@/core/services/toasts.service';
import { ToastModule } from 'primeng/toast';

interface Boutik {
  nom: string;
  proprietaire: string;
  nbVendeurs: number;
  produits: number;
  ventes: string;
  statut: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-boutiques',
  imports: [
    TableModule,
    TagModule,
    ButtonModule,
    ToggleSwitchModule,
    FormsModule,
    ConfirmDialogModule,
    TooltipModule,
    ToastModule
  ],
  templateUrl: './boutiques.html',
  styleUrl: './boutiques.scss'
})
export class Boutiques implements OnInit {
  supabaseService = inject(SupabaseService)
  confirmationService = inject(ConfirmationService)
  toastService= inject(ToastService)
  private router = inject(Router)

  toggleStatut(boutique: Boutik): void {
    boutique.statut = boutique.statut === 'Active' ? 'Inactive' : 'Active';
  }
  storeData: Boutique[] = []



  ngOnInit(): void {
    this.getBoutiques()
  }



  async getBoutiques() {
    try {
      const { data, error } = await this.supabaseService.client
        .from('boutiques')
        .select('*');

      if (error) {
        throw error;
      }

      this.storeData = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        country: item.country || '',
        categorie: item.categorie || '',
        currency: item.currency || null,
        created_by: item.created_by || null,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || null,
        is_active: item.is_active !== undefined ? item.is_active : true
      })) : [];

      console.log('Boutiques récupérées:', data);
    } catch (error) {
      console.error('Erreur lors de la récupération des boutiques:', error);
    }
  }



  async onToggleActive(boutique: Boutique, newValue: boolean) {
    const previous = boutique.is_active;
    boutique.is_active = newValue; // MAJ optimiste pour réactivité UI
    try {
      const { error } = await this.supabaseService.client
        .from('boutiques')
        .update({
          is_active: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', boutique.id);

      if (error) {
        throw error;
      }

      this.toastService.showSuccess('Succès', 'Opération effectuée avec succès!!')
      this.getBoutiques()
    } catch (err) { 
      boutique.is_active = previous; // revert si erreur
      this.toastService.showError('Echec', "Une erreur inconnue est survenue lors de l'opération, veuillez rééssayer plus tard!!")
      console.error('Erreur lors de la mise à jour du statut:', err);
    }
  }



  confirm1(boutique:Boutique, event: boolean) {
    const previousValue = boutique.is_active; // Sauvegarder la valeur précédente
    this.confirmationService.confirm({
        // target: event.target as EventTarget,
        message: 'Êtes vous sûr de Vouloir modifier le statut?',
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
            this.onToggleActive(boutique, event)
        },
        reject: () => {
            boutique.is_active= previousValue
            this.getBoutiques()
        },
    });
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
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return 'N/A';
    }
  }

  showBoutiqueDetails(boutique: Boutique): void {
    if (boutique.id) {
      this.router.navigate(['/gestion/boutiques', boutique.id]);
    }
  }
}
