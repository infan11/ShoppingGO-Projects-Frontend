import { createSlice } from "@reduxjs/toolkit";
const initialState  ={
    user : null,
    token : null,
    loading : true
}
const AuthSlice = createSlice({
    name : "auth", initialState,
    reducers  : {
        setUser  : (state , action  ) => {
            state.user = action.payload
        },
        setToken: (state , action ) => {
            state.token  = action.payload
        },
        setLoading : (state , action ) => {
            state.loading = action.payload
        },
     
        
    }
})
export const {setUser , setToken, setLoading } = AuthSlice.actions
export default AuthSlice.reducer;