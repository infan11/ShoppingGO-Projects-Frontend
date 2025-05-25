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
import { IoSparklesSharp, IoClose } from "react-icons/io5";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantseller from "../../Hooks/useSeller";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isSeller] = useRestaurantseller();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const noNavbarFooter = ["/dashboard/paymentSuccess"].includes(location.pathname);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout().then(() => {});
  };

  const menuItemClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white hover:text-[#339179] font-medium transition-all duration-200";

  const roleMenus = () => {
    if (isAdmin) {
      return [
        { to: "/dashboard/adminHome", icon: <RiAdminLine />, label: "Admin Home" },
        { to: "/dashboard/users", icon: <LuUserSearch />, label: "All Users" },
        { to: "/dashboard/myOrder", icon: <RiShoppingBag4Line />, label: "My Order" },
        { to: "/dashboard/uploadInfo", icon: <FaRegUser />, label: "Upload Info" },
        { to: "/dashboard/addDistrictCollection", icon: <FaRegUser />, label: "Add District" },
        { to: "/dashboard/paymentHistory", icon: <PiContactlessPaymentLight />, label: "Payment History" },
        { to: "/dashboard/userHome", icon: <FaRegUser />, label: "User Home" },
      ];
    } else if (isModerator) {
      return [
        { to: "/dashboard/moderator", icon: <MdOutlineAddModerator />, label: "Moderator Home" },
          { to: "/dashboard/users", icon: <LuUserSearch />, label: "All Users" },
        { to: "/dashboard/sellerHome", icon: <FaRegUser />, label: "seller Home" },
        { to: "/dashboard/uploadInfo", icon: <FaRegUser />, label: "Upload Info" },
        { to: "/dashboard/myOrder", icon: <RiShoppingBag4Line />, label: "My Order" },
        { to: "/dashboard/paymentHistory", icon: <PiContactlessPaymentLight />, label: "Payment History" },
        { to: "/dashboard/userHome", icon: <FaRegUser />, label: "User Home" },
      ];
    } else if (isSeller) {
      return [
        { to: "/dashboard/sellerHome", icon: <FaRegUser />, label: "seller Home" },
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
    <div  className="flex min-h-screen  bg-gray-100">
      {/* Mobile Toggle Button */}
      {!noNavbarFooter && (
        <div data-aos="fade-right" className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleMobileMenu}
            className="text-xl bg-[#339179] text-white p-2 rounded-md  shadow-md"
          >
            {mobileMenuOpen ? <IoClose /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      {!noNavbarFooter && (
        <aside
          className={`fixed top-0 left-0 z-40 h-full overflow-y-auto bg-[#339179] text-white shadow-2xl transition-all duration-300 flex flex-col ${
            collapsed ? "w-20" : "w-64"
          } ${mobileMenuOpen ? "block" : "hidden"} md:block`}
        >
          {/* Logo / Toggle */}
          <div className="p-4 border-b border-white flex justify-between items-center">
            <span className="text-xl font-bold flex items-center gap-2">
           {!collapsed && "Dashboard"}
            </span>
            <button
              onClick={toggleSidebar}
              className="text-white text-lg hidden md:block"
              title="Toggle Sidebar"
            >
              {collapsed ? "›" : "‹"}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
            {roleMenus().map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={menuItemClass}
              >
                {icon} {!collapsed && label}
              </Link>
            ))}

            <div className="border-t border-white my-4" />

            <Link to="/" className={menuItemClass}>
              <RiHome9Line /> {!collapsed && "Home"}
            </Link>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-white text-[#339179] py-2 rounded-full flex items-center justify-center gap-2 font-semibold hover:bg-gray-200"
              >
                <HiLogout /> {!collapsed && "Logout"}
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full bg-white text-[#339179] py-2 rounded-full flex items-center justify-center gap-2 font-semibold hover:bg-gray-200"
              >
                <IoMdLogIn /> {!collapsed && "Login"}
              </Link>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 px-4 py-6 transition-all duration-300 ${
          !noNavbarFooter ? "md:ml-20" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
