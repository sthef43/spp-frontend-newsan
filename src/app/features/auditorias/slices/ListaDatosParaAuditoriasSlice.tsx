import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListaDatosParaAuditorias } from "../models/utils/IListaDatosParaAuditorias";
import { IAuditoriaValores } from "../models/IAuditoriaValores";
import { IAuditoriaGrupoItems } from "../models/IAuditoriaGrupoItems";
import { IAuditoriaListaValores } from "../models/IAuditoriaListaValores";
import { IAuditoriaGrupoItemsResult } from "../models/IAuditoriaGrupoItemsResult";
import { IAuditoriaValoresResult } from "../models/IAuditoriaValoresResult";

const initialState: IListaDatosParaAuditorias = {
  bloques: [],
  listaEmails: "",

  listaValores: [],
  listaValoresPreview: [],

  listaValoresPadre: null,
  tipoProductoId: 0,
  tipoAuditoriaId: null,
  listaValoresResult: []
};

export const statesListDataForAuditoriasSlice = createSlice({
  name: "statesListDataForAuditorias",
  initialState,
  reducers: {
    setListaEmails: (state, action: PayloadAction<string>) => {
      state.listaEmails = action.payload;
    },
    setTipoAuditoria: (state, action: PayloadAction<number>) => {
      state.tipoAuditoriaId = action.payload;
    },
    setTipoProductoId: (state, action: PayloadAction<number>) => {
      state.tipoProductoId = action.payload;
    },

    setListaValoresPadre: (state, action: PayloadAction<IAuditoriaListaValores>) => {
      state.listaValoresPadre = action.payload;
    },
    setBloques: (state, action: PayloadAction<IAuditoriaGrupoItems | IAuditoriaGrupoItemsResult>) => {
      state.bloques = [...state.bloques, action.payload];
    },
    setBloquesVacio: (state, action: PayloadAction<[]>) => {
      state.bloques = action.payload;
    },
    deleteBloques: (state, action: PayloadAction<number>) => {
      const index = state.bloques.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.bloques.splice(index, 1);
      }
    },
    setListaValores: (state, action: PayloadAction<IAuditoriaValores[] | IAuditoriaValoresResult[]>) => {
      state.listaValores = action.payload;
      state.listaValoresResult = action.payload as IAuditoriaValoresResult[];
    },
    setListaValoresPreview: (state, action: PayloadAction<IAuditoriaValores[]>) => {
      state.listaValoresPreview = action.payload;
    }
  }
});
