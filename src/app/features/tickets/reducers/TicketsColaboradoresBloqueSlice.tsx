import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsColaboradoresBloque } from "app/features/tickets/models/ITicketsColaboradoresBloque";
import { TicketsColaboradoresBloqueService } from "../services/TicketsColaboradoresBloque.service";

const ticketsColaboradoresBloqueService = new TicketsColaboradoresBloqueService();

class ticketsColaboradoresBloqueClassSlice extends GenericSlice<ITicketsColaboradoresBloque> {
  constructor(private service: TicketsColaboradoresBloqueService) {
    super("TicketsColaboradoresBloque", service);
  }

  GetAllColabsByTicket = createAsyncThunk<ITicketsColaboradoresBloque[], number>(
    `TicketsGrupoProcesosBloque/GetAllColabsByTicket`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllColabsByTicket(id), info);
    }
  );

  SearchColaborador = createAsyncThunk<boolean, { colaboradorId; ticketId }>(
    `TicketsGrupoProcesosBloque/SearchColaborador`,
    async ({ colaboradorId, ticketId }, info) => {
      return await errorNotification(() => this.service.SearchColaborador(colaboradorId, ticketId), info);
    }
  );
}

export const TicketsColaboradoresBloqueSliceRequest = new ticketsColaboradoresBloqueClassSlice(
  ticketsColaboradoresBloqueService
);

const initialState: IIniState<ITicketsColaboradoresBloque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsCategoriaSlice = createSlice({
  name: "TicketsColaboradoresBloque",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsColaboradoresBloqueSliceRequest.builderAll(builder);
  }
});
