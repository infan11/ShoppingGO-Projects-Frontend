// Users.jsx
import useAllUserHooks from "../../Hooks/useAllUserHooks";
import { MdOutlineAdminPanelSettings, MdOutlineRestaurant } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Input } from "@material-tailwind/react";
import { useMotionValue, useSpring } from "framer-motion";

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

const Users = () => {
  const [users, , refetch] = useAllUserHooks();
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const axiosSecure = useAxiosSecure();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState("");

  const TABLE_HEAD = ["Information",  "Action",  "Role"];

  const filteredUsers = users.filter((user) => {
    const userSearch =
      user.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchInput.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "admin" && user?.role === "admin") ||
      (activeTab === "moderator" && user?.role === "moderator") ||
      (activeTab === "owner" && user?.role === "owner");

    return userSearch && matchesTab;
  });

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/users/${userId}`)
          .then(() => {
            refetch();
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete the user.", "error");
          });
      }
    });
  };

  const updateRole = (userId, role) => {
    axiosSecure
      .patch(`/users/${role}/${userId}`)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          toast.success(`Successfully updated to ${role.charAt(0).toUpperCase() + role.slice(1)}`);
        }
      })
      .catch(() => {
        toast.error("Failed to update user role");
      });
  };

  return (
    <div className="max-w-7xl mx-auto min-h-full">
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[#339179] mt-4">
          Manage Users{" "}
          <CountUp
            from={0}
            to={users.length}
            separator=","
            duration={2}
            className="text-4xl font-bold text-center text-[#339179]"
          />
        </h2>

        <div className="w-full px-4 md:w-64">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute h-3 w-3 text-[#339179] top-3 left-4" />
            <Input
              type="text"
              className="input input-bordered w-full pl-10 text-[#339179] font-bold"
              placeholder="Search users..."
              value={searchInput}
              label="Search Users"
              color="red"
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="tabs mb-4 flex justify-center md:justify-start">
        {["all", "admin", "moderator", "owner"].map((tab) => (
          <button
            key={tab}
            className={`tab ${
              activeTab === tab
                ? "tab-active bg-red-800 text-white font-bold rounded-full shadow-2xl"
                : "text-red-900 font-extrabold"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-auto shadow-lg rounded-lg border">
        <table className="table-auto w-full">
          <thead className="bg-gray-100">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-4 py-2 text-[14px] text-[#339179] tracking-wide text-center"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(({ _id, name, email, role, photo, isNew, restaurantNumber, restaurantAdddress }) => (
                <tr key={_id}>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center space-x-3">
                      <div className="indicator">
                        {isNew && <span className="indicator-item badge badge-primary">New</span>}
                        <img
                          src={photo || "https://i.ibb.co.com/PGwHS087/profile-Imagw.jpg"}
                          alt={`${name}'s photo`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p>{name}</p>
                        <a href={`mailto:${email}`} className="text-sm underline text-blue-700">{email}</a>
                        <p className="text-sm text-gray-500">{restaurantAdddress}</p>
                        <a href={`tel:${restaurantNumber}`} className="text-sm underline text-blue-700">{restaurantNumber}</a>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-2 border text-center">
                    <button className="text-xl font-extrabold shadow-2xl" onClick={() => handleDelete(_id)}>
                      <AiOutlineUserDelete />
                    </button>
                  </td>
                
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => {
                        setSelectedUserId(_id);
                        setSelectedUserRole(role);
                        document.getElementById("role_modal").showModal();
                      }}
                    >
                      {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Set Role"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                className={`btn ${
                  selectedUserRole === roleOption ? "btn-success text-white" : "btn-outline"
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
