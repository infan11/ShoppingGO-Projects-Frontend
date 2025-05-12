import React, { useState, useEffect, useRef } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useRestaurantData from "../../Hooks/useRestaurantData";

const SearchBar = ({ restaurantData, onSearchSelect }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search in Shop");
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const [isRestaurantData] = useRestaurantData();

  const phrases = [
    "Search in Shop",
    "Find your favorite food",
    "Try 'Burger'",
    "Looking for Pizza?",
    "What's for dinner?",
  ];

  // Typewriter effect
  useEffect(() => {
    let currentPhrase = 0;
    let currentLetter = 0;
    let typingForward = true;

    const type = () => {
      if (searchText) return;

      if (typingForward) {
        setPlaceholder(phrases[currentPhrase].slice(0, currentLetter + 1));
        currentLetter++;
        if (currentLetter === phrases[currentPhrase].length) {
          typingForward = false;
          setTimeout(type, 1500);
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

      if (!searchText) {
        setTimeout(type, typingForward ? 50 : 40);
      }
    };

    const timeoutId = setTimeout(() => {
      if (!searchText) type();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = [];

    restaurantData.forEach((res) => {
      if (res.restaurantName.toLowerCase().includes(searchText.toLowerCase())) {
        filtered.push({
          label: res.restaurantName,
          type: "restaurant",
          id: res._id,
          image: res.photo,
        });
      }
    });

    setSuggestions(filtered.slice(0, 8));
    setIsOpen(true);
  }, [searchText, restaurantData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        document.body.classList.remove("search-blur");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("search-blur");
    } else {
      document.body.classList.remove("search-blur");
    }
  }, [isOpen]);

  const handleSuggestionClick = (item) => {
    setSearchText(item.label);
    setIsOpen(false);
    onSearchSelect?.(item);
    document.body.classList.remove("search-blur");

    if (item.type === "restaurant") {
      navigate(`/restaurantUpload/${encodeURIComponent(item.label)}`);
    }
  };

  return (
    <div className=" w-[200px] lg:w-[900px] mx-auto z-50">
      <div className="relative" ref={wrapperRef}>
        <div className="flex items-stretch border  border-gray-300 rounded-full  overflow-hidden drop-shadow-2xl shadow-inherit  bg-white">
          {/* Category Dropdown (static "All") */}
          {/* <div className="bg-gray-100 px-4 flex items-center text-sm font-medium border-r border-gray-300">
           All
          </div> */}

          {/* Search Input */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 px-4  py-2 bg-white w-full focus:outline-none text-sm"
          />

          {/* Search Button */}
          <button className="bg-[#fff] text-[#339179] px-2 flex items-center justify-center">
            <IoSearchSharp className="h-5 w-5 animate-pulse text-[#339179]" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md max-h-72 overflow-y-auto">
            <ul>
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
                >
                  {/* {item.image ? (
                    <img

                    
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-sm text-gray-600">
                      {item.type === "restaurant"}
                    </span>
                  )} */}
                  <div className=" ">
                    <p className="font-medium gap-2">{item.label}  </p>
                   
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
