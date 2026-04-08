// /lib/db/index.ts

import { Capacitor } from '@capacitor/core';
import { mockDB } from './mock';
import { getSQLiteDB } from './sqlite';
import { DB } from './types';

let dbInstance: DB | null = null;

export const getDB = async (): Promise<DB> => {
  if (dbInstance) return dbInstance;

  if (Capacitor.getPlatform() === 'web') {
    console.log('🧪 Using MOCK DB');
    dbInstance = mockDB;
    return dbInstance;
  }

  const sqliteDB = await getSQLiteDB();

  if (!sqliteDB) {
    throw new Error('No DB available');
  }

  console.log('📱 Using SQLITE DB');
  dbInstance = sqliteDB;

  return dbInstance;
};