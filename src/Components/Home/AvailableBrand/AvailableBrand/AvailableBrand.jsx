import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import useAuth from "../../../Hooks/useAuth";




const AvailableBrand = () => {
  const { user } = useAuth();
  const items = [
    { path: "/biryani", img: "https://i.ibb.co.com/GfjNzXxX/samsung.png" },
    { path: "/pizza", img: "https://i.ibb.co.com/XrmYqLfM/nestle.png" },
    { path: "/burger", img: "https://i.ibb.co.com/8L4KdMQP/lG.png" },
    { path: "/chicken", img: "https://i.ibb.co.com/Qjm149Hf/rolex.png" },
    { path: "/chinese", img: "https://i.ibb.co.com/nNFNPsFr/hp.png" },
    { path: "/cake", img: " https://i.ibb.co.com/RTyXxB2N/casio.png" },
    { path: "/beef", img: "https://i.ibb.co.com/SDYns3T3/lenovo.png" },
    { path: "/juice", img: "https://i.ibb.co.com/vCSW4MhV/dell.png" },
    { path: "/chicken", img: " https://i.ibb.co.com/Zz9R6wnV/assus.png" },
    { path: "/chinese", img: "https://i.ibb.co.com/HfHg83S6/apple.png" },
    { path: "/cake", img: "https://i.ibb.co.com/fYdpQFcJ/addidas.png" },
    { path: "/beef", img: "https://i.ibb.co.com/s9rdPd5z/oppo.png" },
    { path: "/juice", img: " https://i.ibb.co.com/DDmVs2rz/xiaomi.png" },
    { path: "/juice", img: " https://i.ibb.co.com/ksT8yLSs/vivo.png" },
    
    
    
    
    
    
    
   

    // name: "Samsung",
    // name: "Pizza",
    // name: "Burger",
    // name: "Chicken",
    // name: "Chinese",
    // name: "Cake",
    // name: "Beef",
    // name: "Juice",
    // name: "Chicken",
    // name: "Chinese",
    // name: "Cake",
    // name: "Beef",
    // name: "Juice",
  ];
  return (
    <div className="mt-25 mb-25">
      <div className=" relative w-full min-h-[400px]  flex flex-col items-center justify-center overflow-hidden">

        {/* Beautiful Banner Text */}
        {/* <div className="text-center mb-6 z-10">
          <h2 className="text-4xl font-extrabold text-[#339179] mb-2 drop-shadow-lg">Find Your Favorite Brand</h2>
          <p className="text-gray-600 text-lg"> Just for you <span className="font-extrabold font-Caveat text-2xl text-[#339179]">{user?.displayName}</span></p>
        </div> */}

        {/* Scrolling Items */}
        <div className="w-full ">
          <Marquee pauseOnHover={true} speed={30} gradient={false}>
            <div className="flex   gap-9">
              {items.map((item, index) => (
                <Link key={index} to={item.path}>
                  <motion.div
                    className="relative w-40 h-52  rounded-2xl  group overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                    whileHover={{ rotateY: 5, rotateX: 5 }}
                    whileTap={{ scale: 5 }}
                  >
                    {/* Gradient Border Hover */}
                    <div className="absolute inset-0 rounded-2xl p-[3px]  opacity-0 group-hover:opacity-100 transition duration-500"></div>

                    {/* Card Front */}
                    <div className="relative w-full h-full  rounded-2xl p-4 flex flex-col items-center justify-center group-hover:opacity-0 transition duration-500">
                      <img
                        src={item.img}

                        className="w-24 h-24 gap-3 object-contain mb-2  mx-auto   "
                      />
                      <p className="font-semibold text-gray-700">{item.name}</p>
                    </div>

                    {/* Card Back */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent blur-0  rounded-2xl opacity-0 group-hover:opacity-100 rotate-y-180 transition-all duration-200">
                      <img src={item.img} className="w-20 h-20 object-contain" alt="" />
                      {/* <p className="font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded">Show</p> */}
                    </div>

                  </motion.div>
                </Link>
              ))}
            </div>
          </Marquee>
        </div>

        {/* Decorative Light Background */}
        {/* <div className="absolute inset-0 bg-[#339179] bg-cover bg-center opacity-10"></div> */}

      </div>
    </div>
  );
};

export default AvailableBrand;
