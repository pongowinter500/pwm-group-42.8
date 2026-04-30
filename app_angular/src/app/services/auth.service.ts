import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';

export interface UserProfile {
  email: string;
  role: string;
  uid?: string;
}

/**
 * AuthService
 * Manages user authentication via Firebase Authentication
 * Syncs user profile with Firestore 'users' collection
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  private userUidSubject = new BehaviorSubject<string | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  public userRole$ = this.userRoleSubject.asObservable();
  public userProfile$ = this.userProfileSubject.asObservable();
  public userUid$ = this.userUidSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  /**
   * Monitor Firebase Auth state changes
   */
  private checkAuthStatus(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(user.email);
        this.userUidSubject.next(user.uid);
        
        // Fetch user profile from Firestore
        const userProfile = await this.getUserProfileFromFirestore(user.email!);
        if (userProfile) {
          this.userProfileSubject.next(userProfile);
          this.userRoleSubject.next(userProfile.role);
        }
      } else {
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
        this.userRoleSubject.next(null);
        this.userProfileSubject.next(null);
        this.userUidSubject.next(null);
      }
    });
  }

  /**
   * Fetch user profile from Firestore users collection by email
   */
  private async getUserProfileFromFirestore(email: string): Promise<UserProfile | null> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          email: userDoc.data()['email'],
          role: userDoc.data()['role'],
          uid: userDoc.id
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Login user with email and password
   * Authenticates with Firebase Authentication
   */
  login(email: string, password: string): Observable<boolean> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  /**
   * Register new user with email and password
   * Creates auth user and Firestore user document with 'student' role
   */
  register(email: string, password: string): Observable<boolean> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async (result) => {
        const userRef = doc(this.firestore, 'users', result.user.uid);
        await setDoc(userRef, {
          email: email,
          role: 'student',
          createdAt: new Date()
        });
        return true;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of(false);
      })
    );
  }

  /**
   * Logout user
   * Signs out from Firebase Authentication
   */
  logout(): Observable<boolean> {
    return from(signOut(this.auth)).pipe(
      map(() => true),
      catchError(error => {
        console.error('Logout error:', error);
        return of(false);
      })
    );
  }

  /**
   * Get current authentication state
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user email
   */
  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user role
   */
  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  /**
   * Get current user profile
   */
  getUserProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  /**
   * Get current user UID
   */
  getUserUid(): string | null {
    return this.userUidSubject.value;
  }

  /**
   * Get Firebase Auth user directly
   */
  getAuthUser() {
    return this.auth.currentUser;
  }
}
