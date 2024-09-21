'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { useCart } from '@/context/cartContext';
import CartItem from './cartItem'; // Adjust the path according to your project structure
import { useRouter } from 'next/navigation'
interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (isOpen && cartRef.current) {
      gsap.fromTo(
        cartRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    } else if (cartRef.current) {
      gsap.to(
        cartRef.current,
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
  }, [cart]);

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    isOpen ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div
          ref={cartRef}
          className="bg-[#3e2d1c] text-[#f4f0ea] p-4 rounded-lg w-[80%] max-w-lg mx-4 h-[80%] max-h-[80%] shadow-lg flex flex-col"
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#4d3d30] pb-2">
            <h2 className="text-lg font-semibold">Cart</h2>
            <button
              onClick={onClose}
              className="text-[#e8d9c0] hover:text-[#d8c9b9] transition-colors duration-300"
              aria-label="Close cart"
            >
              <X className="text-lg" />
            </button>
          </div>
          <div className="relative flex-1 overflow-y-auto pr-2 mb-4" ref={cartRef}>
            {cart.length > 0 ? (
              <ul className="space-y-4" ref={itemsRef}>
                {cart.map(item => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    updateCartItem={updateCartItem}
                    removeFromCart={removeFromCart}
                    onClose={onClose} // Pass onClose function to CartItem
                  />
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-300 text-sm">Your cart is empty.</p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[#4d3d30] pt-2 mt-auto">
            <span className="text-lg font-semibold text-[#f4f0ea]">Total: ${totalAmount}</span>
            <button
  onClick={() => {
    router.push('/checkout')
    onClose() // Close the cart popup when proceeding to checkout page
  }} // Navigate to the checkout page
  className="bg-[#FFC107] text-[#3e2d1c] py-2 px-4 rounded hover:bg-[#ffb300] transition-colors duration-300"
  aria-label="Proceed to buy"
>
  Proceed to Buy
</button>

          </div>
        </div>
      </div>
    ) : null
  );
};

export default CartPopup;
