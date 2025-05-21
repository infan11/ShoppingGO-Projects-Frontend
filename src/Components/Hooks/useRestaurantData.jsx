import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRestaurantData = () => {
    const axiosSecure = useAxiosSecure();
    const { data: isRestaurantData = [] , refetch : refetchTwo , isLoading} = useQuery({
        queryKey : ["isRestaurantData"],
        queryFn : async () => {
            const res = await axiosSecure.get("/sellerProfile")
            return res.data;
        }
    })
    return [isRestaurantData , refetchTwo , isLoading]
};

export default useRestaurantData;