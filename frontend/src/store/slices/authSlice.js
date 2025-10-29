import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  token: null
}

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logout : (state, action) => {
      state.user = null
      state.token = null
    }
  }
});


export const {setUser, logout} = authSlice.actions
export default authSlice.reducer