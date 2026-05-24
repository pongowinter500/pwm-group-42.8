import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

/**
 * AuthGuard - Protects routes that require authentication
 * Checks Firebase auth state and redirects to login if user is not authenticated
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Get current user from Firebase Auth
    return user(this.auth).pipe(
      take(1),
      map(authUser => {
        if (authUser) {
          // User is authenticated, allow navigation
          return true;
        } else {
          // User is not authenticated, redirect to login
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
