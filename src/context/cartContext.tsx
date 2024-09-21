'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string; // Optional field
  image?: string; // Optional field for image URL
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  loadCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  };

  const addToCart = (item: CartItem) => {
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);

    if (existingItemIndex !== -1) {
      // Item exists, update its quantity
      const updatedCart = cart.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
      setCart(updatedCart);
    } else {
      // Item does not exist, add it to the cart
      const updatedCart = [...cart, item];
      setCart(updatedCart);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const updateCartItem = (item: CartItem) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.productId === item.productId ? item : cartItem
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
