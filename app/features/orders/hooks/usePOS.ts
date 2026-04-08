
import { useAtom } from 'jotai';
import { cartAtom } from '../store';
import { v4 as uuid } from 'uuid';
import { createOrderWithItems } from '../service';

export const usePOS = () => {
  const [cart, setCart] = useAtom(cartAtom);

  const addProduct = (product: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find(p => p.product_id === product.id);

      if (existing) {
        return prev.map(p =>
          p.product_id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          id: uuid(),
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeProduct = (product_id: string) => {
    setCart(prev =>
      prev
        .map(p =>
          p.product_id === product_id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter(p => p.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const checkout = async () => {
    const orderId = uuid();

    await createOrderWithItems(orderId, cart);

    clearCart();
  };

  return {
    cart,
    addProduct,
    removeProduct,
    clearCart,
    checkout,
  };
};