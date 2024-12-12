import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/type";

const initialUser: IUser = {
  _id: "",
  name: "",
  username: "",
  createdAt: "",
  email: "",
  verificationStatus: false,
  updatedAt: "",
};

const initialState = {
  user: initialUser,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    revertInitial: (state) => {
      state.isAuthenticated = false;
      state.user = initialUser;
    },
  },
});

export const {setUser,setAuth,revertInitial} = userSlice.actions
export default userSlice.reducer