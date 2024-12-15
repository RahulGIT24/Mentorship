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
  role:"",
  skills:[],
  interest:[],
  bio: "",
  unreadNotifications:0
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
    decrementUnreadNotifications:(state)=>{
      if(state.user.unreadNotifications === 0) return;
      state.user.unreadNotifications = state.user.unreadNotifications-1;
    },
    revertInitial: (state) => {
      state.isAuthenticated = false;
      state.user = initialUser;
    },
  },
});

export const {setUser,setAuth,revertInitial,decrementUnreadNotifications} = userSlice.actions
export default userSlice.reducer