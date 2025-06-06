import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "../../ReduxSlice/CartSlice/CartSlice";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import useShoppingCart from "../../Hooks/useShoppingCart";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useSeller from "../../Hooks/useSeller";
import useRestaurantData from "../../Hooks/useRestaurantData";

const Addidas = () => {
  const { shopName } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [cartFood, refetch] = useShoppingCart();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isSeller] = useSeller();
  const [isRestaurantData, refetchTwo] = useRestaurantData();

  const biryaniproducts =
    isRestaurantData?.flatMap((restaurant) =>
      restaurant?.products?.map((food) => ({
        ...food,
        shopName: restaurant?.shopName,
      }))
    )?.filter((food) => food?.category === "Biryani") || [];

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      dispatch(setCart(JSON.parse(storedCart)));
    }
  }, [shopName, dispatch, refetch, refetchTwo]);

  const handleshoppingCart = (food) => {
    // dispatch(addToCart(food))
    if (user && user.email) {
      const foodInfo = {
        foodId: food._id,
        productName: food.productName,
        shopName: food.shopName,
        foodPrice: food.price,
        productImage: food.productImage,
        email: user.email,
        category: food.category,
      };
      dispatch(addToCart(foodInfo));
      axiosSecure
        .post("/shoppingCart", foodInfo)
        .then((res) => {
          if (res.data.insertedId) {
            Swal.fire("Success!", "Food added successfully!", "success");
            refetch();
            // dispatch(addToCart(food));
            // localStorage.setItem("cart", JSON.stringify([...cartItems, food]));
            navigate("/dashboard/myOrder");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-6 lg:px-4">
        {biryaniproducts.length > 0 ? (
          biryaniproducts.map((food, index) => {
            const isAlreadyInCart = cartItems.some(
              (item) => item.productName === food.productName
            );
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative flex flex-col bg-white shadow-md border border-gray-200 rounded-lg w-[330px] h-[360px] lg:w-[400px] lg:h-[450px] mx-auto px-2 py-2">
                  <div className="relative overflow-hidden rounded-md">
                    <motion.img
                      src={food.productImage}
                      alt={food.productName}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="mb-2 bg-[#339179] text-white text-xs py-1 px-3 rounded-full w-fit">
                      {food.productName || "Unavailable"}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-red-500 text-sm">
                        Delicious {food.productName} from{" "}
                        <Link to={`/sellerProfile/${food.shopName}`}>
                          <span className="font-bold">{food.shopName}</span>
                        </Link>
                        . Price: ${food.price}
                      </p>
                      {isAlreadyInCart ? (
                        <Link to="/dashboard/myOrder">
                          <button className="text-[#339179] underline">
                            Check Cart
                          </button>
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
            );
          })
        ) : (
          <p className="text-center text-gray-500">No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default Addidas;
