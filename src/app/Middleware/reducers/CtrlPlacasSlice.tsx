import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { ICtrlPlacas } from "app/models/ICtrlPlacas";
import { CtrlPlacasService } from "app/services/ctrlPlacas.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const ctrlPlacasService = new CtrlPlacasService();
class ctrlPlacasClassSlice extends GenericSlice<ICtrlPlacas> {
  constructor(private service: CtrlPlacasService) {
    super("CtrlPlacas", service);
  }
  //nuevos asyncthunks aqui
  getListByPlantIdLineaIdRequest = createAsyncThunk<ICtrlPlacas[], {plantId; lineaId; fechaDesde; fechaHasta}>(
    `CtrlPlacas/getListByPlantIdLineaIdRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByPlantIdLineaId(modelo), info);
    }
  );  

  //
  getAmountByHour = createAsyncThunk<Array<{lineaProduccionId:number, hora:number, cantidad:number}>, {lineaProduccionId, fecha, desde, hasta}>(
    `CtrlPlacas/GetAmountByHour`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAmountByHour(modelo ), info);
    }
  );  

  getAmountByDates = createAsyncThunk<Array<{lineaProduccionId:number, fecha:string, cantidad:number}>, {lineaProduccionId, fechaDesde, fechaHasta, desde, hasta}>(
    `CtrlPlacas/GetAmountByDates`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAmountByDates(modelo ), info);
    }
  );    
  getListByCtrlPlacasHallazgosIdRequest = createAsyncThunk<ICtrlPlacas[], number>(
    `CtrlPlacas/getListByCtrlPlacasHallazgosIdRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListByCtrlPlacasHallazgosId(number), info);
    }
  );
}
export const CtrlPlacasSliceRequests = new ctrlPlacasClassSlice(ctrlPlacasService);

const initialState: IIniState<ICtrlPlacas> = {
  loading: null,
  data: null
};

export const ctrlPlacasSlice = createSlice({
  name: "CtrlPlacas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CtrlPlacasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
