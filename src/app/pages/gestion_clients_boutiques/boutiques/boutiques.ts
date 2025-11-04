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
    ConfirmDialogModule
  ],
  templateUrl: './boutiques.html',
  styleUrl: './boutiques.scss'
})
export class Boutiques implements OnInit {
  supabaseService = inject(SupabaseService)
  confirmationService = inject(ConfirmationService)

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

      this.getBoutiques()
    } catch (err) {
      boutique.is_active = previous; // revert si erreur
      console.error('Erreur lors de la mise à jour du statut:', err);
    }
  }



  confirm1(boutique:Boutique, event: boolean) {
    console.log('event', event)
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
            return
        },
    });
}
}
