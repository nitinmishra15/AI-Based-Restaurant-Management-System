import React, { createContext, useState } from 'react';
// Create the Context
export const CartContext = createContext();
// Create the Provider wrapper
export function CartProvider({ children }) {
  // Pre-load mock items exactly as in the original state
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  // Add a product to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      const name = product.name || product.itemName || "Item";
      const image = product.image || product.imageUrl || 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=300';
      
      return [
        ...prevItems,
        {
          id: product.id,
          name: name,
          price: product.price,
          image: image,
          quantity: 1,
        }
      ];
    });
  };
  // Remove a product completely from the cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  // Increase quantity of a product by 1
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  // Decrease quantity of a product by 1 (removes if quantity reaches 0)
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            const updatedQty = item.quantity - 1;
            return updatedQty > 0 ? { ...item, quantity: updatedQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };
  // Clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
  };
  // Derived state values
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const totalPrice = subtotal + tax + deliveryFee;
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartItemsCount,
        subtotal,
        tax,
        deliveryFee,
        totalPrice,
        cartOpen,
        setCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
