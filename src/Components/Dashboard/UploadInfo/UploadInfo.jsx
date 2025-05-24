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
import Select from 'react-select';

const UploadInfo = () => {
    const { updateUserProfile, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosSecure = useAxiosSecure();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewBanner, setPreviewBanner] = useState(null);

    // React-select category states
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    // const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const {
        register, handleSubmit, formState: { errors },
    } = useForm({
        defaultValues: {
            shopName: user?.displayName || "",
            email: user?.email || ""
        },
    });

    const categoryOptions = [
        { value: 'food', label: ' Food & Grocery' },
        { value: 'fashion', label: ' Fashion' },
        { value: 'electronics', label: ' Electronics' },
        { value: 'home', label: 'Home & Living' },
        { value: 'beauty', label: ' Beauty & Health' },
        { value: 'baby', label: ' Baby & Toys' },
        { value: 'auto', label: ' Auto & Tools' },
        { value: 'books', label: ' Books & Stationery' },
        { value: 'pets', label: ' Pets' },
        { value: 'hobbies', label: ' Hobbies & Sports' },
        { value: 'modern', label: ' Trending & Featured' },
    ];

    //   const subCategoryMap = {
    //     food: [
    //       { value: 'fresh', label: 'Fresh Produce' },
    //       { value: 'snacks', label: 'Snacks & Beverages' },
    //       { value: 'dairy', label: 'Dairy & Eggs' },
    //       { value: 'bakery', label: 'Bakery' },
    //       { value: 'organic', label: 'Organic & Health Foods' },
    //     ],
    //     fashion: [
    //       { value: 'mens', label: "Men's Clothing" },
    //       { value: 'womens', label: "Women's Clothing" },
    //       { value: 'kids', label: "Kids & Baby Clothing" },
    //       { value: 'shoes', label: "Shoes" },
    //       { value: 'bags', label: "Bags & Accessories" },
    //       { value: 'watches', label: "Watches & Jewelry" },
    //     ],
    //     electronics: [
    //       { value: 'smartphones', label: 'Smartphones & Accessories' },
    //       { value: 'laptops', label: 'Laptops & Computers' },
    //       { value: 'tv', label: 'TVs & Home Entertainment' },
    //       { value: 'cameras', label: 'Cameras & Drones' },
    //       { value: 'gaming', label: 'Gaming & Consoles' },
    //       { value: 'smart_home', label: 'Smart Home Devices' },
    //     ],
    //     home: [
    //       { value: 'furniture', label: 'Furniture' },
    //       { value: 'decor', label: 'Home Decor' },
    //       { value: 'kitchen', label: 'Kitchen & Dining' },
    //       { value: 'bed_bath', label: 'Bed & Bath' },
    //       { value: 'lighting', label: 'Lighting' },
    //       { value: 'tools', label: 'Tools & Hardware' },
    //     ],
    //     beauty: [
    //       { value: 'skincare', label: 'Skincare' },
    //       { value: 'haircare', label: 'Hair Care' },
    //       { value: 'makeup', label: 'Makeup' },
    //       { value: 'personal_care', label: 'Personal Care' },
    //       { value: 'wellness', label: 'Health & Wellness' },
    //       { value: 'supplements', label: 'Supplements' },
    //     ],
    //     baby: [
    //       { value: 'essentials', label: 'Baby Essentials' },
    //       { value: 'diapers', label: 'Diapers & Wipes' },
    //       { value: 'toys', label: 'Toys & Games' },
    //       { value: 'education', label: 'Learning & Education' },
    //     ],
    //     auto: [
    //       { value: 'car', label: 'Car Accessories' },
    //       { value: 'motorbike', label: 'Motorbike Gear' },
    //       { value: 'equipment', label: 'Tools & Equipment' },
    //       { value: 'fluids', label: 'Oils & Fluids' },
    //     ],
    //     books: [
    //       { value: 'fiction', label: 'Fiction & Non-fiction' },
    //       { value: 'education', label: 'Educational Books' },
    //       { value: 'office', label: 'Office Supplies' },
    //       { value: 'notebooks', label: 'Notebooks & Journals' },
    //     ],
    //     pets: [
    //       { value: 'food', label: 'Pet Food' },
    //       { value: 'toys', label: 'Pet Toys' },
    //       { value: 'grooming', label: 'Grooming Products' },
    //       { value: 'accessories', label: 'Accessories' },
    //     ],
    //     hobbies: [
    //       { value: 'fitness', label: 'Fitness Equipment' },
    //       { value: 'outdoor', label: 'Outdoor Gear' },
    //       { value: 'instruments', label: 'Musical Instruments' },
    //       { value: 'crafts', label: 'Arts & Crafts' },
    //     ],
    //     modern: [
    //       { value: 'bestsellers', label: 'Best Sellers' },
    //       { value: 'trending', label: 'Trending Now' },
    //       { value: 'deals', label: 'Deals & Discounts' },
    //       { value: 'new', label: 'New Arrivals' },
    //       { value: 'brands', label: 'Featured Brands' },
    //     ]
    //   };

    // const subCategoryOptions = selectedMainCategory
    //     ? subCategoryMap[selectedMainCategory.value] || []
    //     : [];

    const onSubmit = async (data) => {
        const logo = data.photo?.[0];
        const banner = data.banner?.[0];

        if (!logo || !banner) {
            toast.error("Please upload both logo and banner images.");
            return;
        }

        // if (!selectedSubCategory) {
        //     toast.error("Please select a sub-category.");
        //     return;
        // }

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
                shopCategory: selectedMainCategory.label,
                districtName: data.districtName,
                photo: logoData?.data?.display_url || "",
                banner: bannerData?.data?.display_url || "",
                createDate: new Date()
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
        <div className="min-h-screen flex items-center justify-center px-4 py-10  font-kanit">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl bg-white/80 backdrop-blur-md shadow-2xl rounded-xl p-8 md:p-10 border border-white/40"
            >
                <h2 className="text-2xl md:text-2xl font-Kanit font-bold text-center text-[#339179] mb-8 tracking-wide">
                    Add Your Shop
                </h2>
                {isSubmitting ? (
                    <Skeleton height={500} count={1} />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[#339179] font-medium mb-1">Shop Name</label>
                                <input
                                    type="text"
                                    {...register("shopName", { required: true })}
                                    className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#339179] focus:ring-2 focus:ring-[#339179] outline-none"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-[#339179] font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#339179] focus:ring-2 focus:ring-[#339179] outline-none"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#339179] font-medium mb-1">Shop Address</label>
                            <input
                                type="text"
                                {...register("shopAddress", { required: true })}
                                className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#339179] focus:ring-2 focus:ring-[#339179] outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-5">

                            <div className="">
                                <label className="block text-[#339179] font-medium mb-1">Shop Number</label>
                                <input
                                    type="number"
                                    {...register("shopMobileNumber", { required: true })}
                                    className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#339179] focus:ring-2 focus:ring-[#339179] outline-none"
                                />
                            </div>
                            <div className="" >
                                <label className="block text-[#339179] font-medium mb-1">Main Category</label>
                                <Select
                                    placeholder="Select Main Category"
                                    options={categoryOptions}
                                    value={selectedMainCategory}
                                    onChange={setSelectedMainCategory}
                                    isClearable
                                    className="w-full text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            {/* <label className="block text-[#339179] font-medium mb-1">Sub Category</label> */}
                            {/* <Select
                                placeholder="Select Sub Category"
                                options={subCategoryOptions}
                                value={selectedSubCategory}
                                onChange={setSelectedSubCategory}
                                isClearable
                                isDisabled={!selectedMainCategory}
                                className='w-full text-[#339179]'
                            /> */}
                        </div>

                        <div>
                            <label className="block text-[#339179] font-medium mb-1">District</label>
                            <select
                                {...register("districtName", { required: true })}
                                defaultValue=""
                                className="w-full px-4 py-2 border border-[#bcd9d4] rounded-lg bg-white/50 backdrop-blur-md text-[#339179] focus:ring-2 focus:ring-[#339179] outline-none"
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

                        <div className="flex justify-between gap-6">
                            <div className="w-1/2">
                                <label className="block text-[#339179] text-sm mb-1">Upload Logo (300×300)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("photo", { required: true })}
                                    onChange={(e) => handleImagePreview(e, setPreviewLogo)}
                                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#339179] file:text-white hover:file:bg-[#339179] cursor-pointer"
                                />
                                {previewLogo && (
                                    <img src={previewLogo} alt="Logo Preview" className="h-24 mt-3 rounded-lg shadow-md border border-gray-300" />
                                )}
                            </div>

                            <div className="w-1/2">
                                <label className="block text-[#339179] text-sm mb-1">Upload Banner (400×250)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("banner", { required: true })}
                                    onChange={(e) => handleImagePreview(e, setPreviewBanner)}
                                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#339179] file:text-white hover:file:bg-[#339179] cursor-pointer"
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
                            className="w-full py-3 mt-6 rounded-xl text-white bg-[#3b7861] hover:bg-[#339179] font-semibold tracking-wide shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
