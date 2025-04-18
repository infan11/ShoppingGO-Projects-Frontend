import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import useRestaurantData from "../../Hooks/useRestaurantData";
import { Link } from "react-router-dom";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ShopCard = () => {
  const [isRestaurantData, refetch] = useRestaurantData(); // remove isLoading from here
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate 4-second loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleted = (food) => {
    if (isAdmin || isModerator) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure
            .delete(`/restaurantUpload/${food}`)
            .then((res) => {
              if (res.data.deletedCount > 0) {
                toast.success("Successfully Deleted");
              }
              refetch();
            })
            .catch((error) => {
              console.error("Error deleting:", error);
              toast.error("Failed to delete");
            });
        }
      });
    } else {
      toast.error("You are not authorized to delete");
    }
  };

  const LoadingCard = () => (
    <div className="w-full max-w-[400px] mx-auto rounded-xl shadow-lg bg-white animate-pulse p-4">
      <div className="h-[250px] bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 w-3/4 mx-auto mb-2 rounded-full"></div>
      <div className="h-4 bg-gray-200 w-1/2 mx-auto mb-4 rounded-full"></div>
      <div className="flex justify-center">
        <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-3 gap-4 px-8 max-w-7xl mx-auto mt-10 min-h-screen">
      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
        : isRestaurantData.map((restaurant) => (
            <Card
              key={restaurant._id}
              shadow={false}
              className="relative w-full max-w-[400px] mx-auto rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105"
            >
              <CardHeader
                floated={false}
                shadow={false}
                className="relative h-[250px] bg-cover bg-center"
                style={{ backgroundImage: `url(${restaurant.banner})` }}
              >
                <div className="absolute inset-0 transition-all duration-300" />
              </CardHeader>

              <CardBody className="text-center p-6">
                <Typography className="text-[18px] font-bold font-Caveat text-gray-900">
                  {restaurant?.restaurantName}
                </Typography>
                <Typography className="mb-2 font-Kanit">
                  {restaurant?.restaurantAddress}
                </Typography>

                <div className="mt-4 flex justify-center">
                  <Link to={`/restaurantUpload/${restaurant.restaurantName}`}>
                    <Avatar
                      size="xl"
                      variant="circular"
                      alt={restaurant?.restaurantName}
                      className="border-2 border-gray-300 shadow-lg transition-transform duration-300 hover:scale-110"
                      src={restaurant?.photo}
                    />
                  </Link>
                </div>

                {(isAdmin || isModerator) && (
                  <motion.button
                    onClick={() => handleDeleted(restaurant.restaurantName)}
                    className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-md hover:bg-red-700 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AiOutlineDelete size={20} />
                  </motion.button>
                )}
              </CardBody>
            </Card>
          ))}
    </div>
  );
};

export default ShopCard;
