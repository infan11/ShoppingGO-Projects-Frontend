import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { imageUpload } from '../../Hooks/imageHooks';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { motion } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const UploadInfo = () => {
    const { updateUserProfile, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosSecure = useAxiosSecure();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewBanner, setPreviewBanner] = useState(null);

    const {
        register, handleSubmit, formState: { errors },
    } = useForm({
        defaultValues: {
            shopName: user?.displayName || "",
            email: user?.email || ""
        },
    });

    const onSubmit = async (data) => {
        const logo = data.photo?.[0];
        const banner = data.banner?.[0];

        if (!logo || !banner) {
            toast.error("Please upload both logo and banner images.");
            return;
        }

        try {
            setIsSubmitting(true);

            const validateImage = (file, maxWidth, maxHeight) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            if (img.width > maxWidth || img.height > maxHeight) {
                                reject(`Image must not exceed ${maxWidth}x${maxHeight}px.`);
                            } else resolve();
                        };
                        img.onerror = () => reject("Invalid image file.");
                        img.src = e.target.result;
                    };
                    reader.onerror = () => reject("File reading error.");
                    reader.readAsDataURL(file);
                });

            await validateImage(logo, 300, 300);
            await validateImage(banner, 400, 250);

            const logoData = await imageUpload(logo);
            const bannerData = await imageUpload(banner);

            await updateUserProfile(data.shopName, logoData?.data?.display_url || "");

            const usersInfo = {
                shopName: data.shopName,
                email: data.email,
                shopAddress: data.shopAddress,
                shopMobileNumber: parseFloat(data.shopMobileNumber),
                shopCategory: data.shopCategory,
                districtName: data.districtName,
                photo: logoData?.data?.display_url || "",
                banner: bannerData?.data?.display_url || "",
            };

            await toast.promise(
                axiosSecure.post("/sellerProfile", usersInfo),
                {
                    loading: 'Submitting...',
                    success: 'Shop successfully added!',
                    error: 'Could not save shop info.',
                }
            );

            navigate("/shop");
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImagePreview = (e, setImage) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#d4f1f4]  font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl bg-white/80 backdrop-blur-md shadow-2xl rounded-xl p-8 md:p-10 border border-white/40"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center text-[#3b6978] mb-8 tracking-wide">
                    Add Your Shop
                </h2>
                {isSubmitting ? (
                    <Skeleton height={500} count={1} />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[#204051] font-medium mb-1">Shop Name</label>
                                <input
                                    type="text"
                                    {...register("shopName", { required: true })}
                                    className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#204051] focus:ring-2 focus:ring-[#3b6978] outline-none"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-[#204051] font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#204051] focus:ring-2 focus:ring-[#3b6978] outline-none"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#204051] font-medium mb-1">Shop Address</label>
                            <input
                                type="text"
                                {...register("shopAddress", { required: true })}
                                className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#204051] focus:ring-2 focus:ring-[#3b6978] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[#204051] font-medium mb-1">Shop Number</label>
                            <input
                                type="number"
                                {...register("shopMobileNumber", { required: true })}
                                className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#204051] focus:ring-2 focus:ring-[#3b6978] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[#204051] font-medium mb-1">Shop Category</label>
                            <select
                                {...register("shopCategory", { required: true })}
                                className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#204051] focus:ring-2 focus:ring-[#3b6978] outline-none"
                            >
                                <option value="" disabled>Choose a Category</option>
                                <option>Biryani</option>
                                <option>Pizza</option>
                                <option>Burger</option>
                                <option>Cake</option>
                                <option>Chicken</option>
                                <option>Juice</option>
                                <option>Beef</option>
                                <option>Chinese</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[#204051] font-medium mb-1">District</label>
                            <select
                                {...register("districtName", { required: true })}
                                defaultValue=""
                                className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#204051] focus:ring-2 focus:ring-[#3b6978] outline-none"
                            >
                                <option value="" disabled>Select District</option>
                                <option>Dhaka</option>
                                <option>Chittagong</option>
                                <option>Khulna</option>
                                <option>Sylhet</option>
                                <option>Barishal</option>
                                <option>Rajshahi</option>
                                <option>Rangpur</option>
                                <option>Mymensingh</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[#204051] font-medium mb-1">Upload Logo (300×300)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("photo", { required: true })}
                                    onChange={(e) => handleImagePreview(e, setPreviewLogo)}
                                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#3b6978] file:text-white hover:file:bg-[#204051] cursor-pointer"
                                />
                                {previewLogo && (
                                    <img src={previewLogo} alt="Logo Preview" className="h-24 mt-3 rounded-lg shadow-md border border-gray-300" />
                                )}
                            </div>

                            <div>
                                <label className="block text-[#204051] font-medium mb-1">Upload Banner (400×250)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("banner", { required: true })}
                                    onChange={(e) => handleImagePreview(e, setPreviewBanner)}
                                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#3b6978] file:text-white hover:file:bg-[#204051] cursor-pointer"
                                />
                                {previewBanner && (
                                    <img src={previewBanner} alt="Banner Preview" className="h-24 mt-3 rounded-lg shadow-md border border-gray-300" />
                                )}
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 mt-6 rounded-xl text-white bg-[#3b7861] hover:bg-[#204051] font-semibold tracking-wide shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Add Your Shop"}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default UploadInfo;
