import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice.js";
import filterReducer from "./reducers/filterSlice.js";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload"],
      },
    }),
  reducer: {
    user: userReducer,
    filter:filterReducer
  },
});

export default store;
