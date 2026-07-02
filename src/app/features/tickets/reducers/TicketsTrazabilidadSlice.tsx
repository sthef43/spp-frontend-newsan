import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsTrazabilidad } from "app/features/tickets/models/ITicketsTrazabilidad";
import { TicketsTrazabilidadService } from "../services/TicketsTrazabilidad.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { IAgrupacionTrazabilidadTicketsDTO } from "app/features/tickets/models/DTOS/IAgrupacionTrazabilidadTicketsDTO";

const ticketsTrazabilidadService = new TicketsTrazabilidadService();

class TicketsTrazabilidadClassSlice extends GenericSlice<ITicketsTrazabilidad> {
  constructor(private service: TicketsTrazabilidadService) {
    super("TicketsTrazabilidad", service);
  }

  GetAllByTicketId = createAsyncThunk<ITicketsTrazabilidad[], number>(
    `TicketsTrazabilidad/GetAllByTicketId`,
    async (ticketId: number, info) => {
      return await errorNotification(() => this.service.GetAllByTicketId(ticketId), info);
    }
  );

  GetAllTracesOfTicketsGroup = createAsyncThunk<IAgrupacionTrazabilidadTicketsDTO, number>(
    `TicketsTrazabilidad/GetAllTracesOfTicketsGroup`,
    async (ticketId: number, info) => {
      return await errorNotification(() => this.service.GetAllTracesOfTicketsGroup(ticketId), info);
    }
  );
}

export const TicketsTrazabilidadSliceRequest = new TicketsTrazabilidadClassSlice(ticketsTrazabilidadService);

const inititalState: IIniState<ITicketsTrazabilidad> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const Slice = createSlice({
  name: "TicketsTrazabilidad",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsTrazabilidadSliceRequest.builderAll(builder);
  }
});
