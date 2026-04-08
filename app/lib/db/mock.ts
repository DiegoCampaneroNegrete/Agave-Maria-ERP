/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/db/mock.ts

import { DB } from "./types";

const store: Record<string, any[]> = {
  orders: [],
  products: [],
};

export const mockDB: DB = {
  // mock.ts
  run: async (query: string, params: any[] = []) => {
    if (query.includes("INSERT INTO orders")) {
      store.orders.push({
        id: params[0],
        total: params[1],
        status: params[2],
        created_at: params[3],
      });
    }

    // 👇 ignora CREATE TABLE sin romper
  },

  query: async (query: string) => {
    if (query.includes("FROM orders")) {
      return store.orders;
    }

    return [];
  },
};
