import useAllUserHooks from "../../Hooks/useAllUserHooks";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Input } from "@material-tailwind/react";
import { useMotionValue, useSpring, motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CountUp = ({ to, from = 0, duration = 2, separator = ",", className = "" }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };
        const formattedNumber = Intl.NumberFormat("en-US", options).format(latest.toFixed(0));
        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });
    motionValue.set(to);
    return () => unsubscribe();
  }, [springValue, to, separator, motionValue]);

  return <span className={className} ref={ref} />;
};

const UserSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border rounded-lg animate-pulse bg-white">
    <div className="w-10 h-10 bg-gray-300 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const Users = () => {
  const [users, isLoading, refetch] = useAllUserHooks();
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const axiosSecure = useAxiosSecure();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState("");

  const TABLE_HEAD = ["Information", "Action", "Role"];

  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
  );

  const filteredUsers = sortedUsers.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchInput.toLowerCase());

    const matchTab =
      activeTab === "all" ||
      (activeTab === "admin" && user.role === "admin") ||
      (activeTab === "moderator" && user.role === "moderator") ||
      (activeTab === "owner" && user.role === "owner");

    return matchSearch && matchTab;
  });

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "User will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#339179",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${userId}`).then(() => {
          refetch();
          toast.success("User deleted successfully.");
        });
      }
    });
  };

  const updateRole = (userId, role) => {
    const apiRole = role === "owner" ? "restaurantOwner" : role;
    axiosSecure.patch(`/users/${apiRole}/${userId}`).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetch();
        toast.success(`Role updated to ${role}`);
      }
    });
  };

  return (
    <div className="p-4 font-Kanit">
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-[#339179] flex items-center gap-2">
          Manage Users{" "}
          <CountUp
            from={0}
            to={users.length}
            separator=","
            duration={2}
            className="text-4xl font-bold text-[#339179]"
          />
        </h2>

        <div className="w-full md:w-60 relative">
          <MagnifyingGlassIcon className="absolute h-4 w-4 text-[#339179] top-3 left-4" />
          <Input
            type="text"
            className="pl-10 text-[#339179] font-semibold"
            placeholder="Search users..."
            label="Search Users"
            color="green"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {["all", "admin", "moderator", "owner"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1 rounded-full transition ${activeTab === tab
                ? "bg-[#339179] text-white font-bold"
                : "bg-white text-[#339179] border border-[#339179]"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <UserSkeleton key={i} />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No users found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
          <Link >
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 border rounded-xl bg-white shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.photo || "https://i.ibb.co/PGwHS087/profile-Imagw.jpg"}
                  className="w-14 h-14 rounded-full object-cover"
                  alt="profile"
                />
                <div>
                  <Link to={`/dashboard/users/${user._id}`}><p className="font-semibold text-lg underline">{user.name}</p></Link>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-white rounded-full bg-[#339179] text-center px-5">

                  </p>
                  {user.date && (
                    <p className="text-sm  text-[#339179]  ">
                      {new Date(user.date).toLocaleString()}
                    </p>
                  )}
                  {user.address && (
                    <p className="text-xs text-gray-500">{user.address}</p>
                  )}
                  {user.shopMobileNumber && (
                    <a href={`tel:${user.shopMobileNumber}`} className="text-xs text-blue-700">
                      {user.shopMobileNumber}
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="btn btn-sm btn-outline text-red-500 hover:bg-red-100"
                  onClick={() => handleDelete(user._id)}
                >
                  <AiOutlineUserDelete />
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setSelectedUserId(user._id);
                    setSelectedUserRole(user.role);
                    document.getElementById("role_modal").showModal();
                  }}
                >
                  {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Set Role"}
                </button>
              </div>
            </motion.div>
          </Link>
          ))}
        </div>
      )}

      {/* Role Modal */}
      <dialog id="role_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Select Role</h3>
          <div className="flex flex-col gap-2">
            {["user", "admin", "moderator", "owner"].map((roleOption) => (
              <button
                key={roleOption}
                className={`btn ${selectedUserRole === roleOption ? "btn-success text-white" : "btn-outline"
                  }`}
                disabled={selectedUserRole === roleOption}
                onClick={() => {
                  updateRole(selectedUserId, roleOption);
                  document.getElementById("role_modal").close();
                }}
              >
                Make {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Users;
