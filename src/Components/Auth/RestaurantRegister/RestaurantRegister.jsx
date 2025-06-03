import {
    Card,
    Input,
    Typography,
} from "@material-tailwind/react";

import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const RestaurantRegister = () => {
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const from = location.state?.from?.pathname || "/";
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        try {
          // ✅ Pass both name and email
          if(!data.displayName || data.email){
                toast.error("Shop name and email are required")
          }
          const response = await axiosSecure.get(`/users/check-name?name=${encodeURIComponent(data.displayName)}&email=${encodeURIComponent(data.email)}`);
          
          if (response.data?.exists) {
            toast.error("This restaurant name is already taken. Please choose another.");
            return;
          }
      
          const userResponse = await createUser(data.email, data.password);
          const registerUser = userResponse.user;
      
          await updateUserProfile({
            displayName: data.displayName,
          });
      
          const usersInfo = {
            name: data.displayName,
            email: data.email,
            shopAddress: data.shopAddress,
            phoneNumber: parseFloat(data.phoneNumber),
            date: new Date()
          };
      
          await axiosSecure.put("/users", usersInfo);
          toast.success("Successfully Registered!");
          navigate(from, { replace: true });
      
        } catch (error) {
          console.error("Registration Error:", error);
          toast.error(error.response?.data?.error || "Something went wrong.");
        }
      };

    return (
        <div className="hero min-h-screen mx-auto px-4 md:px-5 bg-gray-100">
            <div className="grid md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="hidden sm:block">
                    <img
                        className="w-full h-full object-cover"
                        src="https://i.ibb.co.com/nBHCFg8/seller-Mode.png"
                        alt="Seller Mode"
                    />
                </div>
                <div className="bg-white p-6 md:p-10">
                    <Card color="transparent" shadow={false}>
                        <Typography variant="h4" color="blue-gray" className="text-center mb-6 font-bold">
                            Shop Registration
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <Input
                                    label="Shop Name"
                                    size="lg"
                                    {...register("displayName", { required: true })}
                                />
                                {errors.displayName && <p className="text-sm text-red-500 mt-1">Restaurant name is required.</p>}
                            </div>

                            <div>
                                <Input
                                    label="Email Address"
                                    size="lg"
                                    type="email"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && <p className="text-sm text-red-500 mt-1">Email is required.</p>}
                            </div>

                            <div>
                                <Input
                                    label="Shop Address"
                                    size="lg"
                                    {...register("shopAddress", { required: true })}
                                />
                                {errors.shopAddress && <p className="text-sm text-red-500 mt-1">Address is required.</p>}
                            </div>

                            <div>
                                <Input
                                    label="Phone Number"
                                    size="lg"
                                    type="number"
                                    {...register("phoneNumber", { required: true })}
                                />
                                {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">Phone number is required.</p>}
                            </div>

                            <div className="relative">
                                <Input
                                    label="Password"
                                    size="lg"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••"
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                        maxLength: 8
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5 text-teal-600" /> : <Eye className="w-5 h-5 text-teal-600" />}
                                </button>
                                {errors.password?.type === 'required' && <p className="text-sm text-red-500 mt-1">Password is required.</p>}
                                {errors.password?.type === 'minLength' && <p className="text-sm text-red-500 mt-1">Password must be at least 6 characters.</p>}
                                {errors.password?.type === 'maxLength' && <p className="text-sm text-red-500 mt-1">Password must not exceed 8 characters.</p>}
                            </div>

                            {/* Placeholder for future file uploads */}
                            {/* 
                            <div>
                                <label className="text-sm font-medium text-red-500">Logo (300x300)</label>
                                <input type="file" {...register("photo", { required: true })} />
                            </div> 
                            */}

                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-all duration-300"
                            >
                                Submit Request
                            </button>
                        </form>

                        <Typography color="gray" className="mt-6 text-center text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-teal-600 font-semibold hover:underline">
                                Sign in
                            </a>
                        </Typography>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RestaurantRegister