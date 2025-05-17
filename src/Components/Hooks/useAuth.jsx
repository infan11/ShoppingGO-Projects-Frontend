import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider/AuthProvider";
import { useSelector } from "react-redux";

const useAuth = () => {
    const auth = useContext(AuthContext)
   const loading = useSelector((state) => state.loading.isLoading)

    return {... auth, loading};

};

export default useAuth;