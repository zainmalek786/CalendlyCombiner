import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,  // Stores user details (not tokens)
  isAuthenticated: false, // Tracks authentication status
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      console.log("slice",state.isAuthenticated);
      
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
