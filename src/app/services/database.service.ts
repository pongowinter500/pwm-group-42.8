import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Firestore, collection, doc, setDoc, deleteDoc, getDoc, getDocs } from '@angular/fire/firestore';

/**
 * DatabaseService - SQLite database wrapper for local favorites persistence
 * Initializes database and manages favorite items storage
 * Syncs favorites with Firestore for multi-device support and personalized experience
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: SQLiteDBConnection | null = null;
  private sqliteConnection = new SQLiteConnection(CapacitorSQLite);

  // 1. COSTUTTORE UNICO CORRETTO
  constructor(private firestore: Firestore) {
    this.initializeDatabase();
  }

  /**
   * Initialize SQLite database on app start
   * Creates favorites table if it doesn't exist
   */
  async initializeDatabase(): Promise<void> {
    try {
      const dbName = 'favoritesdb';
      
      if (Capacitor.getPlatform() === 'web') {
        // Use web version of SQLite
        this.db = await this.sqliteConnection.createConnection(
          dbName,
          false,
          'no-encryption',
          1,
          false
        );
      } else {
        // Native platform
        this.db = await this.sqliteConnection.createConnection(
          dbName,
          false,
          'no-encryption',
          1,
          false
        );
      }

      await this.db.open();

      // Create favorites table if it doesn't exist
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS favorites (
          id TEXT PRIMARY KEY
        )
      `;
      await this.db.execute(createTableSQL);
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  /**
   * Add a destination ID to favorites
   */
  async addFavorite(id: string): Promise<void> {
    try {
      if (!this.db) await this.initializeDatabase();
      const sql = `INSERT OR IGNORE INTO favorites (id) VALUES (?)`;
      await this.db?.run(sql, [id]);
      console.log('Favorite added:', id);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  /**
   * Remove a destination ID from favorites
   */
  async removeFavorite(id: string): Promise<void> {
    try {
      if (!this.db) await this.initializeDatabase();
      const sql = `DELETE FROM favorites WHERE id = ?`;
      await this.db?.run(sql, [id]);
      console.log('Favorite removed:', id);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  /**
   * Check if a destination ID is in favorites
   */
  async isFavorite(id: string): Promise<boolean> {
    try {
      if (!this.db) await this.initializeDatabase();
      const sql = `SELECT id FROM favorites WHERE id = ?`;
      const result = await this.db?.query(sql, [id]);
      return (result?.values?.length ?? 0) > 0;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  /**
   * Get all favorite destination IDs
   */
  async getAllFavoriteIds(): Promise<string[]> {
    try {
      if (!this.db) await this.initializeDatabase();
      const sql = `SELECT id FROM favorites`;
      const result = await this.db?.query(sql);
      return (result?.values ?? []).map((row: any) => row.id);
    } catch (error) {
      console.error('Error getting favorite IDs:', error);
      return [];
    }
  }

  /**
   * Add a favorite to Firestore (for user personalization and sync)
   */
  async addFavoriteToFirestore(uid: string, destinationId: string): Promise<void> {
    try {
      const favRef = doc(this.firestore, 'users', uid, 'favorites', destinationId);
      await setDoc(favRef, { 
        destinationId,
        addedAt: new Date().toISOString()
      });
      console.log('Favorite added to Firestore:', destinationId);
    } catch (error) {
      console.error('Error adding favorite to Firestore:', error);
    }
  }

  /**
   * Remove a favorite from Firestore
   */
  async removeFavoriteFromFirestore(uid: string, destinationId: string): Promise<void> {
    try {
      const favRef = doc(this.firestore, 'users', uid, 'favorites', destinationId);
      await deleteDoc(favRef);
      console.log('Favorite removed from Firestore:', destinationId);
    } catch (error) {
      console.error('Error removing favorite from Firestore:', error);
    }
  }

  /**
   * Check if a destination is favorited in Firestore
   */
  async isFavoriteInFirestore(uid: string, destinationId: string): Promise<boolean> {
    try {
      const favRef = doc(this.firestore, 'users', uid, 'favorites', destinationId);
      const docSnap = await getDoc(favRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking favorite in Firestore:', error);
      return false;
    }
  }

  /**
   * Sync favorites from Firestore to local SQLite (for offline support)
   */
  async syncFavoritesFromFirestore(uid: string): Promise<void> {
    try {
      const favoritesRef = collection(this.firestore, 'users', uid, 'favorites');
      const querySnapshot = await getDocs(favoritesRef);
      
      // Clear local favorites
      if (this.db) {
        await this.db?.execute('DELETE FROM favorites');
      }
      
      // Add all Firestore favorites to local database
      for (const favDoc of querySnapshot.docs) {
        // 2. CORRETTA LA NOTAZIONE QUI
        await this.addFavorite(favDoc.data()['destinationId']);
      }
      
      console.log('Favorites synced from Firestore');
    } catch (error) {
      console.error('Error syncing favorites from Firestore:', error);
    }
  }

  /**
   * Get all favorite IDs from Firestore for a user
   */
  async getAllFavoritesFromFirestore(uid: string): Promise<string[]> {
    try {
      const favoritesRef = collection(this.firestore, 'users', uid, 'favorites');
      const querySnapshot = await getDocs(favoritesRef);
      // 2. CORRETTA LA NOTAZIONE QUI
      return querySnapshot.docs.map(doc => doc.data()['destinationId']);
    } catch (error) {
      console.error('Error getting favorites from Firestore:', error);
      return [];
    }
  }
}