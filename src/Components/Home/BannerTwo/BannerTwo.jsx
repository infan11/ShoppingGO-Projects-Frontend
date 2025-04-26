import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BannerTwo = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const LoadingBanner = () => {
    return (
      <div className="mt-24 mb-24 px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:w-[1000px] mx-auto animate-pulse p-4">
          <div className="h-64 bg-gray-300 "></div>
          <div className="h-64 bg-gray-300 "></div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-24 mb-24 px-6">
      {isLoading ? (
        Array.from({ length: 1 }).map((_, i) => <LoadingBanner key={i} />)
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 lg:w-[1000px] mx-auto">
          <div>
            <img src="https://i.ibb.co.com/yB0zGGkV/Watch-1.jpg" alt="Watch 1" />
          </div>
          <div>
            <img src="https://i.ibb.co/vvf3Kfg4/Watch-2.jpg" alt="Watch 2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerTwo;
