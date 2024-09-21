import React from 'react';
import Link from 'next/link';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string; // Optional field
  image?: string; // Optional field for image URL
}

interface CartItemProps {
  item: CartItem;
  updateCartItem: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  onClose: () => void; // Add onClose prop
}

const CartItem: React.FC<CartItemProps> = ({ item, updateCartItem, removeFromCart, onClose }) => {
  return (
    <li className="bg-[#4d3d30] rounded-lg p-3">
      <div className="flex items-start">
        <div className="flex w-full">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg mt-2 mr-3"
            />
          )}
          <div className="flex flex-col flex-1 ml-3">
            <Link
              href={`/products/${item.productId}`}
              className="text-[#f4f0ea] hover:text-gray-300 text-md font-medium mb-1"
              onClick={onClose} // Call onClose when the link is clicked
            >
              {item.name || 'Item'}
            </Link>
            <span className="text-sm text-gray-300 mb-2">
              ${item.price.toFixed(2)}
            </span>
            <div className="flex items-center mb-2">
              <button
                onClick={() => {
                  const newQuantity = item.quantity - 1;
                  if (newQuantity <= 0) {
                    removeFromCart(item.productId);
                  } else {
                    updateCartItem({ ...item, quantity: newQuantity });
                  }
                }}
                className="px-2 py-1 bg-[#5d4a3a] text-[#e8e0d4] rounded-l hover:bg-[#6e5c4a] transition-colors duration-300"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 py-1 bg-[#e8e0d4] text-[#4d3d30] rounded mx-2">
                {item.quantity}
              </span>
              <button
                onClick={() => updateCartItem({ ...item, quantity: item.quantity + 1 })}
                className="px-2 py-1 bg-[#5d4a3a] text-[#e8e0d4] rounded-r hover:bg-[#6e5c4a] transition-colors duration-300"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.productId)}
        className="text-red-400 hover:text-red-300 text-sm mt-2 w-full text-center"
        aria-label="Remove from cart"
      >
        Remove
      </button>
    </li>
  );
};

export default CartItem;
