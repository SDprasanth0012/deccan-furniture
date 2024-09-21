// components/Wishlist.tsx
"use client";
import { FC, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useWishlist } from '@/context/wishListContext';
import { useCart } from '@/context/cartContext';
import gsap from 'gsap';

interface WishlistProps {
  wishlistOpen: boolean;
  toggleWishlist: () => void;
}

const Wishlist: FC<WishlistProps> = ({ wishlistOpen, toggleWishlist }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wishlistOpen) {
      gsap.fromTo(
        wishlistRef.current,
        { opacity: 0, scale: 0.9, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      gsap.to(wishlistRef.current, { opacity: 0, scale: 0.9, y: -20, duration: 0.5, ease: 'power3.in' });
    }
  }, [wishlistOpen]);

  const handleAddToCart = (item: any) => {
    if (item.price !== undefined) { // Check if price is defined
      addToCart({ ...item, quantity: 1, price: item.price });
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={toggleWishlist}
        className="text-gray-800 hover:text-gray-600 transition-colors duration-300"
        aria-label="Wishlist"
      >
        <Heart className="text-xl" />
      </button>
      {wishlistOpen && (
        <div
          ref={wishlistRef}
          className="absolute top-full right-0 bg-[#3e2d1c] text-white p-4 rounded-lg w-80 shadow-lg border border-[#4d3d30] overflow-y-auto z-50"
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#4d3d30] pb-2">
            <h2 className="text-lg font-semibold">Wishlist</h2>
            <button
              onClick={toggleWishlist}
              className="text-blue-500 hover:text-blue-300 transition-colors duration-300"
              aria-label="Close wishlist"
            >
              <X className="text-lg" />
            </button>
          </div>
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
      )}
    </div>
  );
};

export default Wishlist;
