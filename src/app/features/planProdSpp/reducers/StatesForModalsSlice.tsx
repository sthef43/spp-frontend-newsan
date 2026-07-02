import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDataExcelFormat } from "../models/IDataExcelFormat";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";

export interface StatesForModals {
  mostrarInformacionModelo: boolean;
  mostrarInformacionModeloNuevaTabla: boolean;
  mostrarContenedores: boolean;
  openModalEditar: boolean;
  nuevosRegistrosPlanProd: boolean;
  mesSeleccionado: string;
  mesFinSeleccionado: string;
  mesSeleccionadoEditPlan: string;

  dataFormatExcel: IDataExcelFormat[];
  dataFormatExcelEmbarque: IPlanProdSppEmbarque[];

  listaPosiciones: number[];
  listaPosicionesOriginal: number[];
  listaMeses: string[];
  listaMesAndPosicionMasAlta: any[];
}

const initialState: StatesForModals = {
  mostrarContenedores: false,
  mostrarInformacionModelo: false,
  mostrarInformacionModeloNuevaTabla: false,
  nuevosRegistrosPlanProd: false,
  openModalEditar: false,
  mesSeleccionado: "",
  mesFinSeleccionado: "",

  dataFormatExcel: [],
  dataFormatExcelEmbarque: [],

  listaPosiciones: [],
  listaPosicionesOriginal: [],
  listaMeses: [],
  listaMesAndPosicionMasAlta: [],
  mesSeleccionadoEditPlan: ""
};

export const StatesFormModalsSlice = createSlice({
  name: "StatesForModals",
  initialState: initialState,
  reducers: {
    setShowMostrarInformacionModelo: (state, action: PayloadAction<boolean>) => {
      state.mostrarInformacionModelo = action.payload;
    },
    setShowMostrarInformacionModeloNuevaTabla: (state, action: PayloadAction<boolean>) => {
      state.mostrarInformacionModeloNuevaTabla = action.payload;
    },
    setMostrarContenedores: (state, action: PayloadAction<boolean>) => {
      state.mostrarContenedores = action.payload;
    },
    setOpenModalEditar: (state, action: PayloadAction<boolean>) => {
      state.mostrarContenedores = action.payload;
    },

    //ESTADOS PARA LOS DATOS DEL EXCEL FORMATEADOS
    setDataFormatExcel: (state, action: PayloadAction<IDataExcelFormat[]>) => {
      state.dataFormatExcel = action.payload;
    },
    setDataFormatExcelEmbarque: (state, action: PayloadAction<IPlanProdSppEmbarque[]>) => {
      state.dataFormatExcelEmbarque = action.payload;
    },

    setMes: (state, action: PayloadAction<string>) => {
      state.mesSeleccionado = action.payload;
    },
    setFinMes: (state, action: PayloadAction<string>) => {
      state.mesFinSeleccionado = action.payload;
    },
    setMesEditPlan: (state, action: PayloadAction<string>) => {
      state.mesSeleccionadoEditPlan = action.payload;
    },
    setNuevosResgistrosPlanProd: (state, action: PayloadAction<boolean>) => {
      state.nuevosRegistrosPlanProd = action.payload;
    },
    setListaPosiciones: (state, action: PayloadAction<number[]>) => {
      state.listaPosiciones = action.payload;
    },
    setListaPosicionesOriginal: (state, action: PayloadAction<number[]>) => {
      state.listaPosicionesOriginal = action.payload;
    },
    setListaMeses: (state, action: PayloadAction<string[]>) => {
      state.listaMeses = action.payload;
    },
    setListaMesAndPosicionMasAlta: (state, action: PayloadAction<any[]>) => {
      state.listaMesAndPosicionMasAlta = action.payload;
    }
  }
});
