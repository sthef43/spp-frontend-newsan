import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  estado: false
};

export const FirstLoginSlice = createSlice({
  name: "FirstLoginSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialState,
  reducers: {
    FirstLogin: (state) => {
      state.estado = true;
    },
    changeToFalse: (state) => {
      state.estado = false;
    }
  }
});
//export const { uiOpenModal, uiCloseModal } = uiSlice.actions;
//export default uiSlice.reducer;
