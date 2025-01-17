// "use client";
// import React, { useEffect, useState, useCallback } from 'react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { FaShoppingCart, FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt } from 'react-icons/fa';
// import { useParams } from 'next/navigation';
// import { useCart } from '@/context/cartContext';
// import WishlistButton from '@/components/wishListButton';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import ReviewPopup from '@/components/reviewPopup';

// interface Review {
//   name: string;
//   rating: number;
//   comment: string;
//   userId: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   image: string[];
//   description: string;
//   price: number;
//   discount: number;
//   features: string[];
//   rating: number;
//   numReviews: number;
//   reviews: Review[];
// }

// const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// const ProductPage: React.FC = () => {
//   const { id } = useParams();
//   const { addToCart } = useCart();
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
//   const [review, setReview] = useState({ rating: 0, comment: '', userId: '', name: '' });

//   useEffect(() => {
//     if (!id) return;

//     const fetchProduct = async () => {
//       if (!API_KEY) {
//         setError('Error: API_KEY is not configured.');
//         return;
//       }

//       try {
//         const response = await fetch(`/api/products/${id}`, {
//           headers: { 'x-api-key': API_KEY! },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setProduct(data);
//         } else {
//           setError('Failed to fetch product');
//         }
//       } catch (error) {
//         setError('Error fetching product');
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = useCallback(() => {
//     if (product) {
//       addToCart({
//         productId: product._id,
//         quantity: 1,
//         price: product.price,
//         name: product.name,
//         image: product.image[0],
//       });
//     }
//   }, [product, addToCart]);

//   const handleBuyNow = useCallback(() => {
//     if (product) {
//       addToCart({
//         productId: product._id,
//         quantity: 1,
//         price: product.price,
//         name: product.name,
//         image: product.image[0],
//       });
//       router.push(`/checkout?productId=${product._id}&quantity=1`);
//     }
//   }, [product, router]);

//   const handleImageChange = (index: number) => setCurrentImageIndex(index);
//   const handlePrevImage = () =>
//     setCurrentImageIndex((prev) => (product && prev === 0 ? product.image.length - 1 : prev - 1));
//   const handleNextImage = () =>
//     setCurrentImageIndex((prev) => (product && prev === product.image.length - 1 ? 0 : prev + 1));

//   const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setReview((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (status === 'loading') return;
//     if (!session) {
//       router.push('/log-in');
//       return;
//     }

//     const reviewData = {
//       rating: review.rating,
//       comment: review.comment,
//       userId: session.user.id as string,
//       name: session.user.name as string,
//     };

//     if (product) {
//       fetch(`/api/products/${product._id}/reviews`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': API_KEY!,
//         },
//         body: JSON.stringify(reviewData),
//       })
//         .then((response) =>
//           response.ok ? response.json() : Promise.reject('Failed to submit review')
//         )
//         .then((updatedProduct) => {
//           setProduct(updatedProduct);
//           setReview({ rating: 0, comment: '', userId: '', name: '' });
//           setIsReviewPopupOpen(false);
//         })
//         .catch((err) => setError(err || 'Error submitting review'));
//     }
//   };

//   const renderRating = (rating: number) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;

//     return (
//       <div className="flex items-center text-yellow-500">
//         {[...Array(fullStars)].map((_, index) => (
//           <FaStar key={`full-${index}`} size={20} />
//         ))}
//         {hasHalfStar && <FaStarHalfAlt key="half" size={20} />}
//         {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
//           <FaStar key={`empty-${index}`} size={20} className="text-gray-300" />
//         ))}
//       </div>
//     );
//   };

//   if (error) return <p>{error}</p>;
//   if (!product) return <p>Loading...</p>;

//   const finalPrice =
//     product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

//   return (
//     <div className="container mx-auto p-4 md:p-8 bg-[#e8e0d4] text-[#4d3d30]">
//       <div className="flex flex-col md:flex-row">
//         {/* Product Gallery */}
//         <div className="md:w-1/2">
//           <div className="relative w-full h-96">
//             <Image
//               src={product.image[currentImageIndex]}
//               alt={product.name}
//               layout="fill"
//               objectFit="cover"
//               className="rounded-lg shadow-md"
//             />
//             <div className="absolute  inset-y-1/2 flex justify-between w-full px-4 h-8">
//               <button
//                 onClick={handlePrevImage}
//                 aria-label="Previous image"
//                 className="bg-[#4d3d30] text-[#f4f0ea] p-2 rounded-full hover:bg-[#3b2a1e] text-center"
//               >
//                 <FaChevronLeft size={18} />
//               </button>
//               <button
//                 onClick={handleNextImage}
//                 aria-label="Next image"
//                 className="bg-[#4d3d30] text-white p-2 rounded-full hover:bg-[#3b2a1e]"
//               >
//                 <FaChevronRight size={18} />
//               </button>
//             </div>
//           </div>

//           <div className="flex overflow-x-auto py-2 mt-4">
//             {product.image.map((img, index) => (
//               <div
//                 key={index}
//                 className={`relative w-24 h-24 cursor-pointer transition-transform duration-300 ${
//                   index === currentImageIndex ? 'border-[#4d3d30] scale-110' : 'border-gray-300'
//                 }`}
//                 onClick={() => handleImageChange(index)}
//               >
//                 <Image
//                   src={img}
//                   alt={`Thumbnail ${index}`}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-lg border-2"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product Information */}
//         <div className="md:w-1/2 md:pl-8 pt-6 md:pt-0">
//           <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
//           <div className="flex items-center mb-4">
//             <span className="text-2xl font-semibold mr-4">${finalPrice.toFixed(2)}</span>
//             {product.discount > 0 && (
//               <span className="text-lg font-medium line-through">${product.price.toFixed(2)}</span>
//             )}
//           </div>
//           <div className="flex items-center mb-6">
//             {renderRating(product.rating)}
//             <span className="ml-4">{product.numReviews} reviews</span>
//           </div>
//           <Button onClick={handleBuyNow} className="bg-[#4d3d30] text-white w-full mb-2">
//             Buy Now
//           </Button>
//           <Button onClick={handleAddToCart} className="bg-[#4d3d30] text-white w-full">
//             <FaShoppingCart className="mr-2" /> Add to Cart
//           </Button>

//           <div className="mt-8">
//             <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
//             {product.reviews.length > 0 ? (
//               <ul>
//                 {product.reviews.map((review, index) => (
//                   <li key={index}>
//                     <p className="font-semibold">{review.name}</p>
//                     {renderRating(review.rating)}
//                     <p>{review.comment}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No reviews yet</p>
//             )}
//           </div>

//           <Button onClick={() => setIsReviewPopupOpen(true)} className="bg-[#4d3d30] text-white mt-6">
//             Write a Review
//           </Button>

//           {isReviewPopupOpen && (
//             <ReviewPopup
//               review={review}
//               onClose={() => setIsReviewPopupOpen(false)}
//               onSubmit={handleSubmitReview}
//               onReviewChange={handleReviewChange}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;

"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaShoppingCart, FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/cartContext';
import WishlistButton from '@/components/wishListButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ReviewPopup from '@/components/reviewPopup';

interface Review {
  name: string;
  rating: number;
  comment: string;
  userId: string;
}

interface Product {
  _id: string;
  name: string;
  image: string[];
  description: string;
  price: number;
  discount: number;
  features: string[];
  rating: number;
  numReviews: number;
  reviews: Review[];
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [review, setReview] = useState({ rating: 0, comment: '', userId: '', name: '' });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      if (!API_KEY) {
        setError('Error: API_KEY is not configured.');
        return;
      }

      try {
        const response = await fetch(`/api/products/${id}`, {
          headers: { 'x-api-key': API_KEY! },
        });

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setError('Failed to fetch product');
        }
      } catch (error) {
        setError('Error fetching product');
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      addToCart({
        productId: product._id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image[0],
      });
    }
  }, [product, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (product) {
      addToCart({
        productId: product._id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image[0],
      });
      router.push(`/checkout?productId=${product._id}&quantity=1`);
    }
  }, [product, router]);

  const handleImageChange = (index: number) => setCurrentImageIndex(index);
  const handlePrevImage = () =>
    setCurrentImageIndex((prev) => (product && prev === 0 ? product.image.length - 1 : prev - 1));
  const handleNextImage = () =>
    setCurrentImageIndex((prev) => (product && prev === product.image.length - 1 ? 0 : prev + 1));

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status === 'loading') return;
    if (!session) {
      router.push('/log-in');
      return;
    }

    const reviewData = {
      rating: review.rating,
      comment: review.comment,
      userId: session.user.id as string,
      name: session.user.name as string,
    };

    if (product) {
      fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY!,
        },
        body: JSON.stringify(reviewData),
      })
        .then((response) =>
          response.ok ? response.json() : Promise.reject('Failed to submit review')
        )
        .then((updatedProduct) => {
          setProduct(updatedProduct);
          setReview({ rating: 0, comment: '', userId: '', name: '' });
          setIsReviewPopupOpen(false);
        })
        .catch((err) => setError(err || 'Error submitting review'));
    }
  };

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center text-yellow-500">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} size={20} />
        ))}
        {hasHalfStar && <FaStarHalfAlt key="half" size={20} />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
          <FaStar key={`empty-${index}`} size={20} className="text-gray-300" />
        ))}
      </div>
    );
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  const finalPrice =
    product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white text-gray-800">
      <div className="flex flex-col md:flex-row">
        {/* Product Gallery */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={product.image[currentImageIndex]}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out transform hover:scale-105"
            />
            <div className="absolute inset-y-1/2 w-full flex justify-between px-6">
              <button
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="bg-black text-white p-3 rounded-full hover:bg-gray-700 transition"
              >
                <FaChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextImage}
                aria-label="Next image"
                className="bg-black text-white p-3 rounded-full hover:bg-gray-700 transition"
              >
                <FaChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex overflow-x-auto mt-4 py-2 space-x-3">
            {product.image.map((img, index) => (
              <div
                key={index}
                className={`relative w-24 h-24 cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 ${
                  index === currentImageIndex ? 'transform scale-110 border-4 border-gray-900' : ''
                }`}
                onClick={() => handleImageChange(index)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="md:w-1/2 md:pl-8 pt-6 md:pt-0">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-semibold text-gray-900">${finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-lg font-medium line-through text-gray-500 ml-4">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center text-gray-600 mb-6">
            {renderRating(product.rating)}
            <span className="ml-4 text-sm">{product.numReviews} reviews</span>
          </div>

          <Button onClick={handleBuyNow} className="bg-[#6b4f2f] text-white w-full py-3 rounded-lg shadow-md hover:bg-[#5a4327] transition mb-3">
            Buy Now
          </Button>
          <Button onClick={handleAddToCart} className="bg-[#6b4f2f] text-white w-full py-3 rounded-lg shadow-md hover:bg-[#5a4327] transition flex items-center justify-center">
            <FaShoppingCart className="mr-2" /> Add to Cart
          </Button>

          {/* Product Features */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {product.features.map((feature, index) => (
                <li key={index} className="text-sm">{feature}</li>
              ))}
            </ul>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h3>
            {product.reviews.length > 0 ? (
              <ul className="space-y-4">
                {product.reviews.map((review, index) => (
                  <li key={index} className="border-b pb-4">
                    <div className="font-semibold text-gray-800">{review.name}</div>
                    {renderRating(review.rating)}
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No reviews yet</p>
            )}
          </div>

          <Button
            onClick={() => setIsReviewPopupOpen(true)}
            className="bg-[#6b4f2f] text-white mt-6 w-full py-3 rounded-lg shadow-md hover:bg-[#5a4327] transition"
          >
            Write a Review
          </Button>

          {isReviewPopupOpen && (
            <ReviewPopup
              review={review}
              onClose={() => setIsReviewPopupOpen(false)}
              onSubmit={handleSubmitReview}
              onReviewChange={handleReviewChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
