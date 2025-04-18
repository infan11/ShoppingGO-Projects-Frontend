import React from "react";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { PiHamburgerThin } from "react-icons/pi";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LuUserSearch } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { RiAdminLine, RiShoppingBag4Line, RiHome9Line } from "react-icons/ri";
import { MdOutlineAddModerator } from "react-icons/md";
import { PiContactlessPaymentLight } from "react-icons/pi";
import Darkmode from "../../Darkmode/Darkmode";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";
import { IoIosAddCircleOutline, IoMdLogIn } from "react-icons/io";
import { HiLogout } from "react-icons/hi";

const Dashboard = () => {
  const { user , logout } = useAuth();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();

  const handleLogout = () => {
    logout().then(() => {});
  }

  const location = useLocation();
  const noNavbarFooter = ["/dashboard/paymentSuccess"].includes(location.pathname);

  const menuItemClass = "hover:bg-gradient-to-r hover:from-green-white  hover:to-green-600 hover:scale-110  transition-all duration-300 ease-in-out rounded-full hover:text-[#339179]";

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      {noNavbarFooter || (
        <div className="navbar bg-white shadow-2xl">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-4"
              className="text-4xl font-bold cursor-pointer "
            >
              <a className="text-[#339179]"><PiHamburgerThin /></a>
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold text-[#339179]">DASHBOARD</span>
          </div>
        </div>
      )}

      {/* Drawer */}
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Main Content */}
          <Outlet />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay font-Kanit"></label>
          <ul className="menu bg-[#339179] text-white min-h-full w-80 p-4">
            <Typography variant="h5" color="white" className="mb-4">
              DASHBOARD
            </Typography>

            {isAdmin && (
              <>
                <Link to="/dashboard/adminHome">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><RiAdminLine /></ListItemPrefix>
                    Admin Home
                  </ListItem>
                </Link>
                <Link to="/dashboard/users">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><LuUserSearch /></ListItemPrefix>
                    Users
                  </ListItem>
                </Link>
                <Link to="/dashboard/myOrder">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><RiShoppingBag4Line /></ListItemPrefix>
                    My Order
                  </ListItem>
                </Link>
                <Link to="/dashboard/uploadInfo">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    Upload Info
                  </ListItem>
                </Link>
                <Link to="/dashboard/addDistrictCollection">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    Add District Collection
                  </ListItem>
                </Link>
                <Link to="/dashboard/paymentHistory">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><PiContactlessPaymentLight /></ListItemPrefix>
                    Payment History
                  </ListItem>
                </Link>
                <Link to="/dashboard/updateFood">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><RxUpdate /></ListItemPrefix>
                    Update Food
                  </ListItem>
                </Link>
                <Link to="/dashboard/moderator">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><MdOutlineAddModerator /></ListItemPrefix>
                    Moderator Home
                  </ListItem>
                </Link>
                <Link to="/dashboard/ownerHome">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    Owner Home
                  </ListItem>
                </Link>
                <Link to="/dashboard/userHome">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    User Home
                  </ListItem>
                </Link>
              </>
            )}

            {!isAdmin && isModerator && (
              <>
                <Link to="/dashboard/moderator">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><MdOutlineAddModerator /></ListItemPrefix>
                    Moderator Home
                  </ListItem>
                </Link>
                <Link to="/dashboard/updateFood">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><RxUpdate /></ListItemPrefix>
                    Update Food
                  </ListItem>
                </Link>
                <Link to="/dashboard/ownerHome">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    Owner Home
                  </ListItem>
                </Link>
                <Link to="/dashboard/uploadInfo">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    Upload Info
                  </ListItem>
                </Link>
                <Link to="/dashboard/userHome">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    User Home
                  </ListItem>
                </Link>
                <Link to="/dashboard/myOrder">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><RiShoppingBag4Line /></ListItemPrefix>
                    My Order
                  </ListItem>
                </Link>
                <Link to="/dashboard/paymentHistory">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><PiContactlessPaymentLight /></ListItemPrefix>
                    Payment History
                  </ListItem>
                </Link>
              </>
            )}

            {!isAdmin && !isModerator && isOwner && (
              <>
                <Link to="/dashboard/ownerHome">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    Owner Home
                  </ListItem>
                </Link>
                <Link to="/dashboard/uploadInfo">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    Upload Info
                  </ListItem>
                </Link>
                <Link to="/dashboard/updateFood">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><RxUpdate /></ListItemPrefix>
                    Update Food
                  </ListItem>
                </Link>
                <Link to="/dashboard/myOrder">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><RiShoppingBag4Line /></ListItemPrefix>
                    My Order
                  </ListItem>
                </Link>
                <Link to="/dashboard/paymentHistory">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><PiContactlessPaymentLight /></ListItemPrefix>
                    Payment History
                  </ListItem>
                </Link>
              </>
            )}

            {!isAdmin && !isModerator && !isOwner && (
              <>
                <Link to="/dashboard/userHome">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><FaRegUser /></ListItemPrefix>
                    User Home
                  </ListItem>
                </Link>
                <Link to="/dashboard/myOrder">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><RiShoppingBag4Line /></ListItemPrefix>
                    My Order
                  </ListItem>
                </Link>
                <Link to="/dashboard/paymentHistory">
                  <ListItem className={menuItemClass}>
                    <ListItemPrefix><PiContactlessPaymentLight /></ListItemPrefix>
                    Payment History
                  </ListItem>
                </Link>
              </>
            )}

            <div className="divider"></div>
            <Link to="/">
              <ListItem className={menuItemClass}>
                <ListItemPrefix><RiHome9Line /></ListItemPrefix>
                Home
              </ListItem>
            </Link>

            <Button className="mt-4 bg-[#339179] shadow-2xl w-full" size="sm">
              <Darkmode />
            </Button>
            <br />
            <div className="mt-20 md:mt-16 lg:mt-14 mx-auto">
              {user ? (
                <button
                  className="btn w-[200px] rounded-full bg-white text-[#339179]"
                  onClick={handleLogout}
                >
                  <HiLogout /> Logout
                </button>
              ) : (
                <Link to="/login">
                  <button className="btn mt-64 w-[200px] rounded-full bg-white text-[#339179]">
                    <IoMdLogIn /> LOGIN
                  </button>
                </Link>
              )}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
