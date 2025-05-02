import { Helmet } from "react-helmet";
import Banner from "../Banner/Banner";
import BannerTwo from "../BannerTwo/BannerTwo";
import ServeFood from "../ServeFood/ServeFood";
import AvailableItem from "../AvailableItem/AvailableItem";
import BannerFour from "../bannerFour/BannerFour";
import DistrictAvailable from "../DistrictAvailable/DistrictAvailable/DistrictAvailable";

const Home = () => {
    return (
        <div className="">
            <Helmet>
                <title>ShoppingGO - HOME</title>
            </Helmet>
         <Banner/>
         <BannerTwo/>
         <AvailableItem/>
         <br />
         <br />
        <BannerFour/>
         <br />
         <br />
         <ServeFood/>
         <br />
         <br />
         <DistrictAvailable/>
         <br />
         <br />
        </div>
    );
};

export default Home;