'use client';

import React, { FC, useRef, useEffect } from 'react';
import { useWishlist } from '@/context/wishListContext';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import { X, ShoppingCart } from 'lucide-react';
import { gsap } from 'gsap';

interface WishlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistPopup: FC<WishlistPopupProps> = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlistRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && wishlistRef.current) {
      gsap.fromTo(
        wishlistRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    } else if (wishlistRef.current) {
      gsap.to(
        wishlistRef.current,
        { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in' }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (itemsRef.current) {
      gsap.fromTo(
        itemsRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [wishlist]);

  const handleAddToCart = (item: any) => {
    if (item.price !== undefined) {
      addToCart({ ...item, quantity: 1, price: item.price });
      // Do not call onClose here to prevent closing the popup
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  return (
    isOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          ref={wishlistRef}
          className="bg-[#3e2d1c] text-white p-4 rounded-lg w-[80%] max-w-lg mx-4 h-[80%] max-h-[80%] shadow-lg flex flex-col"
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#4d3d30] pb-2">
            <h2 className="text-lg font-semibold">Wishlist</h2>
            <button
              onClick={onClose}
              className="text-[#e8d9c0] hover:text-[#d8c9b9] transition-colors duration-300"
              aria-label="Close wishlist"
            >
              <X className="text-lg" />
            </button>
          </div>
          <div className="relative flex-1 overflow-y-auto pr-2 mb-4" ref={itemsRef}>
            {wishlist.length > 0 ? (
              <ul className="space-y-4">
                {wishlist.map(item => (
                  <li
                    key={item.productId}
                    className="flex items-start bg-[#4d3d30] border border-[#5d4a3a] rounded-lg p-3 relative"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg mr-3"
                      />
                    )}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-white hover:text-gray-300 text-lg font-medium"
                          onClick={onClose} // Close the wishlist popup on link click
                        >
                          {item.name || 'Item'}
                        </Link>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-[#5d4a3a] text-white p-2 rounded hover:bg-[#6e5c4a] transition-colors duration-300 flex items-center"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart className="text-lg" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        ${item.price ? item.price.toFixed(2) : '0.00'}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                          className="text-red-400 hover:text-red-300 text-sm"
                          aria-label="Remove from wishlist"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-300 text-sm">Your wishlist is empty.</p>
            )}
          </div>
        </div>
      </div>
    ) : null
  );
};

export default WishlistPopup;
