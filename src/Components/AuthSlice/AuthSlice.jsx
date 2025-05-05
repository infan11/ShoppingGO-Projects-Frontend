
// src/features/auth/AuthSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  setToken : null,
  loading: false,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // This must be plain JS object
    },
    clearUser: (state) => {
      state.user = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setUser,setToken ,clearUser, setLoading } = AuthSlice.actions;
export default AuthSlice.reducer;
