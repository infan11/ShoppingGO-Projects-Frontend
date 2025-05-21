import React, { useState, useEffect } from "react";
import useShoppingCart from "../../Hooks/useShoppingCart";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast, { Toaster } from "react-hot-toast";

const MyOrder = () => {
  const [cartFood, refetch] = useShoppingCart();
  const [quantities, setQuantities] = useState({});
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cartFood?.length >= 0) {
      setTimeout(() => setIsLoading(false), 2000);
    }
  }, [cartFood]);

  const updateQuantityInDB = (id, quantity) => {
    if (!quantity || isNaN(quantity)) {
      toast.error("Please select a valid quantity!");
      return;
    }

    if (quantity === 1) {
      toast("Already set to quantity 1", { icon: "ℹ️" });
    }

    axiosSecure
      .patch(`/shoppingCart/${id}`, { quantity })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          toast.success("Quantity updated");
        }
      })
      .catch(() => {
        toast.error("Failed to update quantity");
      });
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => {
      const newQty = Math.min((prev[id] || 1) + 1, 100);
      updateQuantityInDB(id, newQty);
      return { ...prev, [id]: newQty };
    });
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => {
      const newQty = Math.max((prev[id] || 1) - 1, 1);
      updateQuantityInDB(id, newQty);
      return { ...prev, [id]: newQty };
    });
  };

  const handleQuantityChange = (id, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      const validQty = Math.max(1, Math.min(100, num));
      setQuantities((prev) => ({ ...prev, [id]: validQty }));
      updateQuantityInDB(id, validQty);
    }
  };

  const handleRemove = (id) => {
    if (user?.email) {
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
          axiosSecure.delete(`/shoppingCart/${id}`).then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire("Deleted!", "Item has been removed.", "success");
            }
          });
        }
      });
    }
  };

  const subtotal = cartFood.reduce((acc, item) => {
    const quantity = quantities[item._id] || 1;
    return acc + item.foodPrice * quantity;
  }, 0);

  const discount = subtotal * 0.15;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen mt-10 px-2 lg:px-5 border-2">
      <Toaster position="top-center" />
      {isLoading ? (
        <div className="mt-10">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center justify-between border-b py-4 px-2 md:px-5">
              <div className="flex items-center gap-4">
                <Skeleton height={64} width={64} />
                <div>
                  <Skeleton height={16} width={120} />
                  <Skeleton height={14} width={80} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton width={30} height={30} />
                <Skeleton width={30} height={30} />
                <Skeleton width={30} height={30} />
              </div>
              <Skeleton width={60} height={20} />
            </div>
          ))}
        </div>
      ) : cartFood.length > 0 ? (
        <div className="mb-11">
          <table className="table">
            <thead className="bg-[#339179] rounded-xl text-white">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartFood.map((item) => (
                <tr key={item._id}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="h-10 lg:h-16 w-10 lg:w-16 rounded-md overflow-hidden">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="lg:font-bold text-[10px] lg:text-lg text-[#339179]">
                          {item.productName}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">Price: ${item.foodPrice}</p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-[#339179] text-sm font-semibold mt-1 hover:underline"
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>

                  <td>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="px-2 py-1"
                        onClick={() => handleDecrement(item._id)}
                      >
                        -
                      </button>
                      <input
                      
                        min="1"
                        max="100"
                        className="w-10  bg-white text-center  mx-1 text-[#339179]"
                        value={quantities[item._id] || 1}
                        onChange={(e) =>  handleQuantityChange(item._id, e.target.value)}
                      />
                      <button
                        type="button"
                        className="px-2 py-1"
                        onClick={() => handleIncrement(item._id)}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td>
                    <p className="font-semibold text-[#339179]">
                      ${item.foodPrice * (quantities[item._id] || 1)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 md:px-20">
            <div className="divider  mx-auto"></div>
            <div className="flex justify-end gap-12">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-end gap-12">
              <p>Discount (15%)</p>
              <p>${discount.toFixed(2)}</p>
            </div>
            <div className="flex justify-end gap-12">
              <p className="font-bold">Total</p>
              <p className="text-[#339179] font-bold">${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="px-3 md:px-1">
            <Link to={"/dashboard/checkOutForm"}>
              <button className="btn w-full mt-4 font-Kanit btn-outline bg-[#339179] hover:bg-[#339179]
               text-white hover:text-white">
                Confirm Order
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <img
            className="w-16 mx-auto rounded-2xl"
            src={"https://i.ibb.co.com/88JDM0z/remove-from-cart-12316609.png"}
            alt="Empty cart"
          />
          <p className="text-center font-bold text-[#339179]">Your cart is empty</p>
          <p className="text-center">Continue shopping</p>
          <Link to={"/"}>
            <p className="text-center border-2 p-2 w-24 mx-auto mt-2">EXPLORE</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
