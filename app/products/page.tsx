'use client';

import { useProducts } from '@/features/products/hooks/useProducts';
// import { ProductForm } from '@/features/products/components/ProductForm';
import { ProductList } from '@/features/products/components/ProductList';
import { ProductForm } from '@/features/products/components/ProductForm';

export default function ProductsPage() {
  const { products, addProduct } = useProducts();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <h1 className="text-2xl font-bold">
        Productos
      </h1>

      {/* Form */}
      <ProductForm onAdd={addProduct} />

      {/* List */}
      <ProductList products={products} />

    </div>
  );
}