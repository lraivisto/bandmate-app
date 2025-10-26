import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;

export async function getDatabase() {
    if (Platform.OS === 'web') {
        // SQLite not supported on web, return null
        return null;
    }

    if (!db) {
        db = await SQLite.openDatabaseAsync('bandmate.db');
    }

    // Always ensure tables exist. Using `CREATE TABLE IF NOT EXISTS` is idempotent
    // and protects against cases where module state is preserved across Fast
    // Refresh/hot reload but the native DB file doesn't have the tables yet.
    try {
        // Create gigs table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS gigs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                date TEXT,
                venue TEXT,
                city TEXT
            );
        `);

        // Create merch table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS merch (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL DEFAULT 0,
                stock INTEGER DEFAULT 0
            );
        `);

    } catch (error) {
        console.error('Error initializing tables:', error);
    }

    return db;
}
