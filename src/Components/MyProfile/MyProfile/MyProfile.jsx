import { useState, useContext, useRef, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Provider/AuthProvider/AuthProvider";
import { imageUpload } from "../../Hooks/imageHooks";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaCamera, FaExpand, FaPhotoVideo } from "react-icons/fa";

const MyProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: "",
    photoURL: "",
    dob: "",
    phoneNumber: "",
    address: ""
  });
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cameraMode, setCameraMode] = useState(false); // true = use camera
  const [showImageModal, setShowImageModal] = useState(false);
  // Read from localStorage to preserve form visibility
  const [isFormVisible, setIsFormVisible] = useState(() => {
    const saved = localStorage.getItem("isFormVisible");
    return saved === "false" ? false : true;
  });

  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axiosSecure.get(`/users/${id}`)
        .then(res => {
          const data = res.data.profileData || res.data;
          setProfileData({
            name: data.name || "",
            photoURL: data.photo || "",
            dob: data.dob || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || ""
          });
          setPreviewImage(data.photo || "");
        })
        .catch(() => {
          toast.error("Failed to load user data");
        });
    } else if (user) {
      setProfileData({
        name: user.displayName || "",
        photoURL: user.photoURL || "",
        dob: user.dob || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || ""
      });
      setPreviewImage(user.photoURL || "");
    }
  }, [id, user, axiosSecure]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please select a valid image file (JPEG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const imageData = await imageUpload(file);
      return {
        success: true,
        url: imageData?.data?.display_url || ""
      };
    } catch (error) {
      console.error("Image upload error:", error);
      return {
        success: false,
        message: "Image upload failed"
      };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateUserProfileData = async (data) => {
    try {
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photo
      });

      const userInfo = {
        name: data.name,
        photo: data.photo,
        email: user.email,
        dob: data.dob,
        phoneNumber: data.phoneNumber,
        address: data.address
      };

      const response = await axiosSecure.put(`/users/${user.email}`, userInfo);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update database");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const { name, dob, phoneNumber, address } = profileData;
    const email = user?.email;

    if (!email) {
      toast.error("Authentication error. Please log in again.");
      setIsUpdating(false);
      return;
    }

    try {
      if (name.length < 3) {
        throw new Error("Name must be at least 3 characters");
      }

      let imageUrl = profileData.photoURL;
      if (selectedFile) {
        const uploadResult = await handleImageUpload(selectedFile);
        if (!uploadResult.success) {
          throw new Error(uploadResult.message);
        }
        imageUrl = uploadResult.url;
      }

      const result = await updateUserProfileData({
        name,
        photo: imageUrl,
        dob,
        phoneNumber,
        address
      });

      if (result.success) {
        toast.success("Profile updated successfully!");
        setSelectedFile(null);
        setProfileData({
          name,
          photoURL: imageUrl,
          dob,
          phoneNumber,
          address
        });
        setPreviewImage(imageUrl);
        setIsFormVisible(false);
        localStorage.setItem("isFormVisible", "false");
      } else {
        throw new Error(result.message || "Update completed with issues");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#d4eaf7] py-10 px-4">
      <div className="w-full max-w-xl bg-white bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl p-10">
        {/* <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Update Your Profile</h2> */}

        <div
  className="relative w-40 h-40 mx-auto mb-6 group cursor-pointer overflow-hidden rounded-full border-4 border-[#1da335] shadow-md"
>
  <img
    src={previewImage || "https://i.ibb.co/PGwHS087/profile-Imagw.jpg"}
    alt="Profile"
    className="w-full h-full object-cover rounded-full"
  />

  {/* Hover overlay with options */}
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300">

    {/* Camera Upload */}
    <button
      onClick={() => {
        setCameraMode(true);
        handleImageClick();
      }}
      className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm hover:bg-opacity-40"
    >
        <FaPhotoVideo className="inline-block mr-1" />
  
    </button>

    {/* Gallery Upload */}
    <button
      onClick={() => {
        setCameraMode(false);
        handleImageClick();
      }}
      className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm hover:bg-opacity-40"
    >
   
      <FaCamera className="inline-block mr-1" />
  
    </button>

    {/* See Image (only after upload) */}
    {previewImage && (
      <button
        onClick={() => setShowImageModal(true)}
        className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm hover:bg-opacity-40"
      >
        <FaExpand className="inline-block mr-1" />
        
      </button>
    )}
  </div>

  {/* Hidden file input for camera or photo selection */}
  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleImageChange}
    className="hidden"
    capture={cameraMode ? "environment" : undefined} // sets camera if cameraMode === true
    name="photo"
  />
</div>

        {isFormVisible ? (
          <form onSubmit={handleUpdate} className="space-y-5">
            <input
              type="email"
              name="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-md"
            />

            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              required
              minLength={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="date"
              name="dob"
              value={profileData.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />

            <input
              type="tel"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />

            <textarea
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Your Address"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />

            <button
              type="submit"
              disabled={isUpdating}
              className={`w-full py-3 bg-[#1da335] text-white font-semibold rounded-md shadow-lg transition duration-300 ${
                isUpdating ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold">{profileData.name}</p>
            {/* <p>Date of Birth: {profileData.dob || "N/A"}</p>
            <p>Phone: {profileData.phoneNumber || "N/A"}</p>
            <p>Address: {profileData.address || "N/A"}</p> */}

            <button
              onClick={() => {
                setIsFormVisible(true);
                localStorage.setItem("isFormVisible", "true");
              }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Edit Profile
            </button>
          </div>
        )}
        
      </div>
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={previewImage}
            alt="Full Preview"
            className="max-w-4xl max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
   
    </div>
  );
};

export default MyProfile;
