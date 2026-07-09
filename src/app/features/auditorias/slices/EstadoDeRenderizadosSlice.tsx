import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEstadoDeRenderizado } from "../models/utils/IEstadoDeRenderizado";

const initialState: IEstadoDeRenderizado = {
  cantidadBloques: 0,
  bloqueSeleccionado: {},
  edicionActiva: false,
  estadoModalNuevoTipo: false,
  mostrarListaValores: false
};

export const estadoDeRenderizadosSlice = createSlice({
  name: "estadoDeRenderizados",
  initialState,
  reducers: {
    setCantidadBloques: (state, action: PayloadAction<number>) => {
      state.cantidadBloques = action.payload;
    },
    setBloqueSeleccionado: (state, action: PayloadAction<Record<number, string | number>>) => {
      state.bloqueSeleccionado = action.payload;
    },
    setEdicionActiva: (state, action: PayloadAction<boolean>) => {
      state.edicionActiva = action.payload;
    },
    setEstadoModalNuevoTipo: (state, action: PayloadAction<boolean>) => {
      state.estadoModalNuevoTipo = action.payload;
    },
    setMostrarListaValores: (state, action: PayloadAction<boolean>) => {
      state.mostrarListaValores = action.payload;
    }
  }
});
