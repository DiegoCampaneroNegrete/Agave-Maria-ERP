import { getDB } from './index';
import { migrations } from './migrations';
import { Capacitor } from '@capacitor/core';

export const initDatabase = async () => {
  const db = await getDB();

  if (Capacitor.getPlatform() === 'web') {
    console.log('Skipping migrations on web');
    return;
  }

  for (const query of migrations) {
    await db.run(query);
  }
};
