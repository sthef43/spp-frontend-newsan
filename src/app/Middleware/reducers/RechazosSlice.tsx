import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IControlLote } from "app/models/IControlLote";

export interface initialStateRechazosSlice {
  data: IControlLote[];
  estado: boolean;
}

export interface dtoRechazosSlice {
  data: IControlLote[];
}

const initialState: initialStateRechazosSlice = {
  data: null,
  estado: false
};

export const RechazosSlice = createSlice({
  name: "RechazosSlice",
  initialState: initialState,
  reducers: {
    setAllRechazos: (state, action: PayloadAction<dtoRechazosSlice>) => {
      state.data = action.payload.data;
    },
    setOnInitTrue: (state) => {
      state.estado = true;
    },
    setOnInitFalse: (state) => {
      state.estado = false;
    }
  }
});
