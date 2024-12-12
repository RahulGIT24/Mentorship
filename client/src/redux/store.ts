import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice.js";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload"],
      },
    }),
  reducer: {
    user: userReducer,
  },
});

export default store;
