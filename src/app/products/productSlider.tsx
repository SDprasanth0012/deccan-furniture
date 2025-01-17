import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";



  
type Product = {
  _id: string;
  name: string;
  image: string[];
  category: string;
  description: string;
  price: number;
};

type ProductSliderProps = {
  category: string;
};

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const ProductSlider: React.FC<ProductSliderProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const productContainerRef = useRef<HTMLDivElement>(null);
  const gsapTimelineRef = useRef<gsap.core.Tween | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("left");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${category}`,
          {
            headers: {
              "x-api-key": API_KEY!,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (sliderRef.current) {
      new LocomotiveScroll({
        el: sliderRef.current,
        smooth: true,
        direction: "horizontal",
      });
    }
  }, []);

  useEffect(() => {
    if (productContainerRef.current && products.length > 0) {
      const productContainer = productContainerRef.current;

      const clonedProducts = [...products, ...products]; // Duplicate products for seamless scrolling
      const totalWidth = clonedProducts.length * 300; // Assuming each product is 300px wide
      productContainer.style.width = `${totalWidth}px`;

      // GSAP animation
      gsapTimelineRef.current = gsap.to(productContainer, {
        x: direction === "left" ? `-${products.length * 300}px` : 0,
        duration: 20, // Adjust speed
        ease: "linear",
        repeat: -1, // Infinite loop
      });

      return () => {
        gsapTimelineRef.current?.kill();
        gsapTimelineRef.current = null;
      };
    }
  }, [products, direction]);

//   const handleSwipe = (swipeDirection: "left" | "right") => {
//     setDirection(swipeDirection);

//     // Reverse the GSAP animation dynamically
//     gsapTimelineRef.current?.pause();
//     const productContainer = productContainerRef.current;
//     if (productContainer) {
//       const currentX = gsap.getProperty(productContainer, "x") as number;

//       // Restart GSAP animation based on swipe direction
//       gsapTimelineRef.current = gsap.to(productContainer, {
//         x: swipeDirection === "left" ? `-${products.length * 300}px` : 0,
//         duration: 20,
//         ease: "linear",
//         repeat: -1,
//       }).progress((currentX / -(products.length * 300)) % 1); // Adjust progress to avoid a jump
//     }
//   };
const handleSwipe = (swipeDirection: "left" | "right") => {
    setDirection(swipeDirection);
  
    const productContainer = productContainerRef.current;
    if (productContainer && gsapTimelineRef.current) {
      // Pause the current animation
      gsapTimelineRef.current.pause();
  
      // Get the current x position of the container
      const currentX = parseFloat(gsap.getProperty(productContainer, "x") as string) || 0;
  
      // Calculate total width based on products and card width
      const cardWidth = 300; // Set card width
      const totalWidth = products.length * cardWidth;
  
      // Normalize the current position as a percentage of total width
      const currentProgress = Math.abs(currentX / totalWidth) % 1;
  
      // Adjust x target for direction
      const xTarget =
        swipeDirection === "left"
          ? `-=${cardWidth}px` // Move left by one card width
          : `+=${cardWidth}px`; // Move right by one card width
  
      // Restart GSAP animation with adjusted direction and progress
      gsapTimelineRef.current = gsap
        .to(productContainer, {
          x: swipeDirection === "left" ? `-${totalWidth}px` : 0,
          duration: 20, // Adjust speed as needed
          ease: "linear",
          repeat: -1,
          modifiers: {
            x: (value) => gsap.utils.wrap(-totalWidth, 0)(parseFloat(value)), // Ensure seamless looping
          },
          
        })
        .progress(currentProgress); // Resume from current progress
    }
  };
  

  const handleTouchStart = (event: React.TouchEvent) => {
    const touchStartX = event.touches[0].clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndX = e.touches[0].clientX;
      if (touchEndX - touchStartX > 5) {
        handleSwipe("right");
        document.removeEventListener("touchmove", handleTouchMove);
      } else if (touchStartX - touchEndX > 50) {
        handleSwipe("left");
        document.removeEventListener("touchmove", handleTouchMove);
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", () => {
      document.removeEventListener("touchmove", handleTouchMove);
    }, { once: true });
  };

  if (!products.length) return <p>Loading...</p>;

  return (
    <div
      ref={sliderRef}
      data-scroll-container
      className="product-slider-container"
      onTouchStart={handleTouchStart}
    >
      <div ref={productContainerRef} className="product-list">
        {[...products, ...products].map((product, index) => (
          <div className="product-card" key={index}>
            <img src={product.image[0]} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .product-slider-container {
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .product-list {
          display: flex;
          position: relative;
        }

        .product-card {
          width: 300px; /* Adjust based on your design */
          margin-right: 10px;
          text-align: center;
          flex-shrink: 0;
        }

        .product-image {
          width: 100%;
          height: auto;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProductSlider;
