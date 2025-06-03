import { Button, Input } from "@material-tailwind/react";
import { FaHamburger, FaUserCircle, FaWifi } from "react-icons/fa";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
  IconButton,

} from "@material-tailwind/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { IoSearchSharp } from "react-icons/io5";
import React, { useContext, useEffect, useRef, useState } from "react";
import { RiShoppingBag2Line } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";

import { IoMdLogIn } from "react-icons/io";
import useAdmin from "../Hooks/useAdmin";
import useModerator from "../Hooks/useModerator";
import useSeller from "../Hooks/useSeller";
import { HiOutlineMenu } from "react-icons/hi";
import useAuth from "../Hooks/useAuth";

import useShoppingCart from "../Hooks/useShoppingCart";
import useLanguage from "../Hooks/useLanguage";
import useRestaurantData from "../Hooks/useRestaurantData";
import SearchBar from "./SearchBar/SearchBar";
import InternetShow from "./InternetShow/InternetShow";


const Navbar = () => {

  const { logout, user } = useAuth();
    const [isAdmin] = useAdmin();
    const [isModerator] = useModerator();
    const [isSeller] = useSeller();
    const [cartFood] = useShoppingCart()
  
    const [restaurantData] = useRestaurantData();
    const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search in Shop")
  const wrapperRef = useRef(null);


  // Typewriter placeholder texts
  const phrases = [
    "Search in Shop",
    "Find your favorite food",
    "Try 'Burger'",
    "Looking for Pizza?",
    "What's for dinner?",
  ];

  useEffect(() => {
    let currentPhrase = 0;
    let currentLetter = 0;
    let typingForward = true;

    const type = () => {
      if (typingForward) {
        setPlaceholder(phrases[currentPhrase].slice(0, currentLetter + 1));
        currentLetter++;
        if (currentLetter === phrases[currentPhrase].length) {
          typingForward = false;
          setTimeout(type, 1500); // hold full text
          return;
        }
      } else {
        setPlaceholder(phrases[currentPhrase].slice(0, currentLetter - 1));
        currentLetter--;
        if (currentLetter === 0) {
          typingForward = true;
          currentPhrase = (currentPhrase + 1) % phrases.length;
        }
      }
      setTimeout(type, typingForward ? 80 : 40);
    };

    const timeoutId = setTimeout(type, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = [];

    restaurantData.forEach((res) => {
      if (res.shopName.toLowerCase().includes(searchText.toLowerCase())) {
        filtered.push({ label: res.shopName });
      }

      res.products?.forEach((food) => {
        if (food.productName.toLowerCase().includes(searchText.toLowerCase())) {
          filtered.push({ label: food.productName });
        }
      });
    });

    setSuggestions(filtered.slice(0, 10));
    setIsOpen(true);
  }, [searchText, restaurantData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { language, changeLanguage } = useLanguage();
  const handleLogout = () => {
    logout()
      .then(() => { })
  }
  const navbarLinks = (
    <>
      {/* {language === "English" ? <h1>Welcome to My Website</h1> : <h1>আমার ওয়েবসাইটে স্বাগতম</h1>} */}
      {language === "English" ? <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
            : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
        }
      >
        HOME
      </NavLink> : <NavLink
        to="/"
        className={({ isActive }) =>
        isActive
          ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
          : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
      }
      >
        হোম
      </NavLink>}
      <NavLink
        to="/shop"
        className={({ isActive }) =>
          isActive
            ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
            : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
        }
      >
        SHOP
      </NavLink>
      <NavLink
        to="/categorise"
        className={({ isActive }) =>
        isActive
          ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
          : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
      }
      >
        CATEGORIES
      </NavLink>
      <NavLink
        to="/deals"
        className={({ isActive }) =>
        isActive
          ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
          : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
      }
      >
        DEALS
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
        isActive
          ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
          : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
      }
      >
        ABOUT
      </NavLink>
    </>
  );
  const [openMenu, setOpenMenu] = React.useState(false);

  const countries = [
    { name: "English", flag: "https://i.ibb.co.com/8gr5nbL3/united-kingdom-323329.png" },
    { name: "বাংলা", flag: "https://i.ibb.co.com/7Jcp4d8r/bangladesh-7826304.png" },
  ];



  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      }
      else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])
  const handleSearchSelect = (item) => {
    // Navigate to appropriate page based on search result type
    if (item.type === "sellerProfile") {
      navigate(`/sellerProfile/${item.shopName}?food=${item.productName}`);
    } else if (item.type === "sellerProfile") {
      navigate(`/sellerProfile/${item.shopName}`);
    }
  };

  return (
    <div>

      {/* First Navbar */}
      <div className={`navbar  px-4 md:px-6 lg:px-10 bg-[#339179] ${scrolled ? "fixed top-0 left-0 w-full  shadow z-10 " : ""}`}>
      
        <div className="navbar-start">
      
      <a href="/" className=" w-[90px]  lg:w-[150px]   rounded-full "><img src="https://i.ibb.co.com/DSyrSGk/logo.png" alt="" /></a>
   
        </div>
      <div className="navbar-center ">
      <SearchBar
      className=""
            restaurantData={restaurantData} 
            onSearchSelect={handleSearchSelect}
          
          />
      </div>
        <div className="navbar-end gap-2 ">
      
  <div>
  <div className="flex justify-center items-center">
     <InternetShow/>
    

     </div>
          <div>
          <Menu>
        {/* <MenuHandler>
          <div
            className="flex items-center text-sm bg-[#339179] text-[#ffff] p-1 px-2 rounded-full gap-2 cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <img src={countries.find(({ name }) => name === language)?.flag} alt={language} className="w-5 h-5 rounded-full" />
            {countries.find(({ name }) => name === language)?.name}
            <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${openMenu ? "rotate-180" : ""}`} />
          </div>
        </MenuHandler> */}

        <MenuList className="w-28">
          {countries.map(({ name, flag }) => (
            <MenuItem key={name} onClick={() => changeLanguage(name)} className="flex items-center gap-2">
              <img src={flag} alt={name} className="w-5 h-5 rounded-full" /> {name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
          </div>
  </div>
          {
            user ? <>
              <Menu>
                <MenuHandler>
                  <Avatar
                    variant="circular"
                    alt="tania andrew"

                    className="cursor-pointer w-12 h-12 rounded-full border-4 border-[#8aaa]"
                    src={user?.photoURL || "https://i.ibb.co.com/PGwHS087/profile-Imagw.jpg"}
                  />
                </MenuHandler>
                <MenuList>
                  <Link to={"/myProfile"}>
                    <MenuItem className="flex items-center gap-2 ">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM10 5C10 5.53043 9.78929 6.03914 9.41421 6.41421C9.03914 6.78929 8.53043 7 8 7C7.46957 7 6.96086 6.78929 6.58579 6.41421C6.21071 6.03914 6 5.53043 6 5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3C8.53043 3 9.03914 3.21071 9.41421 3.58579C9.78929 3.96086 10 4.46957 10 5ZM8 9C7.0426 8.99981 6.10528 9.27449 5.29942 9.7914C4.49356 10.3083 3.85304 11.0457 3.454 11.916C4.01668 12.5706 4.71427 13.0958 5.49894 13.4555C6.28362 13.8152 7.13681 14.0009 8 14C8.86319 14.0009 9.71638 13.8152 10.5011 13.4555C11.2857 13.0958 11.9833 12.5706 12.546 11.916C12.147 11.0457 11.5064 10.3083 10.7006 9.7914C9.89472 9.27449 8.9574 8.99981 8 9Z"
                          fill="#90A4AE"
                        />
                      </svg>

                      <Typography variant="small" className="font-medium">
                        My Profile
                      </Typography>

                    </MenuItem>
                  </Link>
              
                  {
                    user && isAdmin && <Link to={"/dashboard/adminHome"}>
                      <MenuItem className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                            fill="#90A4AE"
                          />
                        </svg>

                        <Typography variant="small" className="font-medium">
                          Dashboard
                        </Typography>
                      </MenuItem>
                    </Link>
                  }
                  {
                    user && isModerator && <Link to={"/dashboard/moderator"}>
                      <MenuItem className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                            fill="#90A4AE"
                          />
                        </svg>

                        <Typography variant="small" className="font-medium">
                          Dashboard
                        </Typography>
                      </MenuItem>
                    </Link>
                  }
                  {
                    user && isSeller && <Link to={"/dashboard/sellerHome"}>
                      <MenuItem className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                            fill="#90A4AE"
                          />
                        </svg>

                        <Typography variant="small" className="font-medium">
                          Dashboard
                        </Typography>
                      </MenuItem>
                    </Link>
                  }
                  {
                    user && !isAdmin && !isModerator && !isSeller && <Link to={"/dashboard/userHome"}>
                      <MenuItem className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                            fill="#90A4AE"
                          />
                        </svg>

                        <Typography variant="small" className="font-medium">
                          Dashboard
                        </Typography>
                      </MenuItem>
                    </Link>
                  }
                  <MenuItem className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM14 8C14 8.993 13.759 9.929 13.332 10.754L11.808 9.229C12.0362 8.52269 12.0632 7.76679 11.886 7.046L13.448 5.484C13.802 6.249 14 7.1 14 8ZM8.835 11.913L10.415 13.493C9.654 13.8281 8.83149 14.0007 8 14C7.13118 14.0011 6.27257 13.8127 5.484 13.448L7.046 11.886C7.63267 12.0298 8.24426 12.039 8.835 11.913ZM4.158 9.117C3.96121 8.4394 3.94707 7.72182 4.117 7.037L4.037 7.117L2.507 5.584C2.1718 6.34531 1.99913 7.16817 2 8C2 8.954 2.223 9.856 2.619 10.657L4.159 9.117H4.158ZM5.246 2.667C6.09722 2.22702 7.04179 1.99825 8 2C8.954 2 9.856 2.223 10.657 2.619L9.117 4.159C8.34926 3.93538 7.53214 3.94687 6.771 4.192L5.246 2.668V2.667ZM10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10C7.46957 10 6.96086 9.78929 6.58579 9.41421C6.21071 9.03914 6 8.53043 6 8C6 7.46957 6.21071 6.96086 6.58579 6.58579C6.96086 6.21071 7.46957 6 8 6C8.53043 6 9.03914 6.21071 9.41421 6.58579C9.78929 6.96086 10 7.46957 10 8Z"
                        fill="#90A4AE"
                      />
                    </svg>
                    <Typography variant="small" className="font-medium">
                      Help
                    </Typography>
                  </MenuItem>
                  {/* <Typography variant="small" className="ml-2" >   <Darkmode /></Typography> */}
                  <hr className="my-2 border-blue-gray-50" />
                  <MenuItem className="flex items-center gap-2">

                    {
                      user ? <>
                        <Typography onClick={handleLogout} variant="small" className="font-medium flex items-center gap-3">
                          <svg
                            width="16"
                            height="14"
                            viewBox="0 0 16 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                              fill="#90A4AE"
                            />
                          </svg>
                          Sign Out
                        </Typography>
                      </> : <>
                        <Link to={"/login"}>
                          <Typography variant="small" className="font-medium flex items-center gap-3">
                            <svg
                              width="16"
                              height="14"
                              viewBox="0 0 16 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                                fill="#90A4AE"
                              />
                            </svg>
                            Sign up
                          </Typography>
                        </Link>
                      </>
                    }
                  </MenuItem>
                </MenuList>
              </Menu>
            </> : <><Link to={"/login"}>
              <button className="btn  text-xl rounded-full bg-white text-[#339179] " ><IoMdLogIn /></button>
            </Link></>
          }
        </div>
      </div>
      {/* Second Navbar */}
      <div className={`navbar  px-3 md:px-6 lg:px-8 bg-[#fff]  " : ""}`}>
        <div className="navbar-start">
      
        <div className="dropdown md:hidden block">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-[#339179]ite  font-bold">

              <Menu>
                <MenuHandler>
                  <a className="text-[#339179] ite text-2xl"><HiOutlineMenu /></a>
                </MenuHandler>



                <MenuList>
                  <MenuItem>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                          : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                      }
                    >
                      HOME
                    </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink
                      to="/shop"
                      className={({ isActive }) =>
                        isActive
                          ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                          : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                      }
                    >
                      SHOP
                    </NavLink>
                  </MenuItem>

                  <MenuItem> <NavLink
                    to="/categorise"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                        : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                    }
                  >
                    CATEGORIES
                  </NavLink>
                  </MenuItem>

                  <MenuItem> <NavLink
                    to="/deals"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                        : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                    }
                  >
                    DEALS
                  </NavLink>
                  </MenuItem>

                  <MenuItem> <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold text-[#339179] border-b-2 border-red-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                        : "font-bold text-[#339179] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#339179] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                    }
                  >
                    ABOUT
                  </NavLink>
                  </MenuItem>



                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
          
        <div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4">
            {navbarLinks}
            
          </ul>
            
        </div>
        
        </div>
        <div className="navbar-end">
     
        <div className="md:block hidden">
            {
              user ? <>
                <Link to={"/myProfile"}>

                  <div tabIndex={0} className="" >
                    <div className=" lg:mr-0">
                      <div className="badge rounded-full text-[12px] bg-[#339179] text-[#fff] ">  <p className="flex justify-center items-center gap-2  font-bold "><FaUserCircle /> {user?.displayName ||  "Type Your Name"}</p></div>

                    </div>
                  </div>

                </Link>
              </> : <></>
            }
          </div>
          <div className="w-16 ">
            {
              user ? <>
                <Link to={"/dashboard/myOrder"}>

                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <div className="text-2xl text-[#339179] "><RiShoppingBag2Line /></div>
                      <span className="badge text-[10px] indicator-item text-[#339179]">{cartFood.length}</span>
                    </div>
                  </div>

                </Link>
              </> : <></>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;