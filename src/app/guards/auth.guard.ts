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

      console.log('AuthGuard: userToken:', userToken);
      console.log('AuthGuard: isValidJSON:', this.isValidJSON(userToken));
      console.log('AuthGuard: isTokenExpired:', this.isTokenExpired(userToken));

      if (!userToken || this.isTokenExpired(userToken)) {
        localStorage.removeItem('userToken');
      }

      if (userToken && !this.isTokenExpired(userToken)) {
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

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      return payload.exp && Date.now() >= payload.exp * 1000;
    } catch (e) {
      console.error('Token parsing error, treating as expired:', e);
      return true;
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
