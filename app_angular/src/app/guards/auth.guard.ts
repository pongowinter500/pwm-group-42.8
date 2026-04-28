import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

/**
 * AuthGuard
 * Protects routes that require authentication
 * Redirects unauthenticated users to login page
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          // Redirect to login with return URL
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }
}

/**
 * canActivateAuth - Functional version of AuthGuard
 * Can be used directly in route definitions
 * Example: { path: 'admin', component: AdminComponent, canActivate: [canActivateAuth] }
 */
export const canActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};

/**
 * canActivateRole - Protects routes based on user role
 * Example: { path: 'admin', component: AdminComponent, canActivate: [canActivateRole], data: { requiredRole: 'admin' } }
 */
export const canActivateRole: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['requiredRole'];

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      const userRole = authService.getUserRole();
      if (userRole === requiredRole) {
        return true;
      } else {
        // User is authenticated but doesn't have the required role
        router.navigate(['/']);
        return false;
      }
    })
  );
};
