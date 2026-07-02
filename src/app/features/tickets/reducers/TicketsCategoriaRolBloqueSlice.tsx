import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsCategoriasRolBloque } from "app/features/tickets/models/ITicketsCategoriasRolBloque";
import { TicketsCategoriaRolBloque } from "../services/TicketsCategoriaRolBloque.service";

const tikcetsCategoriaRolBloqueService = new TicketsCategoriaRolBloque();

class ticketsCategoriaRolBloqueClassSlice extends GenericSlice<ITicketsCategoriasRolBloque> {
  constructor(private service: TicketsCategoriaRolBloque) {
    super("TicketsCategoriaRolBloque", service);
  }

  DeleteBloqueByRolAndCategoriaId = createAsyncThunk<ITicketsCategoriasRolBloque, { categoriaId; rolId }>(
    `TicketsCategoriaRolBloque/DeleteBloqueByRolAndCategoriaId`,
    async ({ categoriaId, rolId }, info) => {
      return await errorNotification(() => this.service.DeleteBloqueByRolAndCategoriaId(categoriaId, rolId), info);
    }
  );
}

export const TicketCategoriaRolBloqueSliceRequets = new ticketsCategoriaRolBloqueClassSlice(
  tikcetsCategoriaRolBloqueService
);

const initialState: IIniState<ITicketsCategoriasRolBloque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsCategoriaRolBloqueSlice = createSlice({
  name: "TicketsEstado",
  initialState: initialState,
  reducers: {
    setArrayTicketsEstados: (state, actions: PayloadAction<ITicketsCategoriasRolBloque[]>) => {
      state.dataAll = actions.payload;
    }
  },
  extraReducers: (builder) => {
    TicketCategoriaRolBloqueSliceRequets.builderAll(builder);
  }
});
