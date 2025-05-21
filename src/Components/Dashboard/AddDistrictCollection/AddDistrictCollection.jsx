import { useState, useContext, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Provider/AuthProvider/AuthProvider";
import { imageUpload } from "../../Hooks/imageHooks";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { Spinner } from "@material-tailwind/react";

const AddDistrictCollection = () => {
    const { user } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const axiosSecure = useAxiosSecure();

    const handleImageClick = () => fileInputRef.current.click();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        let imageUrl = previewImage;

        if (selectedFile) {
            try {
                const imageData = await imageUpload(selectedFile);
                imageUrl = imageData?.data?.display_url || "";
            } catch (error) {
                console.error("Image upload failed:", error);
                toast.error("Image upload failed");
                setLoading(false);
                return;
            }
        }

        const district = {
            photo: imageUrl || "https://i.ibb.co.com/HL4RKtR3/cox-sbazar.jpg",
            districtName: data.districtName,
        };

        axiosSecure.post("/districtAvailable", district)
            .then(res => {
                if (res.data.insertedId) {
                    toast.success("District uploaded successfully!");
                    navigate("/");
                } else {
                    toast.error("Failed to upload district.");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error uploading district:", error);
                toast.error("Something went wrong.");
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e0f7fa] to-[#e0f2f1] p-6">
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-xl rounded-2xl shadow-2xl bg-white/70 backdrop-blur-md border border-gray-200 p-8"
            >
                {/* Image Upload */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                    <img
                        className="w-full h-full rounded-full object-cover border-4 border-gray-200 shadow-md cursor-pointer hover:opacity-80 transition"
                        src={previewImage || "https://i.ibb.co.com/HL4RKtR3/cox-sbazar.jpg"}
                        alt="Profile"
                        onClick={handleImageClick}
                    />
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 hover:opacity-100 transition duration-300 cursor-pointer"
                        onClick={handleImageClick}
                    >
                        <IoCloudUploadOutline className="text-2xl" />
                    </div>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* District Dropdown */}
                <label className="block text-gray-700 font-semibold mb-2">Select District</label>
                <select
                    {...register("districtName", { required: "District selection is required" })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339179]"
                    defaultValue=""
                >
                    <option value="" disabled>Select a district</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Faridpur">Faridpur</option>
                    <option value="Gazipur">Gazipur</option>
                    <option value="Cox'sbazar">Cox'sbazar</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Rangpur">Rangpur</option>
                    {/* Add the rest as needed */}
                </select>
                {errors.districtName && (
                    <p className="text-red-500 mt-2 text-sm">{errors.districtName.message}</p>
                )}

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-[#339179] text-white font-semibold shadow-md transition transform hover:scale-105 active:scale-95 relative"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Spinner className="h-5 w-5" />
                                Uploading...
                            </div>
                        ) : (
                            "Upload District"
                        )}
                    </button>
                </div>
            </motion.form>
        </div>
    );
};

export default AddDistrictCollection;
