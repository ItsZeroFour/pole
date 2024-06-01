import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchCreateStockItem = createAsyncThunk(
  "/stockItem/createStockItem",
  async ({ id, params }) => {
    const { data } = await axios.post(`/village/createStockItem/${id}`, params);
    return data;
  }
);

export const fetchGetStockItems = createAsyncThunk(
  "/stockItem/getStockItems",
  async (ids) => {
    const { data } = await axios.post(`/village/getStockItems`, { ids });
    return data;
  }
);

export const fetchGetStockItem = createAsyncThunk(
  "/stockItem/getStockItem",
  async (id) => {
    const { data } = await axios.get(`/village/getStockItem/${id}`);
    return data;
  }
);

const initialState = {
  data: null,
  status: null,
};

const stockItemsSlice = createSlice({
  name: "stockItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE STOCK ITEM */
      .addCase(fetchCreateStockItem.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchCreateStockItem.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchCreateStockItem.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* GET STOCK ITEMS */
      .addCase(fetchGetStockItems.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchGetStockItems.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchGetStockItems.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      });
  },
});

export const isLoading = (state) => state.auth.status;
export const stockItemsReducer = stockItemsSlice.reducer;
