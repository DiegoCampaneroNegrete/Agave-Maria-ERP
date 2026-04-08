/* eslint-disable @typescript-eslint/no-explicit-any */
import { DB } from './types';

const store: {
  products: Array<{ id: any; name: any; price: any }>;
  orders: Array<{ id: any; total: any; status: any }>;
  order_items: Array<{ id: any; order_id: any; product_id: any; quantity: any; price: any }>;
} = {
  products: [],
  orders: [],
  order_items: [],
};

export const mockDB: DB = {
  run: async (query: string, params: any[] = []) => {
    if (query.includes('JOIN products')) {
      store.order_items.map(item => {
        const product = store.products.find(p => p.id === item.product_id);
        return {
          ...item,
          name: product?.name || 'Producto',
        };
      });
    }

    // PRODUCTS
    if (query.includes('INSERT INTO products')) {
      store.products.push({
        id: params[0],
        name: params[1],
        price: params[2],
      });
    }

    // ORDERS
    if (query.includes('INSERT INTO orders')) {
      store.orders.push({
        id: params[0],
        total: params[1],
        status: params[2],
      });
    }

    // ORDER ITEMS
    if (query.includes('INSERT INTO order_items')) {
      store.order_items.push({
        id: params[0],
        order_id: params[1],
        product_id: params[2],
        quantity: params[3],
        price: params[4],
      });
    }
  },

  query: async (query: string) => {
    if (query.includes('FROM products')) {
      return store.products;
    }

    if (query.includes('FROM orders')) {
      return store.orders;
    }

    if (query.includes('FROM order_items')) {
      return store.order_items;
    }

    return [];
  },
};