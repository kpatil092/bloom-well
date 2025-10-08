import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export var RootState = store.getState;
export var AppDispatch = store.dispatch;
export default store;
