import { IContPedido } from "app/models/IContPedido";
import { ContPedidoService } from "app/services/contPedido.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const contPedidoService = new ContPedidoService();
class contPedidoClassSlice extends GenericSlice<IContPedido> {
  constructor(private service: ContPedidoService) {
    super("ContPedido", service);
  }
  //nuevos asyncthunks aqui
  getListByFechaProgramadoRequest = createAsyncThunk<IContPedido[], string>(
    `ContPedido/getListByFechaProgramadoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByFechaProgramado(number), info);
    }
  );
  getListByFechaHastaProgramadoRequest = createAsyncThunk<IContPedido[], string>(
    `ContPedido/getListByFechaHastaProgramadoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByFechaHastaProgramado(number), info);
    }
  );
  getListByContContenedorIdRequest = createAsyncThunk<IContPedido[], number>(
    `ContPedido/getListByContContenedorIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByContContenedorId(number), info);
    }
  );
  getListByMesEstadoProgramadoRequest = createAsyncThunk<IContPedido[], string>(
    `ContPedido/getListByMesEstadoProgramadoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByMesEstadoProgramado(number), info);
    }
  );
  getListByMesEstadoEntregadoRequest = createAsyncThunk<IContPedido[], string>(
    `ContPedido/getListByMesEstadoEntregadoRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByMesEstadoEntregado(number), info);
    }
  );
}
export const ContPedidoSliceRequests = new contPedidoClassSlice(contPedidoService);

const initialState: IIniState<IContPedido> = {
  loading: null,
  data: null
};

export const contPedidoSlice = createSlice({
  name: "ContPedido",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContPedidoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
