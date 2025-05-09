// src/Hooks/useAxiosSecure.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // REQUEST Interceptor
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("jwt-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // ✅ FIXED TYPO: "Bearar" => "Bearer"
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE Interceptor
  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        await logOut();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
