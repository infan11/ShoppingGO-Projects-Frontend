import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';

const useSaveSearch = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: saveSearch = [], refetch } = useQuery({
    queryKey: ['search-data', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/search-data?email=${user.email}`);
      return res.data;
    },
  });

  const saveSearchKeyword = async (keyword) => {
    if (!user?.email || !keyword) return;

    await axiosSecure.post('/search-data', {
      email: user.email,
      keyword,
      createdAt: new Date(),
    });
    refetch();
  };

  const deleteSearchKeyword = async (keyword) => {
    if (!keyword) return;

    await axiosSecure.delete(`/search-data/${encodeURIComponent(keyword)}`);
    refetch();
  };

  return { saveSearch, saveSearchKeyword, deleteSearchKeyword };
};

export default useSaveSearch;
