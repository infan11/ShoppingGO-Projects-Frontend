import React, { createContext, useState, useEffect } from "react";

// Create Context
export const LanguageContext = createContext();

// Language Data
const translations = {
  English: {
    welcome: "Welcome to My Website",
    explore: "Explore our latest products",
    shop: "Shop",
    categories: "Categories",
    deals: "Deals",
    about: "About",
  },
  বাংলা: {
    welcome: "আমার ওয়েবসাইটে স্বাগতম",
    explore: "আমাদের সর্বশেষ পণ্যগুলি অন্বেষণ করুন",
    shop: "দোকান",
    categories: "বিভাগ",
    deals: "ডিল",
    about: "আমাদের সম্পর্কে",
  },
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "English");

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
