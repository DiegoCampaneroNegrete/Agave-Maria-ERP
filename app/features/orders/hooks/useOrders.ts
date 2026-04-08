'use client';

import { useEffect, useState } from 'react';
import { getOrders, getOrderItems } from '../service';
import { Order, OrderItem } from '../types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  const load = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    // Checar esto
  const loadEffect = async () => {
    const data = await getOrders();
    setOrders(data);
  };
  loadEffect();
}, []);

  const selectOrder = async (order: Order) => {
    setSelected(order);
    const data = await getOrderItems(order.id);
    setItems(data);
  };

  return {
    orders,
    selected,
    items,
    selectOrder,
  };
};
