/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/db/sqlite.ts

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { DB } from './types';

const sqlite = new SQLiteConnection(CapacitorSQLite);

export const getSQLiteDB = async (): Promise<DB | null> => {
  if (Capacitor.getPlatform() === 'web') return null;

  await sqlite.checkConnectionsConsistency();

  const db = await sqlite.createConnection(
    'agave_db',
    false,
    'no-encryption',
    1,
    false
  );

  await db.open();

  return {
    run: async (query: string, params: any[] = []) => {
      await db.run(query, params);
    },
    query: async (query: string, params: any[] = []) => {
      const result = await db.query(query, params);
      return result.values ?? [];
    },
  };
};