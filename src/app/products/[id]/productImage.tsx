import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";

const ProductGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="md:w-1/2 flex flex-col items-center">
      {/* Main Image Swiper */}
      <Swiper
        modules={[Navigation, Thumbs]}
        thumbs={{ swiper: thumbsSwiper }} // Connects the thumbs swiper to the main swiper
        spaceBetween={10}
        slidesPerView={1}
        className="w-full h-96 rounded-lg shadow-lg overflow-hidden"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
            <Image
              src={img}
              alt={`Slide ${index}`}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      <Swiper
        modules={[Navigation, Thumbs]}
        spaceBetween={10}
        slidesPerView={4}
        onSwiper={setThumbsSwiper} // Set the thumbs swiper to sync
        breakpoints={{
          640: { slidesPerView: 1 }, // For smaller screens
          768: { slidesPerView: 2 }, // For medium screens
          1024: { slidesPerView: 4 }, // For larger screens
        }}
        className="w-full rounded-lg shadow-lg overflow-hidden mt-4"
      >
        {images.map((img, index) => (
          <SwiperSlide
            key={index}
            className="cursor-pointer flex justify-center items-center"
          >
            <div className="relative w-full h-24">
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles for Navigation */}
      <style jsx>{`
        .swiper-button-next, .swiper-button-prev {
          color: #4d3d30; /* Arrow color */
          background-color: #4d3d30; /* Navigation button background color */
          border-radius: 50%; /* Optional: to make the button circular */
        }

        .swiper-button-next:hover, .swiper-button-prev:hover {
          background-color: #3d2e25; /* Darker shade for hover effect */
        }
      `}</style>
    </div>
  );
};

export default ProductGallery;
