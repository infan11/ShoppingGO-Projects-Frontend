
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../AuthSlice/AuthSlice'; // adjust path if needed

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;