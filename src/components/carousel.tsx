"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay"; // Import autoplay styles
import { Autoplay } from "swiper/modules"; // Import autoplay module

const Carousel: React.FC = () => {
  const carouselImages = [
    "https://deccan-furniture.s3.ap-south-2.amazonaws.com/carousel/car-1.jpeg",
    "https://deccan-furniture.s3.ap-south-2.amazonaws.com/carousel/car-2.jpeg",
    "https://deccan-furniture.s3.ap-south-2.amazonaws.com/carousel/car-3.jpeg",
    "https://deccan-furniture.s3.ap-south-2.amazonaws.com/carousel/car-4.jpeg",
    "https://deccan-furniture.s3.ap-south-2.amazonaws.com/carousel/car-5.jpeg",
  ];

  return (
    <div className="mb-8">
      <Swiper
        slidesPerView={1}
        loop
        modules={[Autoplay]} // Register the Autoplay module
        autoplay={{
          delay: 3000, // 3 seconds delay
          disableOnInteraction: false, // Continue autoplay even after user interaction
        }}
      >
        {carouselImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <img
                src={image}
                alt={`Carousel Slide ${index + 1}`}
                className="w-full h-64 md:h-96 object-cover"
                style={{
                  filter: "brightness(0.8)",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
