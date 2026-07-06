/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPermisos } from "app/models";
import { GetInfoUser, LogOutUser, TokenUserInfomation } from "app/shared/helpers/userConfig";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
//<IAuth, IAuthUser>
interface authNeded {
  AUTH_TOKEN: string;
  username: string;
  id: number;
  dni: number;
  permisos: IPermisos;
}

const AuthenticateState = {
  data: {
    AUTH_TOKEN: "",
    username: "",
    id: 0,
    dni: 0,
    permisos: {}
  }
};
const information = () => {
  if (TokenUserInfomation().AUTH_TOKEN) {
    const info = GetInfoUser();
    const token = TokenUserInfomation().AUTH_TOKEN;
    const decodicar: any = jwt_decode(token);
    return {
      data: {
        AUTH_TOKEN: TokenUserInfomation().AUTH_TOKEN,
        dni: info.dni,
        username: info.username,
        id: info.id,
        permisos: JSON.parse(decodicar.permisos)
      }
    };
  } else return AuthenticateState;
};

export const authenticationSlice = createSlice({
  name: "Authentication",
  initialState: information(),
  reducers: {
    SetInfoUser: (state, action: PayloadAction<authNeded>) => {
      state.data.AUTH_TOKEN = action.payload.AUTH_TOKEN;
      state.data.username = action.payload.username;
      state.data.id = action.payload.id;
      state.data.dni = action.payload.dni;
    },
    deleteInfoUser: (state) => {
      state.data = AuthenticateState.data;
    },
    ForceLogOut: (state) => {
      state.data = AuthenticateState.data;
      LogOutUser();
    }
  }
});
