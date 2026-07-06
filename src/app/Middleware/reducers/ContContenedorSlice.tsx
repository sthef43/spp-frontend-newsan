import { IContContenedor } from "app/models/IContContenedor";
import { ContContenedorService } from "app/services/contContenedor.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const contContenedorService = new ContContenedorService();
class contContenedorClassSlice extends GenericSlice<IContContenedor> {
  constructor(private service: ContContenedorService) {
    super("ContContenedor", service);
  }
  //nuevos asyncthunks aqui
  getListByEmbarqueIdRequest = createAsyncThunk<IContContenedor[], number>(
    `ContContenedor/getListByEmbarqueIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByEmbarqueId(number), info);
    }
  );
  getListByFechaProgramadoRequest = createAsyncThunk<IContContenedor[], string>(
    `ContContenedor/getListByFechaProgramadoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByFechaProgramado(number), info);
    }
  );
  getListByFechaHastaProgramadoRequest = createAsyncThunk<IContContenedor[], string>(
    `ContContenedor/getListByFechaHastaProgramadoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByFechaHastaProgramado(number), info);
    }
  );
  getListByMesEstadoProgramadoRequest = createAsyncThunk<IContContenedor[], string>(
    `ContContenedor/getListByMesEstadoProgramadoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByMesEstadoProgramado(number), info);
    }
  );
  getListByMesEstadoEntregadoRequest = createAsyncThunk<IContContenedor[], string>(
    `ContContenedor/getListByMesEstadoEntregadoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByMesEstadoEntregado(number), info);
    }
  );
  GetListByPlanProduccionAbiertoRequest = createAsyncThunk<IContContenedor[], string>(
    `ContContenedor/getListByPlanProduccionAbiertoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.getListByPlanProduccionAbierto(number), info);
    }
  );
}
export const ContContenedorSliceRequests = new contContenedorClassSlice(contContenedorService);

const initialState: IIniState<IContContenedor> = {
  loading: null,
  data: null
};

export const contContenedorSlice = createSlice({
  name: "ContContenedor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContContenedorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
