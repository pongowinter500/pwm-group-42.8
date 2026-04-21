import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface User {
  email: string;
  password: string;
  role: string;
}

/**
 * AuthService
 * Manages user authentication state and logic
 * Loads users from /assets/data/users.json
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  private usersSubject = new BehaviorSubject<User[]>([]);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
    this.checkAuthStatus();
  }

  /**
   * Load users from JSON file
   */
  private loadUsers(): void {
    this.http.get<{ users: User[] }>('/data/users.json')
      .pipe(
        tap(data => {
          this.usersSubject.next(data.users);
        }),
        catchError(error => {
          console.error('Error loading users:', error);
          return of({ users: [] });
        })
      )
      .subscribe();
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
   * Validates against users loaded from /assets/data/users.json
   */
  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Wait a moment to allow users to load if needed
      setTimeout(() => {
        const users = this.usersSubject.value;
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          localStorage.setItem('authToken', 'token-' + Date.now());
          localStorage.setItem('currentUser', user.email);
          localStorage.setItem('userRole', user.role);
          
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user.email);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 500);
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
