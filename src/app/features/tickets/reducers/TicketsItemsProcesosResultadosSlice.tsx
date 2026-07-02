import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsItemsProcesosResultados } from "app/features/tickets/models/ITicketsItemsProcesosResultados";
import { TicketsItemsProcesosResultadoService } from "../services/TicketsItemsProcesosResultado.service";

const ticketsProcesosResultadosService = new TicketsItemsProcesosResultadoService();

class ticketsProcesosResultadosClassSlice extends GenericSlice<ITicketsItemsProcesosResultados> {
  constructor(private service: TicketsItemsProcesosResultadoService) {
    super("TicketsItemsProcesosResultados", service);
  }

  GetAllItemsByTicketId = createAsyncThunk<ITicketsItemsProcesosResultados[], number>(
    `TicketsItemsProcesosResultados/GetAllItemsByTicketId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllItemsByTicketId(id), info);
    }
  );

  GetItemResultadoById = createAsyncThunk<ITicketsItemsProcesosResultados, { itemId; ticketId }>(
    `TicketsItemsProcesosResultados/GetItemResultadoById`,
    async ({ itemId, ticketId }, info) => {
      return await errorNotification(() => this.service.GetItemResultadoById(itemId, ticketId), info);
    }
  );

  GetAllItemsAprobedByTicketsId = createAsyncThunk<number, number>(
    `TicketsItemsProcesosResultados/GetAllItemsAprobedByTicketsId`,
    async (ticketId, info) => {
      return await errorNotification(() => this.service.GetAllItemsAprobedByTicketsId(ticketId), info);
    }
  );

  GetAllItemsByTicketIdForApproval = createAsyncThunk<ITicketsItemsProcesosResultados[], number>(
    `TicketsItemsProcesosResultados/GetAllItemsByTicketIdForApproval`,
    async (ticketId, info) => {
      return await errorNotification(() => this.service.GetAllItemsByTicketIdForApproval(ticketId), info);
    }
  );

  GetAllItemsByContainIds = createAsyncThunk<ITicketsItemsProcesosResultados[], number[]>(
    `TicketsItemsProcesosResultados/GetAllItemsByContainIds`,
    async (ids, info) => {
      return await errorNotification(() => this.service.GetAllItemsByContainIds(ids), info);
    }
  );

  GetAllItemsByBloq = createAsyncThunk<ITicketsItemsProcesosResultados[], number>(
    `TicketsItemsProcesosResultados/GetAllItemsByBloq`,
    async (ticketId, info) => {
      return await errorNotification(() => this.service.GetAllItemsByBloq(ticketId), info);
    }
  );
}

export const TicketsItemsProcesosResultadosSliceRequest = new ticketsProcesosResultadosClassSlice(
  ticketsProcesosResultadosService
);

const initialState: IIniState<ITicketsItemsProcesosResultados> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsItemsProcesosResultadosSlice = createSlice({
  name: "TicketsItemsProcesosResultados",
  initialState: initialState,
  reducers: {
    setLastObjectItem: (state, action: PayloadAction<ITicketsItemsProcesosResultados>) => {
      state.object = action.payload;
    }
  },
  extraReducers: (builder) => {
    TicketsItemsProcesosResultadosSliceRequest.builderAll(builder);
  }
});
