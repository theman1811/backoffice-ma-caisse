import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.supabaseService.isLoggedIn().then((isLoggedIn) => {
        if (isLoggedIn) {
          resolve(true);
        } else {
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
          resolve(false);
        }
      }).catch(() => {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
        resolve(false);
      });
    });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }
}