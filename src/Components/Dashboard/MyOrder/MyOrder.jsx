import React, { useState, useEffect } from "react";
import useAddFood from "../../Hooks/useAddFood";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MyOrder = () => {
  const [cartFood, refetch] = useAddFood();
  const [quantities, setQuantities] = useState({});
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cartFood?.length >= 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2 second skeleton
    }
  }, [cartFood]);

  const handleIncrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) < 100 ? (prev[id] || 0) + 1 : 100,
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) > 0 ? (prev[id] || 0) - 1 : 0,
    }));
  };

  const handleQuantityChange = (id, value) => {
    const newValue = Math.max(1, Math.min(100, Number(value)));
    setQuantities((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handleRemove = (id) => {
    if (user && user.email) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure.delete(`/addFood/${id}`)
            .then(res => {
              refetch();
              if (res.data.deletedCount > 0) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                  color: "red"
                });
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

  const onSubmit = (data, id) => {
    if (!id) {
      Swal.fire("Error!", "Invalid food item ID.", "error");
      return;
    }

    const updatedQuantity = quantities[id] || 1;

    axiosSecure
      .patch(`/addFood/${id}`, { quantity: updatedQuantity })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire("Success!", "Quantity updated successfully.", "success");
        }
      })
      .catch((err) => {
        Swal.fire("Error!", "Failed to update quantity.", "error");
      });
  };

  return (
    <div className="min-h-screen mt-10 px-2 lg:px-5 border-2">
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
          <div className="flex justify-end gap-12 mt-4 pr-6">
            <Skeleton width={100} height={20} />
            <Skeleton width={80} height={20} />
          </div>
          <div className="flex justify-end gap-12 mt-1 pr-6">
            <Skeleton width={100} height={20} />
            <Skeleton width={80} height={20} />
          </div>
          <div className="flex justify-end gap-12 mt-1 pr-6">
            <Skeleton width={100} height={20} />
            <Skeleton width={80} height={20} />
          </div>
          <div className="px-4 mt-6">
            <Skeleton height={40} width={"100%"} />
          </div>
        </div>
      ) : cartFood.length > 0 ? (
        <div className="mb-11">
          <table className="table ">
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
                        <div className=" h-10 lg:h-16 w-10 lg:w-16 rounded-md overflow-hidden">
                          <img
                            src={item.foodImage}
                            alt={item.foodName}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className=" grid md:grid-cols-2  ">
                        <p className=" lg:font-bold text-[10px] lg:text-lg text-[#339179]">{item.foodName}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold ">Price: ${item.foodPrice}</p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-[#339179] text-sm font-semibold mt-1 hover:underline"
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>

                  <td>
                    <form onSubmit={handleSubmit((data) => onSubmit(data, item._id))}>
                      <div className="w-[84px]">
                        <div className="mx-auto flex items-center">
                          <button
                            className="px-3 py-1 rounded hover:bg-gray-300"
                            onClick={() => handleDecrement(item._id)}
                            type="button"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="w-4 bg-white text-[#339179] text-center font-bold"
                            name="quantities"
                            value={quantities[item._id] || ""}
                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                            required
                          />
                          <button
                            onClick={() => handleIncrement(item._id)}
                            className="px-3 py-1 rounded hover:bg-gray-300"
                            disabled={(quantities[item._id] || 0) >= 100}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </form>
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
            <div className="divider ml-4 divider-error mx-auto"></div>
            <div className="flex justify-evenly md:justify-end gap-12">
              <p className="text-center">Subtotal</p>
              <p className="text-center">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-evenly md:justify-end gap-12">
              <p className="text-center">Discount (15%)</p>
              <p className="text-center">${discount.toFixed(2)}</p>
            </div>
            <div className="flex justify-evenly md:justify-end gap-12">
              <p className="text-center mr-4">Total</p>
              <p className="text-center ml-3 font-bold text-[#339179]">${total.toFixed(2)} </p>
            </div>
          </div>

          <div className="px-3 md:px-1">
            <Link to={"/dashboard/checkOutForm"}>
              <button className="btn w-full mt-4 font-Kanit btn-outline bg-[#339179] hover:bg-[#339179] text-white hover:text-white ">
                Confirm Order
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen justify-center pt-28 items-center">
          <img
            className="w-16 mx-auto rounded-2xl"
            src={"https://i.ibb.co.com/88JDM0z/remove-from-cart-12316609.png"}
            alt=""
          />
          <p className="text-center font-bold text-red-600">Your cart is empty</p>
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
