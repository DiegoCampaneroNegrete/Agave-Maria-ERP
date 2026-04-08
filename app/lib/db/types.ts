/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/db/types.ts

export interface DB {
  run: (query: string, params?: any[]) => Promise<void>;
  query: (query: string, params?: any[]) => Promise<any[]>;
}