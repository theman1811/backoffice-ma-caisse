import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-login',
  imports: [
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
export class Login {
  email: string = '';
  password: string = '';
  checked: boolean = false;
  supabaseService= inject(SupabaseService)
  toastService= inject(ToastService)
  router= inject(Router)


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
