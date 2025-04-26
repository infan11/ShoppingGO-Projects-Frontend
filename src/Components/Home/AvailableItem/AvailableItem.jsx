import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import useAuth from "../../Hooks/useAuth";



const AvailableItem = () => {
    const {user} = useAuth();
    const items = [
        { name: "Biryani", path: "/biryani", img: "https://i.ibb.co/Hgq3rf9/biryani.png" },
        { name: "Pizza", path: "/pizza", img: "https://i.ibb.co/PFBV4qh/pizza.png" },
        { name: "Burger", path: "/burger", img: "https://i.ibb.co/yy1Jc6N/burger-removebg-preview.png" },
        { name: "Chicken", path: "/chicken", img: "https://i.ibb.co/FJg7xmP/Chicken.png" },
        { name: "Chinese", path: "/chinese", img: "https://i.ibb.co/jLzCxbQ/Chinese.png" },
        { name: "Cake", path: "/cake", img: "https://i.ibb.co/12qMjL0/Cake.png" },
        { name: "Beef", path: "/beef", img: "https://i.ibb.co/wMjCr5Q/beep.png" },
        { name: "Juice", path: "/juice", img: "https://i.ibb.co/LRQjdvF/drinks.png" },
      ];
  return (
<div className="mt-25 mb-25">
<div className=" relative w-full min-h-[400px]  flex flex-col items-center justify-center overflow-hidden">
      
      {/* Beautiful Banner Text */}
      <div className="text-center mb-6 z-10">
        <h2 className="text-4xl font-extrabold text-[#339179] mb-2 drop-shadow-lg">Find Your Favorite Item</h2>
        <p className="text-gray-600 text-lg"> Categories just for your <span className="font-extrabold font-Caveat text-2xl text-[#339179]">{user?.displayName}</span></p>
      </div>

      {/* Scrolling Items */}
      <div className="w-full ">
        <Marquee pauseOnHover={true} speed={50} gradient={false}>
          <div className="flex   gap-9">
            {items.map((item, index) => (
              <Link key={index} to={item.path}>
                <motion.div
                  className="relative w-40 h-52 bg-white rounded-2xl  group overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  whileHover={{ rotateY: 12, rotateX: 12 }}
                  whileTap={{ scale: 5 }}
                >
                  {/* Gradient Border Hover */}
                  <div className="absolute inset-0 rounded-2xl p-[3px]  opacity-0 group-hover:opacity-100 transition duration-500"></div>

                  {/* Card Front */}
                  <div className="relative w-full h-full bg-white rounded-2xl p-4 flex flex-col items-center justify-center group-hover:opacity-0 transition duration-500">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-24 h-24 ga-3 object-contain mb-2"
                    />
                    <p className="font-semibold text-gray-700">{item.name}</p>
                  </div>

                  {/* Card Back */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#339179] text-white rounded-2xl opacity-0 group-hover:opacity-100 rotate-y-180 transition-all duration-500">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm mt-1">Order Now!</p>
                  </div>

                </motion.div>
              </Link>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Decorative Light Background */}
      <div className="absolute inset-0 bg-[#339179] bg-cover bg-center opacity-10"></div>

    </div>
</div>
  );
};

export default AvailableItem;
