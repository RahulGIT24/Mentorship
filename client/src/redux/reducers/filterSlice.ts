import { createSlice } from "@reduxjs/toolkit";
import { IFilter } from "../../types/type";

const initialFilter: IFilter = {
    skills:[],
    interest:[],
    search:"",
    role:""
};

const initialState = {
  filter: initialFilter,
};

const filterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole:(state,action)=>{
        state.filter.role = action.payload;
    },
    setSearch:(state,action)=>{
        state.filter.search = action.payload;
    },
    setSkills:(state,action)=>{
        if(!state.filter.skills?.includes(action.payload)){
            state.filter.skills?.push(action.payload);
        }
    },
    setInterest:(state,action)=>{
        if(!state.filter.interest?.includes(action.payload)){
            state.filter.interest?.push(action.payload);
        }
    },
    removeSkill: (state, action) => {
        if(state.filter.skills){
            state.filter.skills = state.filter.skills.filter(
              (_, index) => index !== action.payload
            );
        }
      },
      removeInterest: (state, action) => {
        if(state.filter.interest){
            state.filter.interest = state.filter.interest.filter(
              (_, index) => index !== action.payload
            );
        }
      },
    revertInitialFilter: (state) => {
      state.filter = initialFilter;
    },
  },
});

export const {revertInitialFilter,setRole,setInterest,setSearch,setSkills,removeInterest,removeSkill} = filterSlice.actions
export default filterSlice.reducer