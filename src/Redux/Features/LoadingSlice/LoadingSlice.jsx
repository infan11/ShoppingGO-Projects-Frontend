import { createSlice } from '@reduxjs/toolkit';
import React from 'react';

const LoadingSlice = createSlice({
    name : "loading",
    initialState: {
        isLoading : true,
    },
    reducers : {
        setLoading : (state , action)=>{
            state.isLoading = action.payload;
        }
    }
})
export const {setLoading} = LoadingSlice.actions
export default LoadingSlice.reducer;