import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchCreateShipment = createAsyncThunk(
  "/shipment/fetchCreate",
  async (
    { villageId, stockId, stockItemId, count, agent, price, culture },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(`/village/createShipment`, {
        villageId,
        stockId,
        stockItemId,
        count,
        agent,
        price,
        culture,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchGetShipmentHistory = createAsyncThunk(
  "/shipment/fetchGetHistory",
  async (id) => {
    const { data } = await axios.get(`/village/getShipment/${id}`);

    return data;
  }
);

const initialState = {
  data: null,
  status: null,
};

const shipment = createSlice({
  name: "shipment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateShipment.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchCreateShipment.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchCreateShipment.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })
      .addCase(fetchGetShipmentHistory.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchGetShipmentHistory.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchGetShipmentHistory.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      });
  },
});

export const shipmentReducer = shipment.reducer;
export const isLoading = (state) => state.auth.status;
