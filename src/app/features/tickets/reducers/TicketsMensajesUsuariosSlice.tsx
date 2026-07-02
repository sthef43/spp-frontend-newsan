import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsMensajesUsuario } from "app/features/tickets/models/ITicketsMensajesUsuario";
import { TicketsMensajesUsuariosServices } from "../services/TicketsMensajesUsuarios.service";

const ticketsMensajesUsuariosService = new TicketsMensajesUsuariosServices();

class ticketsMensajesUsuariosClassSlice extends GenericSlice<ITicketsMensajesUsuario> {
  constructor(private service: TicketsMensajesUsuariosServices) {
    super("TicketsMensajesUsuarios", service);
  }

  GetAllMensajesByTicketId = createAsyncThunk<ITicketsMensajesUsuario[], number>(
    `TicketsMensajesUsuarios/GetAllMensajesByTicketId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllMensajesByTicketId(id), info);
    }
  );

  CreateNewMessageWithImage = createAsyncThunk<ITicketsMensajesUsuario, { ticket; imagenFile }>(
    `TicketsMensajesUsuarios/CreateNewMessageWithImage`,
    async ({ ticket, imagenFile }, info) => {
      return await errorNotification(() => this.service.CreateNewMessageWithImage(ticket, imagenFile), info);
    }
  );

  CreateNewMessage = createAsyncThunk<ITicketsMensajesUsuario, ITicketsMensajesUsuario>(
    `TicketsMensajesUsuarios/CreateNewMessage`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.CreateNewMessage(modelo), info);
    }
  );

  GetImageMessageTicket = createAsyncThunk<string, { ticketId; nombreArchivo }>(
    `TicketsMensajesUsuarios/GetImageMessageTicket`,
    async ({ ticketId, nombreArchivo }, info) => {
      return await errorNotification(() => this.service.GetImageMessageTicket(ticketId, nombreArchivo), info);
    }
  );

  DownloadArchiveMessageTicket = createAsyncThunk<boolean, { ticketId; nombreArchivo }>(
    `TicketsMensajesUsuarios/DownloadArchiveMessageTicket`,
    async ({ ticketId, nombreArchivo }, info) => {
      return await errorNotification(() => this.service.DownloadArchiveMessageTicket(ticketId, nombreArchivo), info);
    }
  );
}

export const TicketsMensajesUsuariosSliceRequets = new ticketsMensajesUsuariosClassSlice(
  ticketsMensajesUsuariosService
);

const initialState: IIniState<ITicketsMensajesUsuario> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsMensajesUsuarios = createSlice({
  name: "TicketsMensajesUsuarios",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsMensajesUsuariosSliceRequets.builderAll(builder);
  }
});
