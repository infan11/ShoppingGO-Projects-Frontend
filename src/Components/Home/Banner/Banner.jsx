import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { useState, useEffect } from 'react';

// Tailwind shimmer-only skeleton (Water-like shimmer effect)
const BannerSkeleton = () => (
  <div className="w-full h-[350px]  animate-pulse bg-[length:200%_100%] rounded-lg" />
);

const Banner = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const banners = [
    "https://i.ibb.co.com/Sw3trw8M/Banner-3.png",
    "https://i.ibb.co.com/nq29prp3/Banner-2.png",
    "https://i.ibb.co.com/0pGXkHb3/Banner-1.png",
 
  ];

  useEffect(() => {
    // Set a 3 second delay before switching isLoading to false
    const timer = setTimeout(() => {
      if (imagesLoaded === banners.length) {
        setIsLoading(false);
      }
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [imagesLoaded, banners.length]);

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  return (
    <div className="relative lg:w-[1400px] mx-auto lg:h-[350px] ">
      {isLoading && <BannerSkeleton />} {/* Shimmer Skeleton Loading with water effect */}

      <Swiper
        pagination={{ dynamicBullets: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        className={`mySwiper w-full h-full ${isLoading ? 'opacity-0 absolute top-0' : 'opacity-100 transition-opacity duration-300'}`}
      >
        {banners.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={src}
              alt={`Banner ${idx + 1}`}
              onLoad={handleImageLoad}
              className="w-full lg:h-[350px] rounded-xl object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
