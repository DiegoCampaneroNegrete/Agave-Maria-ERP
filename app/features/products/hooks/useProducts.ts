'use client';

import { useEffect, useState } from 'react';
import { getProducts, createProduct } from '../service';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const load = async () => {
    const data = await getProducts();
    setProducts(data);
  };


  useEffect(() => {
    const loadEffect = async () => {
    const data = await getProducts();
    console.log("🚀 ~ loadEffect ~ data:", data)
    setProducts(data);
  };
    loadEffect();
  }, []);

  
  const addProduct = async (product: { name: string; price: number }) => {
    await createProduct(product);
    await load(); // refrescar lista
  };

  return {
    products,
    addProduct,
  };
};