
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../AuthSlice/AuthSlice'; // adjust path if needed
// import cartReducer from "../ReduxSlice/CartSlice/cartSlice"
// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     cart :cartReducer
//   },
// });

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import LoadingReducer from "./Features/LoadingSlice/LoadingSlice";
const store = configureStore({
  reducer: {
    // cart: cartReducer,
    loading : LoadingReducer
  },
});

export default store;
