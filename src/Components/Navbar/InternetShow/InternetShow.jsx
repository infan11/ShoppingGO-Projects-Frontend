import React, { useState, useEffect } from 'react';
import { FaWifi } from 'react-icons/fa';
import { LuWifiOff } from 'react-icons/lu';

const InternetShow = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className='text-xl justify-center items-center'>
      {isOnline ? (
      <div className='flex  justify-center items-center  gap-2  text-sm text-white'>
          <FaWifi style={{ color: '#fff' }}  title="Online" /> <p className='md:block hidden font-Kanit'>Online</p>
      </div>
      ) : (
       <div className='flex  justify-center items-center  gap-1  text-sm text-red-900'>
         <LuWifiOff style={{ color: 'red' }} title="Offline" /> <p className='md:block hidden font-Kanit'>Offline</p>
       </div>
      )}
    </div>
  );
};

export default InternetShow;
