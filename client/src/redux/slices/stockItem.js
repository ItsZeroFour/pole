import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchGetStockItem = createAsyncThunk(
  "/stockItem/getStockItem",
  async (id) => {
    const { data } = await axios.get(`/village/getStockItem/${id}`);
    return data;
  }
);

export const fetchUpdateStockItem = createAsyncThunk(
  "/stockItem/updateStockItem",
  async (id, itemId, params) => {
    console.log(id, itemId, params);

    const { data } = await axios.patch(
      `/village/updateStockItem/${id}/${itemId}`,
      params
    );

    return data;
  }
);

const initialState = {
  data: null,
  status: null,
};

const stockItemSlice = createSlice({
  name: "stockItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* UPDATE STOCK ITEM */
      .addCase(fetchUpdateStockItem.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchUpdateStockItem.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchUpdateStockItem.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* GET STOCK ITEM */
      .addCase(fetchGetStockItem.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchGetStockItem.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchGetStockItem.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      });
  },
});

export const isLoading = (state) => state.auth.status;
export const stockItemReducer = stockItemSlice.reducer;
