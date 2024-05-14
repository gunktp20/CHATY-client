import { createSlice } from "@reduxjs/toolkit";
import { AddUserFunc, IAuthState } from "./types";

const token = localStorage.getItem("token");

const initialState: IAuthState = {
  token: token || null,
};

const addUserToLocalStorage: AddUserFunc = (token) => {
  localStorage.setItem("token", token);
};

const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredential: (state, action) => {
      addUserToLocalStorage(action.payload.token);
      return {
        ...state,
        token: action.payload.token,
      };
    },
  },
});

export const { setCredential } = AuthSlice.actions;

export default AuthSlice.reducer;
