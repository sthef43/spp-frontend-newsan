import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsEstados } from "app/features/tickets/models/ITicketsEstado";
import { TicketsEstadoService } from "../services/TicketsEstado.service";

const tikcetsEstadoService = new TicketsEstadoService();

class ticketsEstadoClassSlice extends GenericSlice<ITicketsEstados> {
  constructor(private service: TicketsEstadoService) {
    super("TicketsEstado", service);
  }
}

export const TicketEstadosSliceRequets = new ticketsEstadoClassSlice(tikcetsEstadoService);

const initialState: IIniState<ITicketsEstados> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsEstadoSlice = createSlice({
  name: "TicketsEstado",
  initialState: initialState,
  reducers: {
    setArrayTicketsEstados: (state, actions: PayloadAction<ITicketsEstados[]>) => {
      state.dataAll = actions.payload;
    }
  },
  extraReducers: (builder) => {
    TicketEstadosSliceRequets.builderAll(builder);
  }
});
