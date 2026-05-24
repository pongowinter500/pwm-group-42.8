import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * FavoritesService - Coordinates between SQLite favorites and Firestore destination data
 * Provides methods to add/remove favorites and check favorite status
 * Syncs favorites with Firestore for personalized, multi-device experience
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  // Subject to trigger favorites list refresh
  private favoritesUpdated$ = new BehaviorSubject<void>(undefined);
  
  // Public subject to notify all listeners when a favorite is toggled
  public favoriteToggled$ = new BehaviorSubject<{id: string, isFavorited: boolean} | null>(null);

  constructor(
    private databaseService: DatabaseService,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  /**
   * Add a destination to favorites (SQLite + Firestore)
   */
  async addFavorite(id: string): Promise<void> {
    const uid = this.authService.getCurrentUserId();
    if (!uid) {
      console.error('User not authenticated');
      return;
    }
    
    try {
      // Add to Firestore (source of truth for user-specific data)
      await this.databaseService.addFavoriteToFirestore(uid, id);
      // Also add to local SQLite for offline support
      await this.databaseService.addFavorite(id);
      this.favoritesUpdated$.next();
      // Notify all listeners that a favorite was added
      this.favoriteToggled$.next({ id, isFavorited: true });
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  /**
   * Remove a destination from favorites (SQLite + Firestore)
   */
  async removeFavorite(id: string): Promise<void> {
    const uid = this.authService.getCurrentUserId();
    if (!uid) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Remove from Firestore
      await this.databaseService.removeFavoriteFromFirestore(uid, id);
      // Also remove from local SQLite
      await this.databaseService.removeFavorite(id);
      this.favoritesUpdated$.next();
      // Notify all listeners that a favorite was removed
      this.favoriteToggled$.next({ id, isFavorited: false });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  /**
   * Check if a destination is favorited (check Firestore first, fallback to SQLite)
   */
  async isFavorite(id: string): Promise<boolean> {
    const uid = this.authService.getCurrentUserId();
    if (!uid) {
      // Fallback to SQLite if not authenticated
      return await this.databaseService.isFavorite(id);
    }

    try {
      // Check Firestore (source of truth)
      return await this.databaseService.isFavoriteInFirestore(uid, id);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  /**
   * Toggle favorite status for a destination
   * Returns true if favorited, false if unfavorited
   */
  async toggleFavorite(id: string): Promise<boolean> {
    const isFav = await this.isFavorite(id);
    if (isFav) {
      await this.removeFavorite(id);
      return false;
    } else {
      await this.addFavorite(id);
      return true;
    }
  }

  /**
   * Get all favorited destinations with full details from Firestore
   * Data is personalized per user
   */
  getFavoritedDestinations(): Observable<any[]> {
    const uid = this.authService.getCurrentUserId();
    if (!uid) {
      return new Observable<any[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.favoritesUpdated$.pipe(
      switchMap(() => 
        from(this.databaseService.getAllFavoritesFromFirestore(uid))
      ),
      switchMap((favoriteIds: string[]) => {
        if (favoriteIds.length === 0) {
          return new Observable<any[]>(observer => {
            observer.next([]);
            observer.complete();
          });
        }
        return this.firestoreService.getAllDestinations().pipe(
          switchMap((destinations: any[]) => {
            const favorited = destinations.filter(d => favoriteIds.includes(d.id));
            return new Observable<any[]>(observer => {
              observer.next(favorited);
              observer.complete();
            });
          })
        );
      })
    );
  }

  /**
   * Get count of favorited destinations from Firestore
   */
  async getFavoritesCount(): Promise<number> {
    const uid = this.authService.getCurrentUserId();
    if (!uid) return 0;
    
    const ids = await this.databaseService.getAllFavoritesFromFirestore(uid);
    return ids.length;
  }

  /**
   * Trigger favorites list refresh
   */
  refreshFavorites(): void {
    this.favoritesUpdated$.next();
  }
}
