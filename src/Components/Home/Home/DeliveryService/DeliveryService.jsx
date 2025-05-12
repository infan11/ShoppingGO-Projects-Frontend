import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMotorcycle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from '../../../../Redux/Features/LoadingSlice/LoadingSlice';

const DeliveryService = () => {

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading)
//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 4000);
//     return () => clearTimeout(timer);
//   }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
   dispatch(setLoading(false))
    } ,4000);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return (
      <div className="bg-white py-16 px-4 flex justify-center items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
          <div className="space-y-5">
            <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-20 px-2">
      <div className="l mx-auto flex flex-col items-center space-y-12">
        {/* Image Row */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left Image */}
          <motion.img
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src="https://i.ibb.co.com/qYnvFPbJ/Delivery-Receipt-Tray.png"
            alt="Tray"
            className="w-[260px] lg:w-[340px] rounded-lg "
          />

          {/* Motorbike Icon on Top */}
        
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-kanit  font-extrabold text-gray-800 mb-6 leading-snug">
            Fast & Reliable Delivery,<br /> Right to Your Door
          </h2>
          <p className="text-gray-600 font-Kanit mb-6 text-base sm:text-lg">
            Track your orders in real-time and enjoy ultra-fast delivery from our partnered riders.
            We deliver your food and essentials within minutes — safely and smoothly.
          </p>
          <button className="btn bg-[#339179] text-white hover:bg-[#339179] px-6 mt-3">
            Start Your Order
          </button>
        </motion.div>
          {/* Right Image */}
          <motion.img
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src="https://i.ibb.co/S4Ly7Mmf/service-1.png"
            alt="Rider"
            className="w-[180px] lg:w-[400px] "
          />
        </div>

        {/* Text Section Below Images */}
    
      </div>
    </div>
  );
};

export default DeliveryService;
