import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsItemsProcesos } from "app/features/tickets/models/ITicketsItemsProcesos";
import { TicketsItemsProcesosService } from "../services/TicketsItemsProcesos.service";

const ticketsItemsProcesosService = new TicketsItemsProcesosService();

class ticketsItemsProcesosClassSlice extends GenericSlice<ITicketsItemsProcesos> {
  constructor(private service: TicketsItemsProcesosService) {
    super("TicketsItemsProcesos", service);
  }

  GetAllItemsWithoutGroup = createAsyncThunk<ITicketsItemsProcesos[], { grupoId; categoriaId }>(
    `Tickets/GetAllItemsWithoutGroup`,
    async ({ grupoId, categoriaId }, info) => {
      return await errorNotification(() => this.service.GetAllItemsWithoutGroup(grupoId, categoriaId), info);
    }
  );

  GetAllWithGroup = createAsyncThunk<ITicketsItemsProcesos[], number>(`Tickets/GetAllWithGroup`, async (id, info) => {
    return await errorNotification(() => this.service.GetAllWithGroup(id), info);
  });

  GetAllItemsByRolId = createAsyncThunk<ITicketsItemsProcesos[], number>(
    `TicketsItemsProcesosResultados/GetAllItemsByRolId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllItemsByRolId(id), info);
    }
  );
}

export const TicketsItemsProcesosSliceRequest = new ticketsItemsProcesosClassSlice(ticketsItemsProcesosService);

const initialState: IIniState<ITicketsItemsProcesos> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsItemsProcesosSlice = createSlice({
  name: "TicketsItemsProcesos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsItemsProcesosSliceRequest.builderAll(builder);
  }
});
