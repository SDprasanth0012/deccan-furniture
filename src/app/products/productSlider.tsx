import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import Link from "next/link";

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

type Review = {
  user: string;
  comment: string;
  rating: number;
};

type ProductSliderProps = {
  category: string;
};

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const ProductSlider: React.FC<ProductSliderProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Swiper
        spaceBetween={10}
        slidesPerView={"auto"}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="product-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} style={{ width: "auto" }}>
            <div className="product-card">
                <Link href={`/products/${product._id}`}>
              <img src={product.image[0]} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </div>
                </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
