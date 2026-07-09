import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStatesForActiveFetchs } from "../models/utils/IStatesForActiveFetchs";

const initialState: IStatesForActiveFetchs = {
  activeFetchListaValores: true,
  activeFetchTipoAuditoria: true,
  activeBloqItems: true,
  activeFetchTipoAgrupacion: true
};

export const statesForActiveFetchsSlice = createSlice({
  name: "statesForActiveFetchs",
  initialState,
  reducers: {
    setActiveFetchListaValores: (state, action: PayloadAction<boolean>) => {
      state.activeFetchListaValores = action.payload;
    },
    setActiveFetchTipoAuditoria: (state, action: PayloadAction<boolean>) => {
      state.activeFetchTipoAuditoria = action.payload;
    },
    setActiveBloqItems: (state, action: PayloadAction<boolean>) => {
      state.activeBloqItems = action.payload;
    },
    setActiveFetchTipoAgrupacion: (state, action: PayloadAction<boolean>) => {
      state.activeFetchTipoAgrupacion = action.payload;
    }
  }
});
