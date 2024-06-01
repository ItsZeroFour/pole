import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchMove = createAsyncThunk(
  "/moveStockItem/fetchMove",
  async ({ id, itemParams }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/village/moveItem/${id}`, itemParams);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  data: null,
  status: null,
};

const moveStockItem = createSlice({
  name: "moveStockItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMove.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchMove.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchMove.rejected, (state, action) => {
        state.status = "loaded";
        state.data = null;
      });
  },
});

export const moveStockItemReducer = moveStockItem.reducer;
export const isLoading = (state) => state.auth.status;
