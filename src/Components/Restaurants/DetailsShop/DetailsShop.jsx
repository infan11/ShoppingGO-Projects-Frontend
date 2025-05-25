import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useShoppingCart from "../../Hooks/useShoppingCart";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useSeller from "../../Hooks/useSeller";
import { AiOutlineDelete } from "react-icons/ai";
import useRestaurantData from "../../Hooks/useRestaurantData";
import { RxUpdate } from "react-icons/rx";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

// FoodCardSkeleton Component
const FoodCardSkeleton = () => {
  return (
    <div className="relative flex flex-col bg-white shadow-md border border-gray-200 rounded-lg w-[330px] h-[360px] lg:w-[400px] lg:h-[450px] mx-auto px-2 py-2 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden rounded-md bg-gray-300 h-full w-full"></div>

      {/* Text Section */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded-full w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>

        {/* Button Skeletons */}
        <div className="flex space-x-3 mt-4">
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

const DetailsShop = () => {
  const { shopName } = useParams();
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]); // Cart State
  const [isCartOpen, setIsCartOpen] = useState(false); // Sidebar Toggle
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartFood, refetch] = useShoppingCart();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isSeller] = useSeller();
  const [, refetchTwo] = useRestaurantData();
  const [existingItem, setExistingItem] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      axiosSecure.get(`/sellerProfile/${shopName}`)
        .then((res) => {
          setFoodItems(res.data?.products || []);
        })
        .finally(() => setLoading(false));
    }, 3000); // 4 seconds delay

    return () => clearTimeout(timer);
  }, [shopName, refetch, refetchTwo]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (user && user.email && cart.productName) {
      axiosSecure.get(`/addItem?email=${user?.email}`)
        .then(res => {
          const itemInCart = res.data.some(cartEntry => cartEntry.productName === cart.productName);
          setExistingItem(itemInCart);
        })
        .catch(error => console.error("Error checking cart:", error));
    }
  }, [user, axiosSecure, cart.productName]);

  // Handle Food Deletion
  const handleDeleted = (shopName, productName) => {
    if (isAdmin || isModerator || isSeller) {
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
            .delete(`/sellerProfile/${shopName}/${productName}`)
            .then((res) => {
              if (res.data.success) {
                Swal.fire("Deleted!", "Food item deleted successfully.", "success");
                setFoodItems((prevFoodItems) =>
                  prevFoodItems.filter((food) => food.productName !== productName)
                );
              } else {
                Swal.fire("Error", "Failed to delete", "error");
              }
            })
            .catch(() => {
              Swal.fire("Error", "Failed to delete", "error");
            });
        }
      });
    } else {
      Swal.fire("Unauthorized", "You are not authorized to delete", "error");
    }
  };

  // Handle Add Food to Cart
  const handleshoppingCart = (food) => {
    if (user && user.email) {
      const foodInfo = {
        foodId: food._id,
        productName: food.productName,
        shopName: shopName,
        foodPrice: food.price,
        productImage: food.productImage,
        email: user.email,
        category : food.category,
        quantity : parseFloat(1)
      
      };

      axiosSecure.post("/shoppingCart", foodInfo)
        .then((res) => {
          if (res.data.insertedId) {
            Swal.fire("Success!", "Food added successfully!", "success");
            refetch();
            navigate("/dashboard/myOrder")
            // Update cart state and save to localStorage
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
      {isAdmin || isModerator || isSeller ? (
        <Link to={"/dashboard/addProducts"}>
          <div className="flex justify-end items-end">
            <button className="text-xl font-bold bg-[#339179] text-white rounded-full shadow-lg p-3">
              <MdOutlineAddCircleOutline />
            </button>
          </div>
        </Link>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-6 lg:px-4">
        {loading ? (
          // If loading, show skeletons
          Array.from({ length: 6 }).map((_, i) => <FoodCardSkeleton key={i} />)
        ) : foodItems.length > 0 ? (
          foodItems.map((food, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <div className="relative flex flex-col bg-white shadow-md border border-gray-200 rounded-lg w-[330px] h-[360px] lg:w-[400px] lg:h-[450px] mx-auto px-2 py-2">
                <div className="relative overflow-hidden rounded-md">
                  <motion.img src={food.productImage} alt={food.productName} className="h-full w-full object-cover" whileHover={{ scale: 1.1 }} />
                </div>
                <div className="p-4">
                  <p className="mb-2 bg-[#339179] text-white text-xs py-1 px-3 rounded-full w-fit">{food.productName || "Unavailable"}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-red-500 text-sm">Delicious {food.productName} from <Link to={`/sellerProfile/${food.shopName}`}><span className="font-bold">{shopName}</span></Link>. Price: ${food.price}</p>
                    {isAdmin || isModerator || isSeller ? (
                      <Link to={`/dashboard/updateFood/${food.shopName.products}`}>
                        <motion.button className="text-xl font-bold bg-[#339179] text-white rounded-full shadow-lg p-3 gap-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <RxUpdate />
                        </motion.button>
                      </Link>
                    ) : null}
                    {isAdmin || isModerator || isSeller ? (
                      <motion.button onClick={() => handleDeleted(shopName, food.productName)} className="text-xl font-bold bg-[#339179] text-white rounded-full shadow-lg p-3 ml-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <AiOutlineDelete />
                      </motion.button>
                    ) : null}

                    {existingItem ? (
                      <Link to="/dashboard/myOrder">
                        <Button className="text-[#339179]">Check Your Cart</Button>
                      </Link>
                    ) : (
                      <motion.button onClick={() => handleshoppingCart(food)} className="text-xl font-bold bg-[#339179] text-white rounded-full shadow-lg p-3 ml-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <MdOutlineAddCircleOutline />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center">No Food Available</div>
        )}
      </div>
    </div>
  );
};

export default DetailsShop;
