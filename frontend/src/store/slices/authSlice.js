import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // user object or null
  token: undefined, // auth token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    updateUser(state, action) {
      if (state.user) {
        // Merge the existing user object with partial updates
        state.user = { ...state.user, ...action.payload };
      }
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = undefined;
    },
  },
});

export const { setUser, updateUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
