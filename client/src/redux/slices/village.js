import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchCreate = createAsyncThunk(
  "/village/createVillage",
  async (params) => {
    const { data } = await axios.post("/village/create", params);
    return data;
  }
);

export const fetchGetAll = createAsyncThunk(
  "/village/getAllVillages",
  async () => {
    const { data } = await axios.get("/village/getAll");
    return data;
  }
);

const initialState = {
  data: null,
  status: null,
  stocks: [],
  stockItems: [],
};

const villageSlice = createSlice({
  name: "village",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* CREATE */
    builder
      .addCase(fetchCreate.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchCreate.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchCreate.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      /* GET ALL VILLAGES */
      .addCase(fetchGetAll.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchGetAll.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchGetAll.rejected, (state) => {
        state.status = "loaded";
        state.data = null;
      })

      
  },
});


export const isLoading = (state) => state.auth.status;
export const villagesReducer = villageSlice.reducer