import { createSlice } from "@reduxjs/toolkit";
import { AddUserFunc, IAuthState } from "./types";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

interface AccessTokenPayload {
  userId: string;
  email: string;
  roles: [];
  iat: number;
  exp: number;
}

const decoded: AccessTokenPayload | undefined = token
  ? jwtDecode(token)
  : undefined;

const initialState: IAuthState = {
  token: token || "",
  userId: decoded?.userId || "",
  email: decoded?.email || "",
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
