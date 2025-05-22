import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private localStorageKey = 'favorites';

  constructor() {
    this.initDb();
  }

  async initDb() {
    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
      console.log('Using localStorage for favorites (web)');
      return;
    }

    try {
      this.db = await this.sqlite.createConnection('favorites.db', false, 'no-encryption', 1, false);
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT,
          eventId TEXT
        );
      `);
    } catch (err) {
      console.error('SQLite init error:', err);
    }
  }

  private isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  async addFavorite(userId: string, eventId: string): Promise<void> {
    if (this.isWeb()) {
      const data = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
      if (!data[userId]) data[userId] = [];
      if (!data[userId].includes(eventId)) data[userId].push(eventId);
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      return;
    }

    if (this.db) {
      await this.db.run('INSERT INTO favorites (userId, eventId) VALUES (?, ?)', [userId, eventId]);
    }
  }

  async isFavorite(userId: string, eventId: string): Promise<boolean> {
    if (this.isWeb()) {
      const data = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
      return data[userId]?.includes(eventId) ?? false;
    }

    if (!this.db) return false;
    const result = await this.db.query('SELECT * FROM favorites WHERE userId = ? AND eventId = ?', [userId, eventId]);
    return !!(result.values && result.values.length > 0);
  }

  async removeFavorite(userId: string, eventId: string): Promise<void> {
    if (this.isWeb()) {
      const data = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
      if (data[userId]) {
        data[userId] = data[userId].filter((id: string) => id !== eventId);
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      }
      return;
    }

    if (this.db) {
      await this.db.run('DELETE FROM favorites WHERE userId = ? AND eventId = ?', [userId, eventId]);
    }
  }

  async getFavorites(userId: string): Promise<string[]> {
    if (this.isWeb()) {
      const data = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
      return data[userId] || [];
    }

    if (!this.db) return [];
    const result = await this.db.query('SELECT eventId FROM favorites WHERE userId = ?', [userId]);
    return result.values?.map((row: any) => row.eventId) || [];
  }

  async debugLogFavoritesTable(): Promise<void> {
  if (this.isWeb()) {
    const data = localStorage.getItem(this.localStorageKey);
    console.log('[Web] Favorites in localStorage:', JSON.parse(data || '{}'));
    return;
  }

  if (!this.db) {
    console.warn('No SQLite database connection available.');
    return;
  }

  try {
    const result = await this.db.query('SELECT * FROM favorites');
    console.log('[SQLite] Current contents of favorites table:', result.values);
  } catch (error) {
    console.error('Error reading favorites table:', error);
  }
}

}
