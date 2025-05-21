
  import React, { useState } from "react";
  import { useForm } from "react-hook-form";
  import useAxiosSecure from "../../Hooks/useAxiosSecure";
  import { imageUpload } from "../../Hooks/imageHooks";
  import toast from "react-hot-toast";
  import { MdCloudUpload } from "react-icons/md";
  import useAuth from "../../Hooks/useAuth";
  import { useNavigate } from "react-router-dom";
  import useRestaurantData from "../../Hooks/useRestaurantData";

  const AddProducts = () => {
    const { user } = useAuth();
    const {
      register,  handleSubmit, formState: { errors },
  setValue,
    } = useForm({
      defaultValues: {
        shopName: user?.displayName || " Shop Name",
      },
    });
  const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [imageError, setImageError] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const validateImage = (file) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onloadend = () => {
          img.onload = () => {
            if (img.width <= 500 && img.height <= 500) {
              resolve(true);
            } else {
              reject("Image dimensions must be 500x500 pixels or smaller");
            }
          };
          img.onerror = () => reject("Invalid image file");
          img.src = reader.result;
        };

        reader.readAsDataURL(file);
      });
    };

    const onSubmit = async (data) => {
      setImageError("");
      const productImage = data.productImage?.[0];

      try {
        await validateImage(productImage);

        const imageData = await imageUpload(productImage);
        const foodInfo = {
          shopName: data.shopName,
          productName: data.productName,
          productImage: imageData?.data?.display_url || "",
          category: data.category,
          price: parseFloat(data.price),
       
        };

        // Send data to the backend
        axiosSecure.patch(`/sellerProfile/${data.shopName}`, foodInfo)
        .then((res) => {
          console.log(res.data);
          if (res.data.modifiedCount > 0) {
            toast.success("Successfully added Food");
          } else {
            toast.error("Please Upload Your Info");
          }
        });
      } catch (error) {
        setImageError(error.message || "An error occurred");
      }
      navigate(`/sellerProfile/${data.shopName}`);
    };
      
      
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    };

    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-[#339179] mb-8">Add Your Product</h2>
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Food Image */}
              <div>
                <div className="flex items-center justify-center">
                  <div className="relative w-[200px] h-[200px] flex items-center justify-center border-4 border-dashed rounded-full cursor-pointer">
                    <input
                      type="file"
                      id="fileInput"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      name="productImage"
                      accept="image/*"
                      {...register("productImage", { required: true })}
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="fileInput"
                      className="flex items-center justify-center w-[200px] h-[200px] text-[#339179]"
                    >
                      <MdCloudUpload size={20} className="mr-2" />
                      Upload File
                    </label>
                  </div>
                </div>
                {errors.productImage && (
                  <span className="text-[#339179] text-sm text-center">
                    This field is required
                  </span>
                )}
                {imageError && (
                  <span className="text-[#339179] text-sm text-center">
                    {String(imageError)}
                  </span>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-[150px] mx-auto h-auto rounded-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-full focus:ring-2 text-[#339179] focus:ring-red-400 outline-none transition"
                  placeholder="Enter Shop Name"
                  {...register("shopName", { required: true, minLength: 1, maxLength: 20 })}
                  readOnly
                />
                {errors.shopName && (
                  <span className="text-[#339179] text-sm">
                    This field is required
                  </span>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-full focus:ring-2 text-[#339179] focus:ring-red-400 outline-none transition"
                  placeholder="Enter Product Name"
                  {...register("productName", { required: true, minLength: 4, maxLength: 20 })}
                />
                {errors.productName && (
                  <span className="text-[#339179] text-sm">
                    This field is required
                  </span>
                )}
              
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-full text-[#339179] focus:ring-2 focus:ring-red-400 outline-none transition"
                  placeholder="Enter price"
                  {...register("price", { required: true })}
                />
                {errors.price && (
                  <span className="text-[#339179] text-sm">
                    This field is required
                  </span>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-full text-[#339179] focus:ring-2 focus:ring-red-400 outline-none transition"
                name="category"   {...register("category", { required: true })}
                >
                  <option value="">Select Category</option>
                  <option>Biryani</option>
                  <option>Pizza</option>
                  <option>Burger</option>
                  <option>Cake</option>
                  <option>Juice</option>
                  <option>Chinese</option>
                  <option>Chicken</option>
                  <option>Beef</option>
                </select>
                {errors.category && (
                  <span className="text-[#339179] text-sm">
                    This field is required
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#339179] text-white font-semibold rounded-full hover:bg-[#e60e0e] transition focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                >
                  Add Food
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddProducts;
