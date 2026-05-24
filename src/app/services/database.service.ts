import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Firestore, collection, doc, setDoc, deleteDoc, getDoc, getDocs } from '@angular/fire/firestore';

/**
 * DatabaseService - Local SQLite database wrapper for offline favorites persistence.
 * Syncs with Firestore for multi-device personalization and cross-platform state management.
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: SQLiteDBConnection | null = null;
  private sqliteConnection = new SQLiteConnection(CapacitorSQLite);

  constructor(private firestore: Firestore) {
    this.initializeDatabase();
  }

  /**
   * Initialize SQLite database on app start.
   * Creates favorites table if not exists.
   */
  async initializeDatabase(): Promise<void> {
    try {
      const dbName = 'favoritesdb';
      
      if (Capacitor.getPlatform() === 'web') {
        this.db = await this.sqliteConnection.createConnection(
          dbName,
          false,
          'no-encryption',
          1,
          false
        );
      } else {
        this.db = await this.sqliteConnection.createConnection(
          dbName,
          false,
          'no-encryption',
          1,
          false
        );
      }

      await this.db.open();

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS favorites (
          id TEXT PRIMARY KEY
        )
      `;
      await this.db.execute(createTableSQL);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  /**
   * Add destination to local favorites.
   */
  async addFavorite(id: string): Promise<void> {
    try {
      if (!this.db) await this.initializeDatabase();
      const sql = `INSERT OR IGNORE INTO favorites (id) VALUES (?)`;
      await this.db?.run(sql, [id]);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  /**
   * Remove destination from local favorites.
   */
  async removeFavorite(id: string): Promise<void> {
    try {
      if (!this.db) await this.initializeDatabase();
      const sql = `DELETE FROM favorites WHERE id = ?`;
      await this.db?.run(sql, [id]);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  /**
   * Check if destination is in local favorites.
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
   * Get all local favorite destination IDs.
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
   * Add favorite to Firestore for user-specific persistence and sync.
   */
  async addFavoriteToFirestore(uid: string, destinationId: string): Promise<void> {
    try {
      const favRef = doc(this.firestore, 'users', uid, 'favorites', destinationId);
      await setDoc(favRef, { 
        destinationId,
        addedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding favorite to Firestore:', error);
    }
  }

  /**
   * Remove favorite from Firestore.
   */
  async removeFavoriteFromFirestore(uid: string, destinationId: string): Promise<void> {
    try {
      const favRef = doc(this.firestore, 'users', uid, 'favorites', destinationId);
      await deleteDoc(favRef);
    } catch (error) {
      console.error('Error removing favorite from Firestore:', error);
    }
  }

  /**
   * Check if destination exists in Firestore favorites.
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
   * Sync all Firestore favorites to local SQLite for offline support.
   */
  async syncFavoritesFromFirestore(uid: string): Promise<void> {
    try {
      const favoritesRef = collection(this.firestore, 'users', uid, 'favorites');
      const querySnapshot = await getDocs(favoritesRef);
      
      if (this.db) {
        await this.db?.execute('DELETE FROM favorites');
      }
      
      for (const favDoc of querySnapshot.docs) {
        await this.addFavorite(favDoc.data()['destinationId']);
      }
    } catch (error) {
      console.error('Error syncing favorites from Firestore:', error);
    }
  }

  /**
   * Retrieve all favorite destination IDs from Firestore for user.
   */
  async getAllFavoritesFromFirestore(uid: string): Promise<string[]> {
    try {
      const favoritesRef = collection(this.firestore, 'users', uid, 'favorites');
      const querySnapshot = await getDocs(favoritesRef);
      return querySnapshot.docs.map(doc => doc.data()['destinationId']);
    } catch (error) {
      console.error('Error getting favorites from Firestore:', error);
      return [];
    }
  }
}