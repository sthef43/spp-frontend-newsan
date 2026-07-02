import { AlertColor } from "@mui/material/Alert";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface dataNeaded {
  type: AlertColor;
  Mensaje: string;
}

export interface iniState {
  open: boolean;
  type: AlertColor;
  Mensaje: string;
}
const initialState: iniState = {
  open: false,
  type: "success",
  Mensaje: ""
};

export const NotificationSlice = createSlice({
  name: "notificationUI",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialState,
  reducers: {
    notificationUIopen: (state, action: PayloadAction<dataNeaded>) => {
      state.open = true;
      state.type = action.payload.type;
      state.Mensaje = action.payload.Mensaje;
    },
    notificationUIclose: (state) => {
      state.open = false;
    }
  }
});
//export const { uiOpenModal, uiCloseModal } = uiSlice.actions;
//export default uiSlice.reducer;
