import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { TicketsItemsProcesosBloquesService } from "../services/TicketsItemsProcesosBloques.service";
import { ITicketsItemsProcesosBloque } from "../models/ITicketsItemsProcesosBloque";

const ticketsItemsProcesosBloquesService = new TicketsItemsProcesosBloquesService();

class TicketsItemsProcesosBloquesClassSlice extends GenericSlice<ITicketsItemsProcesosBloque> {
  constructor(private service: TicketsItemsProcesosBloquesService) {
    super("TicketsItemsProcesosBloque", service);
  }

  GetAllItemsByAddInBloq = createAsyncThunk<ITicketsItemsProcesosBloque[], number>(
    `TicketsItemsProcesosBloque/GetAllItemsByAddInBloq`,
    async (itemId, info) => {
      return await errorNotification(() => this.service.GetAllItemsByAddInBloq(itemId), info);
    }
  );

  GetAllItemsByGroupProccesId = createAsyncThunk<ITicketsItemsProcesosBloque[], number>(
    `TicketsItemsProcesosBloque/GetAllItemsByGroupProccesId`,
    async (groupId, info) => {
      return await errorNotification(() => this.service.GetAllItemsByGroupProccesId(groupId), info);
    }
  );
}

export const TicketsItemsProcesosBloquesSliceRequest = new TicketsItemsProcesosBloquesClassSlice(
  ticketsItemsProcesosBloquesService
);

const inititalState: IIniState<ITicketsItemsProcesosBloque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const TicketsItemsProcesosBloques = createSlice({
  name: "TicketsItemsProcesosBloque",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsItemsProcesosBloquesSliceRequest.builderAll(builder);
  }
});
