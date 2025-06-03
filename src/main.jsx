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
import store from './Redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { setLoading } from './Redux/Features/LoadingSlice/LoadingSlice';
import InternetStatus from './InternetStatus/InternetStatus';
import Swal from 'sweetalert2';

const queryClient = new QueryClient();

const Loader = ({ useImage = true, size = 24 }) => {
  const loaderStyle = {
    width: `${size * 4}px`,
    height: `${size * 4}px`,
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        {useImage ? (
          <img
            src="https://i.ibb.co/TBZhxNxQ/Icon.png"
            alt="Loading..."
            className="animate-pulse"
            style={loaderStyle}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
            }}
          />
        ) : (
          <Circles
            height={size * 4}
            width={size * 4}
            color="#339179"
            ariaLabel="circles-loading"
            visible={true}
          />
        )}
      </div>
    </div>
  );
};

const AppWithLoader = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 1500);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);
  if (isOnline) {
    return null;
  }
  else {
    Swal.fire({
      title: "Something Wronng?",
      text: "Please connect internet!",
      icon: "error"
    });
  }
  return (
    <>
      {/* {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center p-2 z-50">
          You are currently offline. Some features may not be available.
        </div>
      )} */}
      {isLoading ? <Loader useImage={true} size={24} /> : <RouterProvider router={router} />}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <Provider store={store}>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <QueryClientProvider client={queryClient}>
            <div className="font-Kanit bg-white text-black min-h-screen">
              <AppWithLoader />
            </div>
          </QueryClientProvider>
        </AuthProvider>
      </Provider>
    </LanguageProvider>
  </StrictMode>
);