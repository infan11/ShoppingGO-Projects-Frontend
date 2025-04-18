import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import RestaurantBanner2 from "../../../assets/RestaurantBanner/RestaurantBanner2.png";
import RestaurantBanner3 from "../../../assets/RestaurantBanner/RestaurantBanner3.png";
import RestaurantBanner4 from "../../../assets/RestaurantBanner/RestaurantBanner4.png";

const BannerSkeleton = () => (
  <div className="w-full h-[400px] bg-gray-300 animate-pulse rounded-lg" />
);

const ShopBanner = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate image loading
  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    const img3 = new Image();

    img1.src = RestaurantBanner2;
    img2.src = RestaurantBanner3;
    img3.src = RestaurantBanner4;

    Promise.all([
      new Promise((res) => (img1.onload = res)),
      new Promise((res) => (img2.onload = res)),
      new Promise((res) => (img3.onload = res)),
    ]).then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <BannerSkeleton />;
  }

  return (
    <div className="relative w-full h-[400px]">
    <Swiper
        pagination={{
            dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper w-full h-full"
    >
        <SwiperSlide>
            <img
                src={RestaurantBanner2}
                alt="Banner 1"
                className="w-full h-full object-cover"
            />
        </SwiperSlide>
        <SwiperSlide>
            <img
                src={RestaurantBanner3}
                alt="Banner 2"
                className="w-full h-full object-cover"
            />
        </SwiperSlide>
        <SwiperSlide>
            <img
                src={RestaurantBanner4}
                alt="Banner 3"
                className="w-full h-full object-cover"
            />
        </SwiperSlide>
    </Swiper>
</div>
  );
};

export default ShopBanner;
