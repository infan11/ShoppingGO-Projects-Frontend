import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    registerUser : [],
}
const usersSlice = createSlice({
    name: "usersSlice",
    initialState,
    reducers : {
        addUsers : (state , {payload}) => {
            if(state.registerUser.length == 0){
                state.registerUser.push({id : 1 ,payload})
            }
            else {
                const lastElement = state.registerUser.at(-1);
                state.registerUser.push({id : lastElement.id + 1 , ... payload })
            }
            
        } 
    }
}) 
export const {addUsers} = usersSlice.actions;
export default usersSlice.reducer