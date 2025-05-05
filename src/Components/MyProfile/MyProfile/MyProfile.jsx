import { useState, useContext, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Provider/AuthProvider/AuthProvider";
import { imageUpload } from "../../Hooks/imageHooks";

const MyProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(user?.photoURL || "");
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
  
    if (name !== user?.displayName) {
      try {
        const res = await fetch(
          `http://localhost:5000/users/check-name?name=${encodeURIComponent(name)}&email=${encodeURIComponent(user?.email)}`
        );
        if (!res.ok) throw new Error("Server error while checking name");
        const data = await res.json();
  
        if (data.exists) {
          toast.error("This name is already taken.");
          return;
        }
      } catch (error) {
        console.error("Name check failed:", error);
        toast.error("Failed to validate name.");
        return;
      }
    }
  
    let imageUrl = profileImage;
  
    if (selectedFile) {
      try {
        const imageData = await imageUpload(selectedFile);
        imageUrl = imageData?.data?.display_url || "";
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed");
        return;
      }
    }
  
    handleUpdateUser(name, imageUrl);
  };
  const handleUpdateUser = (name, photo) => {
    updateUserProfile({ displayName: name, photoURL: photo })
      .then(() => {
        setProfileImage(photo);
        setPreviewImage("");
        setSelectedFile(null);
        toast.success("Profile Updated Successfully");
        navigate("/myProfile");
      })
      .catch((error) => {
        console.error("Update profile error:", error);
        toast.error("Failed to update profile");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#d4eaf7] py-10">
      <div className="w-full max-w-xl bg-white bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Update Your Profile</h2>

        {/* Profile Picture */}
        <div className="relative w-40 h-40 mx-auto mb-6 group">
          <img
            src={previewImage || profileImage || "https://i.ibb.co.com/PGwHS087/profile-Imagw.jpg"}
            alt="Profile"
            onClick={handleImageClick}
            className="w-full h-full rounded-full object-cover border-4 border-[#1da335] shadow-md cursor-pointer group-hover:opacity-70 transition duration-300"
          />
          <div
            onClick={handleImageClick}
            className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full transition duration-300 cursor-pointer"
          >
            <IoCloudUploadOutline className="text-3xl" />
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            name="email"
            defaultValue={user?.email}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Name */}
          <input
            type="text"
            name="name"
            defaultValue={user?.displayName}
            placeholder="Type your name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#1da335] text-white font-semibold rounded-md shadow-lg hover:opacity-90 transition duration-300"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
