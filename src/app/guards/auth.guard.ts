import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('Auth guard triggered for URL:', state.url);
    try {
      if (state.url === '/landing' || state.url === '/') {
        return true; // Allow access to landing page and root path
      }
      const userToken = localStorage.getItem('userToken');

      if (userToken && this.isValidJSON(userToken)) {
        return true;
      }

      // Redirect to sign-in instead of root path
      this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    } catch (error) {
      console.error('Error checking authentication:', error);
      this.router.navigate(['/sign-in']);
      return false;
    }
  }

  private isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
}
