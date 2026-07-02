import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface dataNeaded {
  Mensaje: string;
  Title: string;
  Callback: any;
  Body?: JSX.Element;
  AceptarButton: string;
  RechazarButton: string;
}

export interface iniState {
  Open: boolean;
  Mensaje: string;
  Title: string;
  Callback: any;
  Body?: JSX.Element;
  AceptarButton: string;
  RechazarButton: string;
}
const initialState: iniState = {
  Open: false,
  Title: "",
  Mensaje: "",
  Callback: null,
  Body: null,
  AceptarButton: "Aceptar",
  RechazarButton: "Cancelar"
};

export const AlterDialogUISlice = createSlice({
  name: "AlterDialogUI",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialState,
  reducers: {
    AlterDialogUIopen: (state, action: PayloadAction<dataNeaded>) => {
      state.Title = action.payload.Title;
      state.Mensaje = action.payload.Mensaje;
      state.Open = true;
      state.Callback = action.payload.Callback;
      state.Body = action.payload.Body || null;
      state.AceptarButton = action.payload.AceptarButton || "Aceptar";
      state.RechazarButton = action.payload.RechazarButton || "Cancelar";
    },
    AlterDialogUIclose: (state) => {
      state.Callback = null;
      state.Mensaje = "";
      state.Open = false;
      state.Title = "";
      state.Body = null;
      state.AceptarButton = "Aceptar";
      state.RechazarButton = "Cancelar";
    }
  }
});

