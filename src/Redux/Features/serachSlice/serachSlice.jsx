// redux/slices/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSuggestions = createAsyncThunk(
    "search/fetchSuggestions",
    async (query, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/api/search?q=${query}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const searchSlice = createSlice({
    name: "search",
    initialState: {
        keyword: "",
        suggestions: [],
        loading: false,
        error: null,
        saved: [],
    },
    reducers: {
        setKeyword: (state, action) => {
            state.keyword = action.payload;
        },
        addSavedSearch: (state, action) => {
            if (!state.saved.includes(action.payload)) {
                state.saved.unshift(action.payload);
            }
        },
        deleteSavedSearch: (state, action) => {
            state.saved = state.saved.filter((k) => k !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuggestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuggestions.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestions = action.payload;
            })
            .addCase(fetchSuggestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch suggestions";
            });
    },
});

export const { setKeyword, addSavedSearch, deleteSavedSearch } = searchSlice.actions;
export default searchSlice.reducer;
