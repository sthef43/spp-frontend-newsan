import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuditoriaValores } from "../models/IAuditoriaValores";
import { IAuditoriaGrupoItems } from "../models/IAuditoriaGrupoItems";
import { IAuditoriaListaValores } from "../models/IAuditoriaListaValores";
import { IAuditoriaGrupoItemsResult } from "../models/IAuditoriaGrupoItemsResult";
import { IAuditoriaValoresResult } from "../models/IAuditoriaValoresResult";

interface AuditoriasUIState {
  cantidadBloques: number;
  bloqueSeleccionado: Record<number, string | number>;
  edicionActiva: boolean;
  estadoModalNuevoTipo: boolean;
  mostrarListaValores: boolean;
  bloques: (IAuditoriaGrupoItems | IAuditoriaGrupoItemsResult)[];
  listaEmails: string;
  listaValores: IAuditoriaValores[];
  listaValoresPreview: IAuditoriaValores[];
  listaValoresPadre: IAuditoriaListaValores | null;
  tipoProductoId: number;
  tipoAuditoriaId: number | null;
  listaValoresResult: IAuditoriaValoresResult[];
  activeFetchListaValores: boolean;
  activeFetchTipoAuditoria: boolean;
  activeBloqItems: boolean;
  activeFetchTipoAgrupacion: boolean;
}

const initialState: AuditoriasUIState = {
  cantidadBloques: 0,
  bloqueSeleccionado: {},
  edicionActiva: false,
  estadoModalNuevoTipo: false,
  mostrarListaValores: false,
  bloques: [],
  listaEmails: "",
  listaValores: [],
  listaValoresPreview: [],
  listaValoresPadre: null,
  tipoProductoId: 0,
  tipoAuditoriaId: null,
  listaValoresResult: [],
  activeFetchListaValores: true,
  activeFetchTipoAuditoria: true,
  activeBloqItems: true,
  activeFetchTipoAgrupacion: true
};

export const auditoriasUISlice = createSlice({
  name: "auditoriasUI",
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
    },
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
    },
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
