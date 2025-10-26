import { getDatabase } from './index';
import { Platform } from 'react-native';

export async function listGigs() {
    if (Platform.OS === 'web') {
        return []; // Return empty array on web
    }

    try {
        const db = await getDatabase();
        if (!db) return [];
        const result = await db.getAllAsync('SELECT * FROM gigs ORDER BY date DESC, id DESC;');
        return result;
    } catch (error) {
        console.error('Error listing gigs:', error);
        throw error;
    }
}

export async function addGig({ title, date, venue, city }) {
    if (Platform.OS === 'web') {
        throw new Error('Database not available on web. Please use iOS or Android.');
    }

    try {
        const db = await getDatabase();
        if (!db) throw new Error('Database not initialized');
        const result = await db.runAsync(
            'INSERT INTO gigs (title, date, venue, city) VALUES (?, ?, ?, ?);',
            [title, date, venue, city]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error adding gig:', error);
        throw error;
    }
}

export async function deleteGig(id) {
    if (Platform.OS === 'web') {
        throw new Error('Database not available on web. Please use iOS or Android.');
    }

    try {
        const db = await getDatabase();
        if (!db) throw new Error('Database not initialized');
        await db.runAsync('DELETE FROM gigs WHERE id = ?;', [id]);
    } catch (error) {
        console.error('Error deleting gig:', error);
        throw error;
    }
}

