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
    try {
      // Retrieve the userToken from localStorage
      const userToken = localStorage.getItem('userToken');

      // Check if the token exists and is valid
      if (userToken && this.isValidJSON(userToken)) {
        return true; // Allow access
      } else {
        // Redirect to the landing page with an optional return URL
        this.router.navigate(['/'], {
          queryParams: { returnUrl: state.url }
        });
        return false; // Block access
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      this.router.navigate(['/']); // Redirect on unexpected errors
      return false;
    }
  }

  /**
   * Validates if a string is a valid JSON.
   * @param str - The string to validate
   * @returns true if the string is valid JSON, false otherwise
   */
  private isValidJSON(str: string | null): boolean {
    if (!str) return false;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }
}
