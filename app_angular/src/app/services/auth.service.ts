import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * AuthService
 * Manages user authentication state and logic
 * Currently uses localStorage (should be replaced with proper backend authentication)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<string | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  /**
   * Check if user is authenticated (from localStorage)
   * In production, verify with backend
   */
  private checkAuthStatus(): void {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Login user with email and password
   * TODO: Replace with actual backend API call
   */
  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Simulated authentication - replace with backend call
      setTimeout(() => {
        // For demo purposes, accept any valid email/password
        if (email && password && password.length >= 6) {
          localStorage.setItem('authToken', 'demo-token-' + Date.now());
          localStorage.setItem('currentUser', email);
          
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(email);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Get current authentication state
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user
   */
  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }
}
