import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '@/core/services/supabase.service';
import { ToastService } from '@/core/services/toasts.service';
import { User, GetUsersResponse } from '@/core/models/user.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

interface Administrateur {
  id: number;
  nom: string;
  email: string;
  role: string;
  statut: string;
  derniereConnexion: string;
  creeLe: string;
}

@Component({
  selector: 'app-administrateurs',
  imports: [
    TableModule, 
    ButtonModule, 
    TagModule, 
    CommonModule, 
    DialogModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    SelectModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './administrateurs.html',
  styleUrl: './administrateurs.scss'
})
export class Administrateurs implements OnInit {
  
  supabaseService= inject(SupabaseService)
  toastService= inject(ToastService)
  private fb = inject(FormBuilder)
  tabAdministrators: User[]= []
  
  // Dialog et formulaire
  displayDialog: boolean = false;
  dialogMode: 'add' | 'edit' = 'add';
  administrateurForm!: FormGroup;
  roles = [
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'User', value: 'user' }
  ];
  confirmationService= inject(ConfirmationService)
  selectedAdministrateur: User | null= null

  constructor(){
    this.administrateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenoms: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s\-()]+$/)]],
      role: ['', Validators.required]
    });
  }

  // Méthode utilitaire pour faciliter l'accès aux champs du formulaire
  get f() {
    return this.administrateurForm.controls;
  }

  ngOnInit(): void {
    this.getAdministrators()
  }

  getRoleSeverity(role: string): string {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'user':
        return 'info';
      default:
        return 'secondary';
    }
  }

  openDialog(): void {
    this.dialogMode = 'add';
    
    this.administrateurForm.reset();
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.selectedAdministrateur = null;
    this.administrateurForm.reset();
  }

  // async saveAdministrateur(): Promise<void> {
  //   try {
      
  //     const formValue = this.administrateurForm.value;
  
  //     // Générer un mot de passe temporaire (vous pourriez aussi envoyer un email de bienvenue)
  //     const temporaryPassword = this.generateTemporaryPassword();
  
  //     // 1. Créer l'utilisateur dans Supabase Auth
  //     const { data: authData, error: authError } = await this.supabaseService.signUp(
  //       formValue.email,
  //       temporaryPassword
  //     );
  
  //     if (authError) {
  //       this.toastService.showError('Erreur', authError.message || 'Erreur lors de la création du compte');
  //       return;
  //     }
  
  //     // 2. Insérer l'utilisateur dans la table Users
  //     const userData = {
  //       auth_id: authData.user?.id || '',
  //       first_name: formValue.prenoms,
  //       last_name: formValue.nom,
  //       email: formValue.email,
  //       phone_number: formValue.contact,
  //       role: formValue.role,
  //       statut: true,
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString()
  //     };
  
  //     await this.supabaseService.insertData('users', userData);
  
  //     // 3. Afficher un message de succès
  //     this.toastService.showSuccess(
  //       'Succès', 
  //       `Administrateur "${formValue.prenoms} ${formValue.nom}" créé avec succès`
  //     );
  
  //     // 4. Fermer le dialog et rafraîchir la liste
  //     this.closeDialog();
  //     await this.getAdministrators();
  
  //   } catch (error: any) {
  //     this.toastService.showError('Erreur', error.message || 'Erreur lors de la création de l\'administrateur');
  //     console.error('Erreur lors de la création de l\'administrateur:', error);
  //   }
  // }



  async saveAdministrateur(): Promise<void> {
    try {
      
      const formValue = this.administrateurForm.value;
      console.log('mode',this.dialogMode)
      console.log('user to edit', this.selectedAdministrateur)
  
      if (this.dialogMode === 'edit' && this.selectedAdministrateur) {
        // MODE ÉDITION - Mettre à jour un administrateur existant
        console.log("mode editing")
        const userData: any = {
          first_name: formValue.prenoms,
          last_name: formValue.nom,
          email: formValue.email,
          phone_number: formValue.contact,
          role: formValue.role,
          updated_at: new Date().toISOString()
        };

        // Mettre à jour dans la table Users
        await this.supabaseService.updateData(
          'users', 
          userData, 
          this.selectedAdministrateur.id.toString()
        );
        // Si l'email a changé, mettre à jour dans Supabase Auth
        if (formValue.email !== this.selectedAdministrateur.email && this.selectedAdministrateur.auth_id) {
          const { error: authError } = await this.supabaseService.client.auth.admin.updateUserById(
            this.selectedAdministrateur.auth_id,
            { email: formValue.email }
          );

          if (authError) {
            console.warn('Erreur lors de la mise à jour de l\'email dans Auth:', authError);
            // Ne pas bloquer si l'update Auth échoue, on continue quand même
          }
        }

        // Afficher un message de succès
        this.toastService.showSuccess(
          'Succès', 
          `Administrateur "${formValue.prenoms} ${formValue.nom}" modifié avec succès`
        );

        // Fermer le dialog et rafraîchir la liste
        this.closeDialog();
        await this.getAdministrators();

      } else {
        // MODE AJOUT - Créer un nouvel administrateur
        // Générer un mot de passe temporaire (vous pourriez aussi envoyer un email de bienvenue)
        const temporaryPassword = this.generateTemporaryPassword();
    
        // 1. Créer l'utilisateur dans Supabase Auth
        const { data: authData, error: authError } = await this.supabaseService.signUp(
          formValue.email,
          temporaryPassword
        );
    
        if (authError) {
          this.toastService.showError('Erreur', authError.message || 'Erreur lors de la création du compte');
          return;
        }
    
        // 2. Insérer l'utilisateur dans la table Users
        const userData = {
          auth_id: authData.user?.id || '',
          first_name: formValue.prenoms,
          last_name: formValue.nom,
          email: formValue.email,
          phone_number: formValue.contact,
          role: formValue.role,
          statut: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await this.supabaseService.insertData('users', userData);
    
        // 3. Afficher un message de succès
        this.toastService.showSuccess(
          'Succès', 
          `Administrateur "${formValue.prenoms} ${formValue.nom}" créé avec succès`
        );
    
        // 4. Fermer le dialog et rafraîchir la liste
        this.closeDialog();
        await this.getAdministrators();
      }
  
    } catch (error: any) {
      const action = this.dialogMode === 'edit' ? 'la modification' : 'la création';
      this.toastService.showError('Erreur', error.message || `Erreur lors de ${action} de l'administrateur`);
      console.error(`Erreur lors de ${action} de l'administrateur:`, error);
    }
  }
  
  /**
   * Génère un mot de passe temporaire aléatoire
   * Note: Dans un vrai projet, vous devriez envoyer un email de bienvenue avec ce mot de passe
   */
  private generateTemporaryPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  editAdministrateur(administrateur: any): void {
    this.dialogMode = 'edit';
    this.selectedAdministrateur = administrateur;
    this.administrateurForm.patchValue({
      nom: administrateur.last_name || '',
      prenoms: administrateur.first_name || '',
      email: administrateur.email || '',
      contact: administrateur.phone_number || '',
      role: administrateur.role || ''
    });
    this.displayDialog = true;
  }

  deleteAdministrateur(administrateur: Administrateur): void {
    console.log('Suppression de l\'administrateur:', administrateur);
    // TODO: Implémenter la logique de suppression
  }

  async getAdministrators() {
    try {
      // Récupérer tous les utilisateurs de la table Users
      const { data, error } = await this.supabaseService.client
        .from('users')
        .select('*')
        .eq('role', 'super_admin');
      
      if (error) {
        throw error;
      }
      
      // // Copier dans tabAdministrators si nécessaire
      this.tabAdministrators = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id,
        auth_id: item.auth_id || '',
        role: item.role || 'user',
        first_name: item.first_name || '',
        last_name: item.last_name || '',
        phone_number: item.phone_number || null,
        email: item.email || '',
        profile_photo: item.profile_photo || null,
        statut: item.statut !== undefined ? item.statut : true,
        updated_at: item.updated_at || new Date().toISOString(),
        created_at: item.created_at || new Date().toISOString()
      })) : [];
      
      console.log('Administrateurs récupérés:', data);
    } catch (error) {
      this.toastService.showError('Echec', 'Erreur lors de la récupération des administrateurs')
      console.error('Erreur lors de la récupération des administrateurs:', error);
      // Optionnel: afficher un message d'erreur à l'utilisateur
    }
  }


  onConfirmAction(event: Event) {
    const action = this.dialogMode === 'add' ? 'créer' : 'modifier';
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: `Vous êtes sur le point de ${action} un administrateur, voulez vous continuer ?`,
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
            label: 'Valider',
        },
        accept: () => {
            console.log('super')
            if (this.administrateurForm.valid) {
              this.saveAdministrateur()
            } else {
              this.toastService.showError('Erreur', 'Veuillez remplir tous les champs requis');
              this.administrateurForm.markAllAsTouched();
              return
            }
        },
        reject: () => {
            return
        },
    });
}
  
}
