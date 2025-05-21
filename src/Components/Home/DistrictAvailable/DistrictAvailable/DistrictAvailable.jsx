import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const DistrictAvailable = () => {
    const axiosSecure = useAxiosSecure();

    const { data: districts = [] } = useQuery({
        queryKey: ["districts"],
        queryFn: async () => {
            const res = await axiosSecure.get("/districtAvailable");
            console.log("Districts API Response:", res.data); // Debugging
            return res.data;
        }
    });

    return (
        <div className="p-6">
            <p className="text-center font-bold font-Caveat text-xl text-[#339179] mt-4">
                Find us in these cities and many more!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {districts.map((district, index) => (
                    <motion.div
                        key={index}
                        className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <img
                            src={district.photo}
                            className="w-full h-44 object-cover rounded-lg"
                        />
                        <Link to={`/sellerProfile/district/${district.districtName}`}>
                            <motion.div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white font-semibold text-lg font-Caveat hover:underline">
                                    {district.districtName || "Unknown"}
                                </p>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DistrictAvailable;
