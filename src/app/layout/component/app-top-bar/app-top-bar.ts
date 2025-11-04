import { Component, inject, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/layout/service/layout.service';
import { AppConfigurator } from '../app.configurator';
import { SupabaseService } from '@/core/services/supabase.service';
import { SessionService } from '@/core/services/session.service';
import { Menu } from 'primeng/menu';
import { ToastService } from '@/core/services/toasts.service';


@Component({
  selector: 'app-app-top-bar',
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, Menu],
  templateUrl: './app-top-bar.html',
  styleUrl: './app-top-bar.scss'
})
export class AppTopBar {
  @ViewChild('profileMenu') profileMenu!: Menu;
  profileMenuItems: MenuItem[] = [];
  toastService= inject(ToastService)

    constructor(
      public layoutService: LayoutService,
      private supabaseService: SupabaseService,
      private sessionService: SessionService,
      private router: Router
    ) {
      this.profileMenuItems = [
        {
          label: 'Se déconnecter',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }


    async logout() {
      try {
        await this.supabaseService.signOut();
        this.sessionService.deleteSessionUser().subscribe(() => {
          this.router.navigate(['/auth/login']);
        });
      } catch (error: any) {
        console.error('Erreur lors de la déconnexion:', error);
        this.toastService.showError('Echec', error || 'Erreur inconnue lors de la deconnexion, veuillez reessayer plus tard!!')
        // Rediriger quand même vers la page de connexion
        this.sessionService.deleteSessionUser().subscribe(() => {
          this.router.navigate(['/auth/login']);
        });
      }
    }
}
