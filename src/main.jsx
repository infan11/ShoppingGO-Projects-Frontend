import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Components/Routes/Routes/Routes';
import AuthProvider from './Components/Provider/AuthProvider/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Circles } from 'react-loader-spinner';
import LanguageProvider from './Components/Provider/LanguageProvider/LanguageProvider';
import store from '././Redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { setLoading } from './Redux/Features/LoadingSlice/LoadingSlice';

const queryClient = new QueryClient();

const Loader = () => (
  <div className="flex justify-center items-center min-h-screen  ">
  <div>
   <Circles
                    height="90"
                    width="90"
                    color="#339179"
                    ariaLabel="circles-loading"
                    visible={true}
                />
  </div>
  </div>
);

const AppWithLoader = () => {
const dispatch  = useDispatch();
const isLoading = useSelector((state) => state.loading.isLoading)
  useEffect(() => {
    const timer = setTimeout(() => {
   dispatch(setLoading(false))
    } ,1500);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loader /> : <RouterProvider router={router} />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
   <Provider store={store}>
   <AuthProvider >
    
    <Toaster />
    <QueryClientProvider client={queryClient}>
      <div className="font-Kanit bg-gradient-to-br from-[#d4f1f4] text-black">
        <AppWithLoader />
      </div>
    </QueryClientProvider>
  </AuthProvider>
   </Provider>
    </LanguageProvider>
  </StrictMode>
);
