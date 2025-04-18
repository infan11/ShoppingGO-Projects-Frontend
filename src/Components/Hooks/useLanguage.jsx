import { useContext } from "react";
import { LanguageContext } from "../Provider/LanguageProvider/LanguageProvider";

const useLanguage = () => {
  return useContext(LanguageContext);
};

export default useLanguage;
