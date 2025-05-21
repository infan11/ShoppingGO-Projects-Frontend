// pages/sellerProfilePage.jsx
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const SellerProfilePage = () => {
  const { shopName } = useParams();
  const [searchParams] = useSearchParams();
  const productName = searchParams.get('food');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Restaurant: {decodeURIComponent(shopName)}
      </h1>
      
      {productName && (
        <p className="text-lg">
          Food Item: {decodeURIComponent(productName)}
        </p>
      )}

      {/* Add your restaurant upload form/content here */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upload Content</h2>
        {/* Your upload form components */}
      </div>
    </div>
  );
};

export default SellerProfilePage;