import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  RiAdminLine,
  RiShoppingBag4Line,
  RiHome9Line,
} from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserSearch } from "react-icons/lu";
import { MdOutlineAddModerator } from "react-icons/md";
import { PiContactlessPaymentLight } from "react-icons/pi";
import { IoMdLogIn } from "react-icons/io";
import { HiLogout } from "react-icons/hi";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";
import { IoSparklesSharp } from "react-icons/io5";
// import Darkmode from "../../Darkmode/Darkmode";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const noNavbarFooter = ["/dashboard/paymentSuccess"].includes(location.pathname);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItemClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-900 hover:text-white transition-all";

  const handleLogout = () => {
    logout().then(() => {});
  };

  const roleMenus = () => {
    if (isAdmin) {
      return [
        { to: "/dashboard/adminHome", icon: <RiAdminLine />, label: "Admin Home" },
        { to: "/dashboard/users", icon: <LuUserSearch />, label: "All Users" },
        { to: "/dashboard/myOrder", icon: <RiShoppingBag4Line />, label: "My Order" },
        { to: "/dashboard/uploadInfo", icon: <FaRegUser />, label: "Upload Info" },
        { to: "/dashboard/addDistrictCollection", icon: <FaRegUser />, label: "Add District Collection" },
        { to: "/dashboard/paymentHistory", icon: <PiContactlessPaymentLight />, label: "Payment History" },
        { to: "/dashboard/userHome", icon: <FaRegUser />, label: "User Home" },
      ];
    } else if (isModerator) {
      return [
        { to: "/dashboard/moderator", icon: <MdOutlineAddModerator />, label: "Moderator Home" },
        { to: "/dashboard/ownerHome", icon: <FaRegUser />, label: "Owner Home" },
        { to: "/dashboard/uploadInfo", icon: <FaRegUser />, label: "Upload Info" },
        { to: "/dashboard/myOrder", icon: <RiShoppingBag4Line />, label: "My Order" },
        { to: "/dashboard/paymentHistory", icon: <PiContactlessPaymentLight />, label: "Payment History" },
        { to: "/dashboard/userHome", icon: <FaRegUser />, label: "User Home" },
      ];
    } else if (isOwner) {
      return [
        { to: "/dashboard/ownerHome", icon: <FaRegUser />, label: "Owner Home" },
        { to: "/dashboard/uploadInfo", icon: <FaRegUser />, label: "Upload Info" },
        { to: "/dashboard/myOrder", icon: <RiShoppingBag4Line />, label: "My Order" },
        { to: "/dashboard/paymentHistory", icon: <PiContactlessPaymentLight />, label: "Payment History" },
      ];
    } else {
      return [
        { to: "/dashboard/userHome", icon: <FaRegUser />, label: "User Home" },
        { to: "/dashboard/myOrder", icon: <RiShoppingBag4Line />, label: "My Order" },
        { to: "/dashboard/paymentHistory", icon: <PiContactlessPaymentLight />, label: "Payment History" },
      ];
    }
  };

  return (
    <div className="flex min-h-screen">
      {!noNavbarFooter && (
        <div
          className={`${
            collapsed ? "w-20" : "w-64"
          } bg-[#339179] text-white rounded-r-3xl transition-all duration-300 p-4 flex flex-col`}
        >
          <button
            onClick={toggleSidebar}
            className="text-white text-xl  text-center mb-4 focus:outline-none"
          >
            {collapsed ? <IoSparklesSharp /> : <IoSparklesSharp />}
          </button>
       
          <nav className="flex flex-col gap-2">
            {roleMenus().map(({ to, icon, label }) => (
              <Link key={to} to={to} className={menuItemClass}>
                {icon} {!collapsed && label}
              </Link>
            ))}
            <div className="border-t border-white my-4"></div>
            <Link to="/" className={menuItemClass}>
              <RiHome9Line /> {!collapsed && "Home"}
            </Link>
            <div className="mt-auto pt-6">
              <div className="mb-4">
                {/* <Darkmode /> */}
              </div>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-white text-[#339179] w-full py-2 rounded-full flex items-center justify-center gap-2"
                >
                  <HiLogout /> {!collapsed && "Logout"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-[#339179] w-full py-2 rounded-full flex items-center justify-center gap-2"
                >
                  <IoMdLogIn /> {!collapsed && "Login"}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
      <main className="flex-1 bg-gray-100 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
