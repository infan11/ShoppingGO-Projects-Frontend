import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";

import Swal from "sweetalert2";

import { AiOutlineDelete } from "react-icons/ai";

import { RxUpdate } from "react-icons/rx";
import useAuth from "../../Hooks/useAuth";
import useShoppingCart from "../../Hooks/useShoppingCart";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useSeller from "../../Hooks/useSeller";
import useRestaurantData from "../../Hooks/useRestaurantData";
import useAxiosSecure from "../../Hooks/useAxiosSecure";


const Samsung = () => {
  const { shopName } = useParams();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartFood, refetch] = useShoppingCart();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isSeller] = useSeller();
  const [isRestaurantData, refetchTwo] = useRestaurantData();
  const [existingItem, setExistingItem] = useState(false);

    const Beefproducts= isRestaurantData
    ?.flatMap((restaurant) =>
      restaurant?.products?.map((food) => ({
        ...food,
        shopName: restaurant?.shopName,
      }))
    )
    ?.filter((food) => food?.category === "Beef") || []; 
  
  console.log("Beef products Data:", Beefproducts);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [shopName, refetch, refetchTwo]);

  useEffect(() => {
    if (user && user.email && cart.fooName) {
      axiosSecure
        .get(`/addItem?email=${user?.email}`)
        .then((res) => {
          const itemInCart = res.data.some(
            (cartEntry) => cartEntry.productName === cart.fooName
          );
          setExistingItem(itemInCart);
        })
        .catch((error) => console.error("Error checking cart:", error));
    }
  }, [user, axiosSecure, cart.productName]);

  // ✅ Handle Food Deletion
 
  // ✅ Handle Add Food to Cart
  const handleshoppingCart = (food) => {
    if (user && user.email) {
      const foodInfo = {
        foodId: food._id,
        productName: food.productName,
        shopName: food.shopName, // ✅ এখানে রেস্টুরেন্ট নাম সঠিকভাবে আছে
        foodPrice: food.price,
        productImage: food.productImage,
        email: user.email,
        category: food.category,
      };

      axiosSecure
        .post("/shoppingCart", foodInfo)
        .then((res) => {
          if (res.data.insertedId) {
            Swal.fire("Success!", "Food added successfully!", "success");
            refetch();
            navigate("/dashboard/myOrder");
            const updatedCart = [...cart, food];
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setIsCartOpen(true);
          }
        })
        .catch(() => Swal.fire("Error", "Error adding food", "error"));
    } else {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to add food to your cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen mb-5">
      <br />
      {/* {isAdmin || isModerator || isSeller ? (
        <Link to={"/dashboard/addProducts"}>
          <div className="flex justify-end items-end">
            <button className="text-xl font-bold bg-[#339179] text-white rounded-full shadow-lg p-3">
              <MdOutlineAddCircleOutline />
            </button>
          </div>
        </Link>
      ) : null} */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-6 lg:px-4">
        {Beefproducts.length > 0 ? (
          Beefproducts.map((food, index) => ( // ✅ Fixed `Beefproducts.products`
            <motion.div key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <div className="relative flex flex-col bg-white shadow-md border border-gray-200 rounded-lgw-[330px] h-[360px]  lg:w-[400px] lg:h-[450px] mx-auto px-2 py-2">
                <div className="relative overflow-hidden rounded-md">
                  <motion.img src={food.productImage} alt={food.productName} className="h-full w-full object-cover" whileHover={{ scale: 1.1 }} />
                </div>
                <div className="p-4">
                  <p className="mb-2 bg-[#339179] text-white text-xs py-1 px-3 rounded-full w-fit">{food.productName || "Unavailable"}</p>
                  {/* <p className="mb-2 bg-[#339179] text-white text-xs py-1 px-3 rounded-full w-fit">{food.category || "Unavailable"}</p> */}
                  <div className="flex justify-between items-center">
                   <p className="text-red-500 text-sm">
                      Delicious {food.productName} from{" "}
                      <Link to={`/sellerProfile/${food.shopName}`}>
                        <span className="font-bold">{food.shopName}</span>
                      </Link>
                      . Price: ${food.price}
                    </p>

                

                    {existingItem ? (
                      <Link to="/dashboard/myOrder">
                        <Button className="text-[#339179]">Check Your Cart</Button>
                      </Link>
                    ) : (
                      <motion.button
                        onClick={() => handleshoppingCart(food)}
                        className="text-xl font-bold bg-[#339179] text-white rounded-full shadow-lg p-3 ml-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MdOutlineAddCircleOutline />
                      </motion.button>
                    )}

                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default Samsung;
