// src/Components/InternetStatus.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const InternetStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline){
    return null ;
  }
else{
  Swal.fire({
    title: "Something Wronng?",
    text: "Please connect internet!",
    icon: "error"
  });
}
  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 z-50">
      {/* No internet connection! Please check your network. */}
    </div>
  );
};

export default InternetStatus;
