import React, { useState, useEffect, useRef } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import useRestaurantData from "../../Hooks/useRestaurantData";
import useSaveSearch from "../../Hooks/useSaveSearch";

const SearchBar = ({ restaurantData, onSearchSelect }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search in Shop");
  const [loading, setLoading] = useState(false);
  const [showNoResult, setShowNoResult] = useState(false);

  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const [isRestaurantData] = useRestaurantData();
  const { saveSearch, saveSearchKeyword, deleteSearchKeyword } = useSaveSearch();

  const phrases = [
    "Search in Shop",
    "Find your favorite food",
    "Try 'Burger'",
    "Looking for Pizza?",
    "What's for dinner?",
  ];

  // Typewriter effect for placeholder
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
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // Load previous search text from sessionStorage
  useEffect(() => {
    const savedText = sessionStorage.getItem("searchText");
    if (savedText) {
      setSearchText(savedText);
      setIsOpen(true);
    }
  }, []);

  // Save current searchText in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("searchText", searchText);
  }, [searchText]);

  // Fetch suggestions with delay
  useEffect(() => {
    if (searchText.trim() === "") {
      setSuggestions([]);
      setShowNoResult(false);
      return;
    }

    setLoading(true);
    setSuggestions([]);
    setShowNoResult(false);

    const timer = setTimeout(() => {
      const filtered = restaurantData
        .filter((res) =>
          res.restaurantName.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((res) => ({
          label: res.restaurantName,
          type: "restaurant",
          id: res._id,
          image: res.photo,
        }));

      if (filtered.length === 0) {
        setShowNoResult(true);
      }

      setSuggestions(filtered.slice(0, 8));
      setLoading(false);
      setIsOpen(true);
    }, 4000); // Simulate 4 seconds delay

    return () => clearTimeout(timer);
  }, [searchText, restaurantData]);

  // Click outside to close dropdown
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

  // Add blur class to background when open
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
    saveSearchKeyword(item.label);
    document.body.classList.remove("search-blur");

    if (item.type === "restaurant") {
      navigate(`/restaurantUpload/${encodeURIComponent(item.label)}`);
    }
  };

  return (
    <div className="w-[200px] sm:w-[400px] lg:w-[900px] mx-auto z-50">
      <div className="relative" ref={wrapperRef}>
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-lg bg-white">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchText.trim()) {
                saveSearchKeyword(searchText.trim());
                setIsOpen(false);
              }
            }}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 w-full text-sm bg-white focus:outline-none"
          />
          <button className="px-4 bg-white text-[#339179]">
            <IoSearchSharp className="w-5 h-5 animate-pulse" />
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-md rounded-lg max-h-72 overflow-y-auto">
            <ul>
              {loading && searchText.trim() && (
                <li className="px-4 py-3 text-sm text-black text-center animate-pulse">
                  Searching for “{searchText}”...
                </li>
              )}

              {!loading && showNoResult && (
                <li className="px-4 py-3 text-sm text-center text-gray-400">
                  No results found.
                </li>
              )}

              {!loading &&
                !showNoResult &&
                suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all"
                  >
                    <FaSearch className="text-[#339179]" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </li>
                ))}

              {searchText.trim() === "" &&
                saveSearch.map((item, index) => (
                  <li
                    key={`saved-${index}`}
                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition-all"
                  >
                    <span
                      onClick={() => {
                        setSearchText(item.keyword);
                        saveSearchKeyword(item.keyword);
                        setIsOpen(false);
                      }}
                      className="cursor-pointer text-sm flex items-center gap-2 text-gray-700"
                    >
                      <FaSearch className="text-[#339179]" />
                      {item.keyword}
                    </span>
                    <button
                      onClick={() => deleteSearchKeyword(item.keyword)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RxCross2 />
                    </button>
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
