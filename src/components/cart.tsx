"use client";
import React from 'react';
import Link from 'next/link' ;
import { X } from 'lucide-react';
import { useCart } from '@/context/cartContext';
import { useRouter } from 'next/navigation';

interface CartProps {
  cartOpen: boolean;
  toggleCart: () => void;
}

const Cart: React.FC<CartProps> = ({ cartOpen, toggleCart }) => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const router = useRouter();

  const handleQuantityChange = (productId: string, increment: boolean) => {
    const item = cart.find(item => item.productId === productId);
    if (item) {
      const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        updateCartItem({ ...item, quantity: newQuantity });
      }
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <div
      className={`absolute top-full right-0 bg-[#3e2d1c] text-white p-4 rounded-lg w-80 shadow-lg ${cartOpen ? 'block' : 'hidden'}`}
    >
      <div className="flex items-center justify-between mb-4 border-b border-[#4d3d30] pb-2">
        <h2 className="text-lg font-semibold">Cart</h2>
        <button
          onClick={toggleCart} // Close the cart directly
          className="text-[#d0bca5] hover:text-[#e8e0d4] transition-colors duration-300"
          aria-label="Close cart"
        >
          <X className="text-lg" />
        </button>
      </div>
      {cart.length > 0 ? (
        <>
          <ul className="space-y-4">
            {cart.map(item => (
              <li key={item.productId} className="flex items-start bg-[#4d3d30] border border-[#5d4a3a] rounded-lg p-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                )}
                <div className="flex-1">
                  <Link
                    href={`/products/${item.productId}`}
                    className="text-white hover:text-[#d0bca5] text-lg font-medium mb-2"
                    onClick={toggleCart}
                  >
                    {item.name || 'Item'}
                  </Link>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">
                      ${item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId, false)}
                        className="px-2 py-1 bg-[#5d4a3a] text-[#e8e0d4] rounded-l hover:bg-[#6e5c4a] transition-colors duration-300"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-[#e8e0d4] text-[#4d3d30] rounded">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, true)}
                        className="px-2 py-1 bg-[#5d4a3a] text-[#e8e0d4] rounded-r hover:bg-[#6e5c4a] transition-colors duration-300"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-400 hover:text-red-300 text-sm mt-2"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-[#4d3d30] pt-2 mt-4">
            <span className="text-lg font-semibold text-[#f4f0ea]">Total: ${totalAmount}</span>
            <button
              onClick={() => {
                router.push('/checkout');
                toggleCart(); // Close the cart when proceeding to checkout
              }}
              className="bg-[#FFC107] text-[#3e2d1c] py-2 px-4 rounded hover:bg-[#ffb300] transition-colors duration-300"
              aria-label="Proceed to buy"
            >
              Proceed to Buy
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-300 text-sm">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
