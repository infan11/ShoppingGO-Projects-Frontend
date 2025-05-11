import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const exists = state.items.some(item => item.foodId === action.payload.foodId);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.foodId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, setCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
