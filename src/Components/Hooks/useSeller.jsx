import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useSeller = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isSeller = false, refetch } = useQuery({
    queryKey: [user?.email, "isSeller"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/seller/${user?.email}`);
      // console.log("isSeller:", res.data);
      return res.data?.seller ?? false; // Ensure it returns a boolean
    },
  });

  return [isSeller, refetch];
};

export default useSeller;
