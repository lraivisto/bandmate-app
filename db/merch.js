import { getDatabase } from './index';
import { Platform } from 'react-native';

export async function listMerch() {
    if (Platform.OS === 'web') {
        return []; // Return empty array on web
    }
    
    try {
        const db = await getDatabase();
        if (!db) return [];
        const result = await db.getAllAsync('SELECT * FROM merch ORDER BY name ASC, id DESC;');
        return result;
    } catch (error) {
        console.error('Error listing merch:', error);
        throw error;
    }
}

export async function addMerch({ name, price = 0, stock = 0 }) {
    if (Platform.OS === 'web') {
        throw new Error('Database not available on web. Please use iOS or Android.');
    }
    
    try {
        const db = await getDatabase();
        if (!db) throw new Error('Database not initialized');
        const result = await db.runAsync(
            'INSERT INTO merch (name, price, stock) VALUES (?, ?, ?);',
            [name, price, stock]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error adding merch:', error);
        throw error;
    }
}

export async function deleteMerch(id) {
    if (Platform.OS === 'web') {
        throw new Error('Database not available on web. Please use iOS or Android.');
    }
    
    try {
        const db = await getDatabase();
        if (!db) throw new Error('Database not initialized');
        await db.runAsync('DELETE FROM merch WHERE id = ?;', [id]);
    } catch (error) {
        console.error('Error deleting merch:', error);
        throw error;
    }
}

export async function updateMerchStock(id, newStock) {
    if (Platform.OS === 'web') {
        throw new Error('Database not available on web. Please use iOS or Android.');
    }
    
    try {
        const db = await getDatabase();
        if (!db) throw new Error('Database not initialized');
        await db.runAsync(
            'UPDATE merch SET stock = ? WHERE id = ?;',
            [newStock, id]
        );
    } catch (error) {
        console.error('Error updating merch stock:', error);
        throw error;
    }
}

