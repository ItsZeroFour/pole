import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchCreateStock = createAsyncThunk(
  "/stock/createStock",
  async ({ id, params }) => {
    const { data } = await axios.post(`/village/createStock/${id}`, params);
    return data;
  }
);

export const fetchGetStock = createAsyncThunk(
  "/stock/GetStock",
  async ({ id, params }) => {
    const { data } = await axios.get(`/village/getStock/${id}`, params);
    return data;
  }
);

export const fetchGetStocks = createAsyncThunk(
  "/stock/GetStocks",
  async (id) => {
    const { data } = await axios.get(`/village/getStocks/${id}`);
    return data;
  }
);

const initialState = {
  data: null,
  status: null,
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE STOCK */
      .addCase(fetchCreateStock.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchCreateStock.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchCreateStock.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* GET STOCK */
      .addCase(fetchGetStock.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchGetStock.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchGetStock.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* GET STOCKS */
      .addCase(fetchGetStocks.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchGetStocks.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchGetStocks.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      });
  },
});

export const isLoading = (state) => state.auth.status;
export const stockReducer = stockSlice.reducer;
