import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsArchivos } from "app/features/tickets/models/ITicketsArchivos";
import { TicketsArchivosService } from "../services/TicketsArchivos.service";

const ticketsArchivosService = new TicketsArchivosService();

class ticketsArchivosClassSlice extends GenericSlice<ITicketsArchivos> {
  constructor(private service: TicketsArchivosService) {
    super("TicketsArchivos", service);
  }

  PublishNewTicketFiles = createAsyncThunk<boolean, { ticketId; imagenFile }>(
    `TicketsArchivos/PublishNewTicketFiles`,
    async ({ ticketId, imagenFile }, info) => {
      return await errorNotification(() => this.service.PublishNewTicketFiles(ticketId, imagenFile), info);
    }
  );

  DownloadArchiveTicket = createAsyncThunk<boolean, { ticketId; nombreArchivo }>(
    `TicketsArchivos/DownloadArchiveTicket`,
    async ({ ticketId, nombreArchivo }, info) => {
      return await errorNotification(() => this.service.DownloadArchiveTicket(ticketId, nombreArchivo), info);
    }
  );

  GetImageTicketPreview = createAsyncThunk<string, { ticketId; nombreArchivo }>(
    `TicketsArchivos/GetImageTicketPreview`,
    async ({ ticketId, nombreArchivo }, info) => {
      return await errorNotification(() => this.service.GetImageTicketPreview(ticketId, nombreArchivo), info);
    }
  );

  GetFilesByTicketId = createAsyncThunk<ITicketsArchivos[], number>(
    `TicketsArchivos/GetFilesByTicketId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetFilesByTicketId(id), info);
    }
  );
}

export const TicketsArchivosSliceRequest = new ticketsArchivosClassSlice(ticketsArchivosService);

const inititalState: IIniState<ITicketsArchivos> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsArchivosSlice = createSlice({
  name: "TicketsArchivos",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsArchivosSliceRequest.builderAll(builder);
  }
});
