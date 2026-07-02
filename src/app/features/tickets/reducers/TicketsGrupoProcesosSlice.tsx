import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsGrupoProcesos } from "app/features/tickets/models/iTicketsGrupoProcesos";
import { TicketsGruposProcesosService } from "../services/TicketsGrupoProcesos.service";

const ticketGrupoProcesosService = new TicketsGruposProcesosService();

class ticketsGrupoProcesosClassSlice extends GenericSlice<ITicketsGrupoProcesos> {
  constructor(private service: TicketsGruposProcesosService) {
    super("TicketsGrupoProcesos", service);
  }

  GetGrupoProcesosWithItemsById = createAsyncThunk<ITicketsGrupoProcesos, number>(
    `Tickets/GetGrupoProcesosWithItemsById`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetGrupoProcesosWithItemsById(id), info);
    }
  );

  GetAllGroupsByCategoriaId = createAsyncThunk<ITicketsGrupoProcesos[], number>(
    `Tickets/GetAllGroupsByCategoriaId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllGroupsByCategoriaId(id), info);
    }
  );

  GetAllDetailsById = createAsyncThunk<ITicketsGrupoProcesos[], number>(
    `Tickets/GetAllDetailsById`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllDetailsById(id), info);
    }
  );

  DeleteGrupoWithBlock = createAsyncThunk<ITicketsGrupoProcesos, number>(
    `Tickets/DeleteGrupoWithBlock`,
    async (id, info) => {
      return await errorNotification(() => this.service.DeleteGrupoWithBlock(id), info);
    }
  );
}

export const TicketsGrupoProcesosSliceRequest = new ticketsGrupoProcesosClassSlice(ticketGrupoProcesosService);

const initialState: IIniState<ITicketsGrupoProcesos> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsGrupoProcesosSlice = createSlice({
  name: "TicketsGrupoProcesos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsGrupoProcesosSliceRequest.builderAll(builder);
  }
});
