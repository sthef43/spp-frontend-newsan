import { IValidarQrLg } from "app/models/IValidarQrLg";
import { ValidarQrLgService } from "app/services/validarQrLg.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const validarQrLgService = new ValidarQrLgService();
class validarQrLgClassSlice extends GenericSlice<IValidarQrLg> {
  constructor(private service: ValidarQrLgService) {
    super("ValidarQrLg", service);
  }
  //nuevos asyncthunks aqui
  getListByPlantaLineaProductoRequest = createAsyncThunk<IValidarQrLg[], {plantaId; lineaId, productoId}>(
    `ValidarQrLg/getListByPlantaLineaProductoRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByPlantaLineaProducto(modelo), info);
    }
  );  
  getListByPLPFechaRequest = createAsyncThunk<IValidarQrLg[], {plantaId; lineaId, productoId, fechaDesde, fechaHasta}>(
    `ValidarQrLg/getListByPLPFechaRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByPLPFecha(modelo), info);
    }
  );  
  getListByCodigoRequest = createAsyncThunk<IValidarQrLg[], string>(
    `ValidarQrLg/getListByCodigoRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByCodigo(modelo), info);
    }
  );
  getListByPLPMCRequest = createAsyncThunk<IValidarQrLg[], {plantaId; lineaId, productoId, modeloId, codigo}>(
    `ValidarQrLg/getListByPLPMCRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByPLPMC(modelo), info);
    }
  ); 
}
export const ValidarQrLgSliceRequests = new validarQrLgClassSlice(validarQrLgService);

const initialState: IIniState<IValidarQrLg> = {
  loading: null,
  data: null
};

export const validarQrLgSlice = createSlice({
  name: "ValidarQrLg",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ValidarQrLgSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
