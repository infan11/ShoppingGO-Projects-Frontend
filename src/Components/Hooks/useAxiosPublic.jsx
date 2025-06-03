import axios from "axios";


const useAxiosPublic = () => {
    const axiosPublic = axios.create({
         baseURL : "https://shopping-go-backend.vercel.app"
    })
    return axiosPublic
};

export default useAxiosPublic;