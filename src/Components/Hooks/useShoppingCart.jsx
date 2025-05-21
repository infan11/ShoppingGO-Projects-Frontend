import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';
import { useQuery } from '@tanstack/react-query';

const useShoppingCart = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: cartFood = [], refetch } = useQuery({
        queryKey: ["cartFood" , user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/shoppingCart?email=${user?.email}`)
            // console.log(res.data);
            return res.data;
        }
    })
    return [cartFood, refetch]
};

export default useShoppingCart;


