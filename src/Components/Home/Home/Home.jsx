import { Helmet } from "react-helmet";
import Banner from "../Banner/Banner";
import BannerTwo from "../BannerTwo/BannerTwo";
import ServeFood from "../ServeFood/ServeFood";
import AvailableItem from "../AvailableItem/AvailableItem";
import BannerFour from "../bannerFour/BannerFour";
import DistrictAvailable from "../DistrictAvailable/DistrictAvailable/DistrictAvailable";
import AvailableBrand from "../AvailableBrand/AvailableBrand/AvailableBrand";
import DeliveryService from "./DeliveryService/DeliveryService";

const Home = () => {
    return (
        <div className="">
            <Helmet>
                <title>ShoppingGO</title>
            </Helmet>
         <Banner/>
         <BannerTwo/>
         <AvailableItem/>
         <br />
         <br />

        <BannerFour/>
         <br />
         <br />

         <AvailableBrand/>
         <br />
         <br />
         
         <ServeFood/>
         <br />
         <br />
         <DistrictAvailable/>
         <br />
         <br />
         <DeliveryService/>
        </div>
    );
};

export default Home;