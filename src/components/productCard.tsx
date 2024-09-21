// components/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from "@/context/cartContext";
import WishlistButton from './wishListButton'; // Import the updated WishlistButton

type Product = {
  _id: string;
  name: string;
  price: number;
  discount: number;
  image: string[];
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      quantity: 1,
      price: product.price,
      name: product.name,
      image: product.image[0] // Assuming you want to include the first image
    });
  };


  return (
    <div className="rounded-lg p-4 bg-[#e8e0d4] shadow-sm relative group transition-transform transform hover:scale-105 hover:shadow-lg">
      <div className="relative">
        <Image
          src={product.image[0]}
          alt={product.name}
          width={500}
          height={300}
          className="w-full h-48 object-cover rounded-lg transition-opacity duration-300 ease-in-out group-hover:opacity-95"
        />
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          <WishlistButton
            productId={product._id}
            productName={product.name}
            productPrice={product.price}
            productImage={product.image[0]} // Use the first image
          />
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-[#4f3d30] tracking-wide mb-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-xl font-medium text-[#4f3d30]">
              ${product.price.toFixed(2)}
            </p>
            {product.discount > 0 && (
              <p className="text-xs line-through text-gray-500">
                ${((product.price * 100) / (100 - product.discount)).toFixed(2)}
              </p>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            className="bg-[#4f3d30] text-[#f4f0ea] flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-opacity-90"
          >
            <FaShoppingCart size={16} />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
