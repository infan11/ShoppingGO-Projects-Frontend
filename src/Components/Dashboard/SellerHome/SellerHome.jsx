import React from 'react';
import useAuth from '../../Hooks/useAuth';

const SellerHome = () => {
    const {user} = useAuth();
    return (
        <div>
           
             sellerHome : {user?.name || user?.displayName}
         <br />
          sellerHome Email : {user?.email}
        </div>
    );
};

export default SellerHome;