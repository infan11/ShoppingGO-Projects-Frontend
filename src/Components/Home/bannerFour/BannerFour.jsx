import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BannerFour = () => {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false)
        const img = new Image();
        img.src = 'https://i.ibb.co/DgzLSFq/Banner-4.png'; // fixed image URL
        img.onload = () => setIsLoading(false);
    } , 3000)
    return () => clearTimeout(timer)
    
  }, []);

  return (
    <div>
 

      <div className="relative w-full mt-5 mb-24">
        {/* Skeleton Loader */}
        {isLoading && (
          <div className="w-full h-[440px] bg-gray-200 animate-pulse rounded-md" />
        )}

        {/* Background Image */}
        {!isLoading && (
          <img
            src="https://i.ibb.co.com/DgzLSFq5/Banner-4.png"
            alt="Restaurant Banner"
            className="w-full h-[440px] object-cover"
          />
        )}

        {/* Text Overlay */}
        {!isLoading && (
          <div
            data-aos="fade-right"
            className="absolute top-1/2 mt-16 left-0 lg:left-40 px-6 ml-2 bg-white p-6 rounded-2xl shadow-xl max-w-lg"
          >
            <h2 className="text-[15px] lg:text-2xl font-bold text-gray-900">
              Turn Your Shopping Outler into an Online Store with ShoppingGO
            </h2>
            <p className="text-gray-700 mt-2">
              Reach millions of new customers <br />
              We handle everything — from showcasing your menu <br />
              to processing orders and fast delivery.
            </p>
            <Link to={"/restaurantRegister"}>
              <button className="mt-4 bg-[#339179] text-white px-5 py-2 rounded-full hover:bg-[#2d7d67] transition">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerFour;
