import { TicketsGrupoProcesosBloqueService } from "../services/TicketsGrupoProcesosBloque.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { ITicketsGrupoProcesosBloque } from "app/features/tickets/models/ITicketsGrupoProcesosBloque";
import { IIniState } from "app/models";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const ticketGrupoProcesosBloqueService = new TicketsGrupoProcesosBloqueService();

class ticketsGrupoProcesosBloqueClassSlice extends GenericSlice<ITicketsGrupoProcesosBloque> {
  constructor(private service: TicketsGrupoProcesosBloqueService) {
    super("TicketsGrupoProcesosBloque", service);
  }

  DeleteBloqByItemAndGrupoId = createAsyncThunk<ITicketsGrupoProcesosBloque, { itemId; grupoId }>(
    `TicketsGrupoProcesosBloque/DeleteBloqByItemAndGrupoId`,
    async ({ itemId, grupoId }, info) => {
      return await errorNotification(() => this.service.DeleteBloqByItemAndGrupoId(itemId, grupoId), info);
    }
  );

  GetBloqueByGrupoIdAndItemId = createAsyncThunk<ITicketsGrupoProcesosBloque, { itemId; grupoId }>(
    `TicketsGrupoProcesosBloque/GetBloqueByGrupoIdAndItemId`,
    async ({ itemId, grupoId }, info) => {
      return await errorNotification(() => this.service.GetBloqueByGrupoIdAndItemId(itemId, grupoId), info);
    }
  );

  PutTicketsGrupoProcesosBloque = createAsyncThunk<ITicketsGrupoProcesosBloque, ITicketsGrupoProcesosBloque>(
    `TicketsGrupoProcesosBloque/PutTicketsGrupoProcesosBloque`,
    async (bloque, info) => {
      return await errorNotification(() => this.service.PutTicketsGrupoProcesosBloque(bloque), info);
    }
  );

  GetAllWithGrupoId = createAsyncThunk<ITicketsGrupoProcesosBloque[], number>(
    `TicketsGrupoProcesosBloque/GetAllWithGrupoId`,
    async (groupId, info) => {
      return await errorNotification(() => this.service.GetAllWithGrupoId(groupId), info);
    }
  );
}

export const TicketGrupoProcesosBloqueSliceRequest = new ticketsGrupoProcesosBloqueClassSlice(
  ticketGrupoProcesosBloqueService
);

const initialState: IIniState<ITicketsGrupoProcesosBloque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketGrupoProcesosSlice = createSlice({
  name: "TicketsGrupoProcesosBloque",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TicketGrupoProcesosBloqueSliceRequest.builderAll(builder);
  }
});
