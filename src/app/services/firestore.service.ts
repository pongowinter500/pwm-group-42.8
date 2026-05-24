import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query, where, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * FirestoreService - Generic Firestore data access service
 * Handles loading screen text, app config, destinations, and user profiles
 */
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  /**
   * Get UI text for a specific screen from 'screens' collection
   */
  getScreenText(screenId: string): Observable<any> {
    return from(
      getDoc(doc(this.firestore, 'screens', screenId))
    ).pipe(
      map(docSnapshot => docSnapshot.exists() ? docSnapshot.data() : {})
    );
  }

  /**
   * Get app configuration from 'siteConfig' collection
   */
  getAppInfo(): Observable<any> {
    return from(
      getDoc(doc(this.firestore, 'siteConfig', 'appInfo'))
    ).pipe(
      map(docSnapshot => docSnapshot.exists() ? docSnapshot.data() : {})
    );
  }

  /**
   * Get all destinations from 'destinations' collection
   */
  getAllDestinations(): Observable<any[]> {
    return from(
      getDocs(collection(this.firestore, 'destinations'))
    ).pipe(
      map(querySnapshot => {
        const destinations: any[] = [];
        querySnapshot.forEach(doc => {
          destinations.push({ id: doc.id, ...doc.data() });
        });
        return destinations.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      })
    );
  }

  /**
   * Get a specific destination by ID
   */
  getDestinationById(id: string): Observable<any> {
    return from(
      getDoc(doc(this.firestore, 'destinations', id))
    ).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        }
        return null;
      })
    );
  }

  /**
   * Get featured destinations (where featured === true)
   */
  getFeaturedDestinations(): Observable<any[]> {
    return this.getAllDestinations().pipe(
      map(destinations => destinations.filter(d => d.featured === true))
    );
  }

  /**
   * Save or update user profile in 'users' collection
   */
  async saveUserProfile(uid: string, data: any): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await setDoc(userRef, data, { merge: true });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile data from 'users' collection
   */
  getUserProfile(uid: string): Observable<any> {
    return from(
      getDoc(doc(this.firestore, 'users', uid))
    ).pipe(
      map(docSnapshot => docSnapshot.exists() ? docSnapshot.data() : {})
    );
  }
}
