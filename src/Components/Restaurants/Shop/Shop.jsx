import React from 'react';
import ShopBanner from '../ShopBanner/ShopBanner';
import ShopBannerTwo from '../ShopBannerTwo/ShopBannerTwo';
import ShopCard from '../ShopCard/ShopCard';
import { Helmet } from 'react-helmet';

const Shop = () => {
    return (
        <div>
            <Helmet >
                <title>ShoppingGO - Shop</title>
            </Helmet>
        <ShopBanner/>
        <ShopBannerTwo/>
        <ShopCard/>
        </div>
    );
};

export default Shop;