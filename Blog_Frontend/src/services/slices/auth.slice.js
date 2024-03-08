import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
  },
  reducers: {
    setUsers: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearUsers: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    refreshUserToken: (state, action) => {
      state.user.token = action.payload;
    },
  },
});

export const { setUsers, clearUsers } = authSlice.actions;

export default authSlice.reducer;
