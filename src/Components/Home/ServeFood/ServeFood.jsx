import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ServeFood = () => {
  const [isLoading, setIsLoading] = useState(true);

  // ৪ সেকেন্ড লোডিং সিমুলেশন
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const LoadingSkeleton = () => (
    <div className="hero bg-base-200 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl px-4 flex flex-col lg:flex-row-reverse gap-8 animate-pulse">
        <div className="bg-gray-300 w-full lg:w-[500px] h-[400px] lg:h-[500px] rounded-xl"></div>
        <div className="flex-1 space-y-6">
          <div className="h-10 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-12 bg-gray-300 rounded w-40 mt-4"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="mt-5">
      <div className="hero bg-white  ">
        <div className="hero-content flex-col lg:flex-row-reverse gap-8">
          {/* চেয়ারের ছবিতে হোভার অ্যানিমেশন */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            src="https://i.ibb.co.com/RnrmrTZ/chair-1.png"
            className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-xl "
          />

          {/* টেক্সট অংশে এনিমেশন ও বাংলা লেখা */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <h1 className="text-[23px] font-Kanit  lg:text-5xl  mb-4 leading-snug">
            The perfect combination <br /> of comfort and style!
            </h1>
            <p className="py-4 text-gray-700 text-lg">
            Welcome to our exclusive furniture collection — stylish design, durable quality, and reliable delivery all in one!
            </p>
            <button className="btn bg-[#339179] text-white hover:bg-[#339179] px-6 mt-2">
            Read More
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServeFood;
