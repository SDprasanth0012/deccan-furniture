'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WishlistItem {
  productId: string;
  name: string; // Name of the product
  price: number; // Price of the product
  image?: string; // Optional field for image URL
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  loadWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  };

  const addToWishlist = (item: WishlistItem) => {
    // Check if the item already exists in the wishlist
    const existingItemIndex = wishlist.findIndex(wishlistItem => wishlistItem.productId === item.productId);

    if (existingItemIndex === -1) {
      // Item does not exist, add it to the wishlist
      const updatedWishlist = [...wishlist, item];
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlist.filter(item => item.productId !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
