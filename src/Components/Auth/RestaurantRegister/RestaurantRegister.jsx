import {
    Card,
    Input,
    Typography,
} from "@material-tailwind/react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { imageUpload } from '../../Hooks/imageHooks';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useState } from "react";

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

            const response = await axiosSecure.get(`/users/check-name?name=${encodeURIComponent(data.displayName)}`);


            if (response.data?.exists) {
                toast.error("This restaurant name is already taken. Please choose another name.");
                return;
            }



            const userResponse = await createUser(data.email, data.password);
            const registerUser = userResponse.user;

            await updateUserProfile({
                name: data.displayName,
            });

            const usersInfo = {
                name: data?.displayName,
                email: data.email,
                restaurantAddress: data.restaurantAddress,
                restaurantNumber: parseFloat(data.phoneNumber),
                date : new Date()

            };

            await axiosSecure.put("/users", usersInfo);

            toast.success("Successfully Registered!");
            navigate(from, { replace: true });

        } catch (error) {
            console.error("Error during registration:", error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };
    return (
        <div className="hero min-h-screen mx-auto px-4 md:px-5">
            <div className="grid md:grid-cols-2 rounded-r-2xl shadow-xl">
                <div className="text-center hidden sm:block">
                    <img
                        className="md:w-[670px] md:h-[810px] lg:w-[690px] lg:h-[740px] rounded-l-2xl"
                        src="https://i.ibb.co.com/nBHCFg8/seller-Mode.png"
                        alt="Seller Mode"
                    />
                </div>
                <div className="lg:w-full shrink-0 rounded-r-2xl shadow-xl">
                    <Card color="transparent" shadow={false}>
                        <p className="text-2xl font-extrabold text-center mb-3">SIGN IN</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 mb-2 mx-auto px-4 md:px-6 w-full">
                            <div className="mb-1 md:w-full lg:w-96 mx-auto space-y-2 gap-6">
                                <Input
                                    size="lg"
                                    type="text"
                                    label="Restaurant Name"
                                    {...register("displayName", { required: true })}
                                />
                                {errors.displayName && <span className="text-red-500 text-sm">This field is required</span>}

                                <Input
                                    size="lg"
                                    type="email"
                                    label="Restaurant Email"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && <span className="text-red-500 text-sm">This field is required</span>}

                                <Input
                                    size="lg"
                                    type="text"
                                    label="Restaurant Address"
                                    {...register("restaurantAddress", { required: true })}
                                />
                                {errors.restaurantAddress && <span className="text-red-500 text-sm">This field is required</span>}

                                <Input
                                    size="lg"
                                    type="number"
                                    label="Restaurant Number"
                                    {...register("phoneNumber", { required: true })}
                                />
                                {errors.phoneNumber && <span className="text-red-500 text-sm">This field is required</span>}

                                <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"} label="Password"
                                            className="border border-gray-300 rounded-lg p-2 pr-10 w-full"
                                            placeholder="********"
                                            {...register("password", { required: true, minLength: 6, maxLength: 8 })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5 text-[#1ad46d]" /> : <Eye className="w-5 h-5 text-[#1ad46d]" />}
                                        </button>
                                    </div>
                                        {errors.password?.type && <span className="text-[#ff1818] ">This field is reqiure</span>}
                                        {errors.password?.type === 'minLength' && <span className="text-[#ff1818] ">This pass must 6 Characters</span>}
                                        {errors.password?.type === 'maxLength' && <span className="text-[#ff1818] ">This pass only 8 Characters</span>}
                                  
                                <div className="">
                                    {/* <label className="label">
                                        <span className="label-text text-red-500 font-extrabold ml-4">Logo Should be 300×300</span>
                                    </label> */}
                                    {/* <input
                                        type="file"
                                        accept="image/*"
                                        {...register("photo", { required: true })}
                                        className="file-input file-input-ghost"
                                    />
                                    {errors.photo && <span className="text-red-500 text-sm">Logo is required</span>}

                                    <label className="label">
                                        <span className="label-text text-red-500 font-extrabold ml-4">Banner Should be 1080×1080</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register("banner", { required: true })}
                                        className="file-input file-input-ghost"
                                    />
                                    {errors.banner && <span className="text-red-500 text-sm ml-2">Banner is required</span>} */}
                                </div>
                            </div>

                            <button
                                className="w-full uppercase bg-[#339179] text-white mt-2 btn rounded-badge"
                                type="submit"
                            >
                                Submit Request
                            </button>
                        </form>

                        <Typography color="gray" className="mt-4 text-center font-normal">
                            Already have an account?{" "}
                            <a href="/login" className="font-medium text-gray-900">
                                Sign up
                            </a>
                        </Typography>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RestaurantRegister;
