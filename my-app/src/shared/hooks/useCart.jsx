import { useContext } from 'react';
import { CartContext } from '../../app/providers/CartProvider';
export function useCart() {
  return useContext(CartContext);useCart
}

