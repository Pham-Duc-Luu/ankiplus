import { axiosApi, ISignInBody } from "@/lib/api/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthState {
  access_token?: string;
  refresh_token?: string;
}

const initAuthState: IAuthState = {};

export const authSlice = createSlice({
  initialState: initAuthState,
  name: "auth",
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refresh_token = action.payload;
    },
  },
});

export const { setAccessToken, setRefreshToken } = authSlice.actions;

export default authSlice.reducer;