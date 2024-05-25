import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth";
import { villagesReducer } from "./slices/village";
import { stockReducer } from "./slices/stock";
import { stockItemsReducer } from "./slices/stockItems";

const store = configureStore({
  reducer: {
    auth: authReducer,
    villages: villagesReducer,
    stock: stockReducer,
    stockItems: stockItemsReducer
  },
});

export default store;
