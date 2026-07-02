import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState, IRol } from "app/models";
import { ITicketsCategoria } from "app/features/tickets/models/ITicketsCategorias";
import { TicketsCategoriaService } from "../services/TicketsCategoria.service";

const ticketsCategoriaService = new TicketsCategoriaService();

class ticketsCategoriaClassSlice extends GenericSlice<ITicketsCategoria> {
  constructor(private service: TicketsCategoriaService) {
    super("TicketsCategoria", service);
  }

  GetAllRolsWithCategorieId = createAsyncThunk<ITicketsCategoria, number>(
    `Tickets/GetAllRolsWithCategorieId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllRolsWithCategorieId(id), info);
    }
  );

  GetAllRolWithoutCategoria = createAsyncThunk<IRol[], number>(
    `Tickets/GetAllRolWithoutCategoria`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllRolWithoutCategoria(id), info);
    }
  );

  DeleteCategoriaWithBlocks = createAsyncThunk<ITicketsCategoria, number>(
    `Tickets/DeleteCategoriaWithBlocks`,
    async (id, info) => {
      return await errorNotification(() => this.service.DeleteCategoriaWithBlocks(id), info);
    }
  );

  GetAllCategoriesByPlantId = createAsyncThunk<ITicketsCategoria[], number>(
    `TicketsCategoria/GetAllCategoriesByPlantId`,
    async (plantaId, info) => {
      return await errorNotification(() => this.service.GetAllCategoriesByPlantId(plantaId), info);
    }
  );
}

export const TicketsCategoriaSliceRequest = new ticketsCategoriaClassSlice(ticketsCategoriaService);

const initialState: IIniState<ITicketsCategoria> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsCategoriaSlice = createSlice({
  name: "TicketsCategoria",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsCategoriaSliceRequest.builderAll(builder);
  }
});
