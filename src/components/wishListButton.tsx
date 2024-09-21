// components/WishlistButton.tsx
import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/wishListContext';

type WishlistButtonProps = {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string; // Assumes a single image for simplicity
};

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, productName, productPrice, productImage }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  useEffect(() => {
    const isInWishlist = wishlist.some(item => item.productId === productId);
    setIsWishlisted(isInWishlist);
  }, [wishlist, productId]);

  const handleWishlistClick = async () => {
    setIsWishlisted(prev => !prev); // Optimistically update the UI

    if (isWishlisted) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist({
        productId,
        name: productName,
        price: productPrice,
        image: productImage
      });
    }
  };

  return (
    <Button
      onClick={handleWishlistClick}
      className={`p-2 bg-transparent rounded-full border border-transparent transition-colors ${
        isWishlisted ? "text-[#4d3d30]" : "text-[#f4f0ea]"
      } lg:hover:text-[#4d3d30]`}
    >
      <FaHeart size={24} />
    </Button>
  );
};

export default WishlistButton;
