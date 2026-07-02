import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface iniStateLoading {
  Mensaje: string;
  state: boolean;
  stateKeleton: boolean;
}
const initialState: iniStateLoading = {
  Mensaje: "Cargando",
  state: false,
  stateKeleton: false
};

export const LoadingUISlice = createSlice({
  name: "LoadingUI",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialState,
  reducers: {
    LoadingUIOpen: (state, action: PayloadAction<string>) => {
      state.Mensaje = action.payload;
      state.state = true;
    },
    LoadingUIClose: (state) => {
      state.Mensaje = "Cargando";
      state.state = false;
    },
    LoadingUIOpenSkeleton: (state) => {
      state.stateKeleton = true;
    },
    LoadingUICloseSkeleton: (state) => {
      state.stateKeleton = false;
    }
  }
});
//export const { uiOpenModal, uiCloseModal } = uiSlice.actions;
//export default uiSlice.reducer;
