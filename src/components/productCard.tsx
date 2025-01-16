// // components/ProductCard.tsx
// import React from 'react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { FaShoppingCart } from 'react-icons/fa';
// import { useCart } from "@/context/cartContext";
// import WishlistButton from './wishListButton'; // Import the updated WishlistButton
// import Link from 'next/link';

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   discount: number;
//   image: string[];
// };

// type ProductCardProps = {
//   product: Product;
// };

// const ProductCard: React.FC<ProductCardProps>= ({ product }) => {
//   const { addToCart } = useCart();
//   const handleAddToCart = () => {
//     addToCart({
//       productId: product._id,
//       quantity: 1,
//       price: product.price,
//       name: product.name,
//       image: product.image[0] // Assuming you want to include the first image
//     });
//   };

//    console.log("each product is rendered here", product)
//   return (
//     <div className="rounded-lg p-4 bg-[#e8e0d4] shadow-sm relative group transition-transform transform hover:scale-105 hover:shadow-lg">
//       <div className="relative">
//         <Link href={`/products/${product._id}`} >
        
//         <Image
//           src={product.image[0]}
//           alt={product.name}
//           width={500}
//           height={300}
//           className="w-full h-48 object-cover rounded-lg transition-opacity duration-300 ease-in-out group-hover:opacity-95"
//         />
//         </Link>
//         <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
//           <WishlistButton
//             productId={product._id}
//             productName={product.name}
//             productPrice={product.price}
//             productImage={product.image[0]} // Use the first image
//           />
//           {product.discount > 0 && (
//             <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
//               -{product.discount}%
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="mt-4">
//       <Link href={`/products/${product._id}`} className='cursor-pointer'>
//         <h3 className="text-xl font-bold text-[#4f3d30] tracking-wide mb-2">
//           {product.name}
//         </h3>
//         </Link>
//         <div className="flex items-center justify-between mt-2">
//           <div>
//             <p className="text-xl font-medium text-[#4f3d30]">
//               ${product.price.toFixed(2)}
//             </p>
//             {product.discount > 0 && (
//               <p className="text-xs line-through text-gray-500">
//                 ${((product.price * 100) / (100 - product.discount)).toFixed(2)}
//               </p>
//             )}
//           </div>
//           <Button
//             onClick={handleAddToCart}
//             className="bg-[#4f3d30] text-[#f4f0ea] flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-opacity-90"
//           >
//             <FaShoppingCart size={16} />
//             <span>Add to Cart</span>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;



// components/ProductCard.tsx
// components/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaShoppingCart, FaStar, FaRegStar } from 'react-icons/fa';
import { useCart } from "@/context/cartContext";
import WishlistButton from './wishListButton';
import Link from 'next/link';

type Review = {
  name: string;
  rating: number;
  comment: string;
  user: string;
};

type Product = {
  _id: string;
  name: string;
  image: string[];
  category: string;
  subcategory: string;
  description: string;
  price: number;
  discount: number;
  features: string[];
  reviews: Review[];
  rating: number;
  numReviews: number;
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
      image: product.image[0],
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="relative rounded-lg bg-[#f4f0ea] shadow-md hover:shadow-lg overflow-hidden transition-transform transform hover:scale-105 group flex flex-col h-full">
      {/* Product Image */}
      <div className="relative ">
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.image[0]}
            alt={product.name}
            width={500}
            height={300}
            className="w-full h-64 object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-90"
          />
        </Link>
        <div className="absolute top-2 left-2 w-[100%]  pr-4 flex justify-between items-center space-x-2">
          <WishlistButton
            productId={product._id}
            productName={product.name}
            productPrice={product.price}
            productImage={product.image[0]}
          />
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <Link href={`/products/${product._id}`} className="block cursor-pointer">
          <h3 className="text-lg font-bold text-[#4f3d30] truncate mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2 space-x-1">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-500">
            ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        {/* Product Description */}
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
          {product.description}
        </p>

        {/* Product Features */}
        <ul className="text-sm text-gray-600 mb-4 list-disc pl-4 line-clamp-2">
          {product.features.slice(0, 2).map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        {/* Price Section */}
        <div className='mb-2'>
          <p className="text-[#4f3d30] text-lg font-semibold">
            ₹{product.price.toFixed(2)}
          </p>
          {product.discount > 0 && (
            <p className="text-sm line-through text-gray-500">
              ₹{((product.price * 100) / (100 - product.discount)).toFixed(2)}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full mt-auto  bg-[#4f3d30] text-[#f4f0ea] flex items-center justify-center space-x-2 px-3 py-2 rounded-3xl font-medium text-sm hover:bg-opacity-90 transition"
        >
          <FaShoppingCart size={16} />
          <span>Add to Cart</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;



