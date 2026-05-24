import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';

/**
 * AuthService - Wraps Firebase Authentication
 * Handles user registration, login, logout, and current user state
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = user(this.auth) as Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {}

  /**
   * Register a new user with email and password
   * Creates auth account and saves additional profile data to Firestore
   */
  async register(email: string, password: string, firstName: string, lastName: string, photoUrl: string): Promise<any> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // Save additional profile data to Firestore collection 'users'
      const userRef = doc(this.firestore, 'users', uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        photoUrl,
        email,
        createdAt: new Date().toISOString()
      });

      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }
}
