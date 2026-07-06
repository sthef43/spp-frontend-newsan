import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IExtintor } from "app/models/IExtintor";
import { ExtintorService } from "app/services/extintor.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models";

const extintorService = new ExtintorService();
class extintorClassSlice extends GenericSlice<IExtintor> {
  constructor(private service: ExtintorService) {
    super("Extintor", service);
  }
  //nuevos asyncthunks aqui
  getListVencidosByPlantRequest = createAsyncThunk<IExtintor[], number>(
    `Extintor/getListVencidosByPlantRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetListVencidosByPlant(number), info);
    }
  );
  getListByPSPARequest = createAsyncThunk<IExtintor[], { planta; sitio; proceso; agente }>(
    `Extintor/getListByPSPARequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByPSPA(modelo), info);
    }
  );
  getByNumeroCilindroRequest = createAsyncThunk<IExtintor[], number>(
    `Extintor/getByNumeroCilindroRequest`,
    async (number, info) => {
      return await errorNotification(() => this.service.GetByNumeroCilindro(number), info);
    }
  );
}
export const ExtintorSliceRequests = new extintorClassSlice(extintorService);

const initialState: IIniState<IExtintor> = {
  loading: null,
  data: null
};

export const extintorSlice = createSlice({
  name: "Extintor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ExtintorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
