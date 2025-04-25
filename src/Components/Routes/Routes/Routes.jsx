import {
  createBrowserRouter,
} from "react-router-dom";
import Main from "../../Main/Main";
import Home from "../../Home/Home/Home";
import Restaurants from "../../Restaurants/Shop/Shop";
import Food from "../../Food/Food/Food";
import About from "../../About/About/About";
import Login from "../../Auth/Login/Login";
import Register from "../../Auth/Register/Register/Register";
import ResetPassword from "../../Auth/ResetPassword/ResetPassword";
import AddFoods from "../../Dashboard/AddFoods/AddFoods";
import Profile from "../../Dashboard/Profle/Profile";
import RestaurantRegister from "../../Auth/RestaurantRegister/RestaurantRegister";
import RrestaurantProfile from "../../Dashboard/RrestaurantProfile/RrestaurantProfile";
import PrivateRoutes from "../PrivateRoutes/PrivateRoutes";
import AdminHome from "../../Dashboard/AdminHome/AdminHome";
import ModeratorHome from "../../Dashboard/ModeratorHome/ModeratorHome";
import OwnerHome from "../../Dashboard/OwnerHome/OwnerHome";
import UserHome from "../../Dashboard/UserHome/UserHome";
import UpdateFood from "../../Dashboard/UpdateFood/UpdateFood";
import PaymentHistory from "../../Dashboard/PaymentHistory/PaymentHistory";
import Biryani from "../../Home/Biryani/Biryani";
import Pizza from "../../Home/Pizza/Pizza";
import Chicken from "../../Home/Home/Chicken/Chicken";
import Chinese from "../../Home/Chinese/Chinese";
import Juice from "../../Home/Juice/Juice";
import Cake from "../../Home/Cake/Cake";
import Beef from "../../Home/Beef/Beef";
import Burger from "../../Home/Home/Burger/Burger";
import Users from "../../Dashboard/Users/Users";
import Dashboard from "../../Dashboard/Dashboard/Dashboard";
import MyOrder from "../../Dashboard/MyOrder/MyOrder";
import UploadInfo from "../../Dashboard/UploadInfo/UploadInfo";
import DeatilsRestaurants from "../../Restaurants/DetailsShop/DetailsShop";
import MyProfile from "../../MyProfile/MyProfile/MyProfile";
import CheckoutForm from "../../Dashboard/CheckoutForm/CheckoutForm";
// import SSLCommerce from "../../Dashboard/PaymentMethod/SSLCommerce/SSLCommerce";
import PaymentSuccess from "../../Dashboard/PaymentSuccess/PaymentSuccess";
import PaymentPage from "../../Dashboard/PaymentPage/PaymentPage";
import AddDistrictCollection from "../../Dashboard/AddDistrictCollection/AddDistrictCollection";

import DistrictRes from "../../Home/DistrictAvailable/DistrictRes/DistrictRes";
import Serach from "../../Navbar/Search/Serach";
import DetailsShop from "../../Restaurants/DetailsShop/DetailsShop";
import Categories from "../../Categories/Categories/Categories";
import Deals from "../../Deals/Deals/Deals";


export const router = createBrowserRouter([
  {
    path: "/",
    // TO DO : ERROR <PrivateRoutes>element
    element: <Main />,
    children: [
      /// Home Components
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/biryani",
        element: <Biryani />,
      },
      {
        path: "/pizza",
        element: <Pizza />,
      },
      {
        path: "/chicken",
        element: <Chicken />,
      },
      {
        path: "/chinese",
        element: <Chinese />,
      },
      {
        path: "/juice",
        element: <Juice />,
      },
      {
        path: "/cake",
        element: <Cake />,
      },
      {
        path: "/beef",
        element: <Beef />,
      },
      {
        path: "/burger",
        element: <Burger />,
      },
      // shop Components
      {
        path: "/shop",
        element: <Restaurants />,
      },
      {
        path: '/restaurantUpload/:restaurantName',
        element: <DetailsShop />
      },
      {
        path: '/restaurantUpload/district/:districtName',
        element: <DistrictRes />
      },
      // Categorise Components
      {
        path: "/categorise",
        element: <Categories />
      },
      // Deals Components 
      {
        path: "/deals",
        element: <Deals />
      },
      /// About Components
      {
        path: "/about",
        element: <About />,
      },
      // Authentication Components
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/restaurantRegister",
        element: <RestaurantRegister />,
      },
      {
        path: "/resetPassword",
        element: <ResetPassword />,
      },
      // user info Components
      {
        path: "/myProfile",
        element: <MyProfile />
      },


      // other Service components
      {
        path: "/search",
        element: <Serach />
      }
    ],
  },
  /// dashboard Components
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard/addFoods",
        element: <PrivateRoutes><AddFoods /></PrivateRoutes>,
      },
      {
        path: "/dashboard/RrestaurantProfile",
        element: <PrivateRoutes><RrestaurantProfile /></PrivateRoutes>,
      },
      {
        path: "/dashboard/adminHome",
        element: <PrivateRoutes><AdminHome /></PrivateRoutes>,
      },
      {
        path: "/dashboard/moderator",
        element: <PrivateRoutes><ModeratorHome /></PrivateRoutes>,
      },
      {
        path: "/dashboard/ownerHome",
        element: <PrivateRoutes><OwnerHome /></PrivateRoutes>,
      },
      {
        path: "/dashboard/uploadInfo",
        element: <PrivateRoutes><UploadInfo /></PrivateRoutes>,
      },
      {
        path: "/dashboard/userHome",
        element: <PrivateRoutes><UserHome /></PrivateRoutes>,
      },
      {
        path: "/dashboard/myOrder",
        element: <PrivateRoutes><MyOrder /></PrivateRoutes>,
      },
      {
        path: "/dashboard/updateFood/restaurantName/:foods",
        element: <PrivateRoutes><UpdateFood /></PrivateRoutes>,
      },
      {
        path: "/dashboard/users",
        element: <PrivateRoutes><Users /></PrivateRoutes>,
      },
      {
        path: "/dashboard/checkOutForm",
        element: <CheckoutForm />,
      },
      {
        path: "/dashboard/paymentHistory",
        element: <PrivateRoutes><PaymentHistory /></PrivateRoutes>,
      },
      {
        path: "/dashboard/AddDistrictCollection",
        element: <PrivateRoutes><AddDistrictCollection /></PrivateRoutes>,
      },
      {
        path: "/dashboard/paymentSuccess",
        element: <PrivateRoutes><PaymentSuccess /></PrivateRoutes>,
      },
      {
        path: "/dashboard/paymentPage",
        element: <PrivateRoutes><PaymentPage /></PrivateRoutes>,
      },
    ],
  },
]);
