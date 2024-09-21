'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, User, Home } from 'lucide-react'; // Import Lucid Icons
import WishlistPopup from './wishListPopup'; // Import WishlistPopup
import CartPopup from './cartPopUp'; // Import CartPopup

const BottomNav: React.FC = () => {
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  const toggleWishlist = () => {
    if (cartOpen) {
      setCartOpen(false); // Close cart if open
    }
    setWishlistOpen(prev => !prev);
  };

  const toggleCart = () => {
    if (wishlistOpen) {
      setWishlistOpen(false); // Close wishlist if open
    }
    setCartOpen(prev => !prev);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#4d3d30] text-white border-t border-gray-700 shadow-lg z-50 lg:hidden">
      <div className="flex justify-around items-center py-2">
        <Link href="/" aria-label="Home">
          <Home className="text-xl" />
        </Link>
        <button
          onClick={toggleWishlist}
          className="text-xl"
          aria-label="Wishlist"
        >
          <Heart />
        </button>
        <button
          onClick={toggleCart}
          className="text-xl"
          aria-label="Cart"
        >
          <ShoppingCart />
        </button>
        <Link href="/profile" aria-label="Profile">
          <User className="text-xl" />
        </Link>
      </div>
      <WishlistPopup isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CartPopup isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
};

export default BottomNav;
