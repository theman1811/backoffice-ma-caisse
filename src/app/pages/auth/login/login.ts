import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { SupabaseService } from '@/core/services/supabase.service';
import { ToastService } from '@/core/services/toasts.service';
import { Toast } from "primeng/toast";
import { LayoutService } from '@/layout/service/layout.service';
import { $t } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    AppFloatingConfigurator,
    Toast
],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  email: string = '';
  password: string = '';
  supabaseService= inject(SupabaseService)
  toastService= inject(ToastService)
  router= inject(Router)
  layoutService = inject(LayoutService)
  platformId = inject(PLATFORM_ID)

  ngOnInit() {
    // Initialiser le thème au démarrage si on est dans le navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }
  }

  private initializeTheme() {
    const config = this.layoutService.layoutConfig();
    const preset = Lara;
    const presetPalette = preset.primitive;
    const colorName = config.primary || 'sky';
    const colorPalette = presetPalette?.[colorName as keyof typeof presetPalette];
    
    if (colorPalette) {
      const themeConfig = {
        semantic: {
          primary: colorPalette,
          colorScheme: {
            light: {
              primary: {
                color: '{primary.500}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.600}',
                activeColor: '{primary.700}'
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.100}',
                color: '{primary.700}',
                focusColor: '{primary.800}'
              }
            },
            dark: {
              primary: {
                color: '{primary.400}',
                contrastColor: '{surface.900}',
                hoverColor: '{primary.300}',
                activeColor: '{primary.200}'
              },
              highlight: {
                background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)'
              }
            }
          }
        }
      };
      
      $t().preset(preset).preset(themeConfig).surfacePalette(null).use({ useDefaultOptions: true });
    }
  }

  async login() : Promise<void> {
    try {
      const { data, error } = await this.supabaseService.signIn(this.email, this.password);
      if (error) {
        this.toastService.showError('Erreur de connexion', error.message);
      } else {
        this.toastService.showSuccess('Connexion réussie', 'Vous êtes connecté avec succès.');
        this.router.navigate(['/dashboard'])
      }
    } catch (e: any) {
      this.toastService.showError('Erreur inattendue', e?.message || 'Une erreur est survenue.');
    }
  }

  onConfirmLogin(){
    if(!this.email || !this.password){
      this.toastService.showWarning('Attention', 'Veuillez renseigner votre mail et votre mot de passe!')
      return
    }

    this.login()
  }

}
