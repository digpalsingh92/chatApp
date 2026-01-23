import { parseJwt } from "@/utils/helper";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: {},
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const decodedData = parseJwt(action.payload.token);
      state.userDetails = decodedData;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      const decodedData = parseJwt(action.payload.token);
      state.userDetails = decodedData;
      state.isAuthenticated = true;
      state.loading = false;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      removeToken();
      state.userDetails = {};
      state.isAuthenticated = false;
    },
  },
});

export const {
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
