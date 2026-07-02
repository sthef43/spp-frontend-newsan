import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ItemsProcesosResultadosDTO } from "app/features/tickets/models/DTOS/ItemsProcesosResultadosDTO";
import { ITickets } from "app/features/tickets/models/ITickets";
import { TicketsService } from "../services/Tickets.service";

const ticketsService = new TicketsService();

class ticketsClassSlice extends GenericSlice<ITickets> {
  constructor(private service: TicketsService) {
    super("Tickets", service);
  }

  GetAllTicketsByOperatorId = createAsyncThunk<ITickets[], number>(
    `Tickets/GetAllTicketsByOperatorId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllTicketsByOperatorId(id), info);
    }
  );

  GetAllByDateCategoríaAndEstado = createAsyncThunk<ITickets[], { fecha; categoriaId; estadoId }>(
    `Tickets/GetAllTicketsByOperatorId`,
    async ({ fecha, categoriaId, estadoId }, info) => {
      return await errorNotification(
        () => this.service.GetAllByDateCategoríaAndEstado(fecha, categoriaId, estadoId),
        info
      );
    }
  );

  GetTicketsByRol = createAsyncThunk<ITickets[], number>(`Tickets/GetTicketsByRol`, async (id, info) => {
    return await errorNotification(() => this.service.GetTicketsByRol(id), info);
  });

  GetAllColaboradoresByTicketId = createAsyncThunk<ITickets[], number>(
    `Tickets/GetAllColaboradoresByTicketId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllColaboradoresByTicketId(id), info);
    }
  );

  GetTicketsByRolAndColaborador = createAsyncThunk<ITickets[], { rolId; colaboradorId; plantId }>(
    `Tickets/GetTicketsByRolAndColaborador`,
    async ({ rolId, colaboradorId, plantId }, info) => {
      return await errorNotification(
        () => this.service.GetTicketsByRolAndColaborador(rolId, colaboradorId, plantId),
        info
      );
    }
  );

  GetAllTicketsCerrados = createAsyncThunk<ITickets[], number>(`Tickets/GetAllTicketsCerrados`, async (id, info) => {
    return await errorNotification(() => this.service.GetAllTicketsCerrados(id), info);
  });

  GetAllTicketsCloseByDateCategorieAndClient = createAsyncThunk<ITickets[], { fecha; categoriaId; cliente }>(
    `Tickets/GetAllTicketsCloseByDateCategorieAndClient`,
    async ({ fecha, categoriaId, cliente }, info) => {
      return await errorNotification(
        () => this.service.GetAllTicketsCloseByDateCategorieAndClient(fecha, categoriaId, cliente),
        info
      );
    }
  );

  GetAllItemsByTicketId = createAsyncThunk<ItemsProcesosResultadosDTO[], number>(
    `Tickets/GetAllItemsByTicketId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllItemsByTicketId(id), info);
    }
  );

  CreateNewTicketAsync = createAsyncThunk<ITickets, { ticket; imagenFile }>(
    `Tickets/CreateNewTicketAsync`,
    async ({ ticket, imagenFile }, info) => {
      return await errorNotification(() => this.service.CreateNewTicketAsync(ticket, imagenFile), info);
    }
  );

  GetTicketsByDateCategoriaClientAndEstado = createAsyncThunk<ITickets[], { fecha; categoriaId; cliente; estadoId }>(
    `Tickets/GetTicketsByDateCategoriaClientAndEstado`,
    async ({ fecha, categoriaId, cliente, estadoId }, info) => {
      return await errorNotification(
        () => this.service.GetTicketsByDateCategoriaClientAndEstado(fecha, categoriaId, cliente, estadoId),
        info
      );
    }
  );

  GetAllTicketsByDateCategorieAndClient = createAsyncThunk<ITickets[], { fecha; categoriaId; cliente }>(
    `Tickets/GetTicketsByDateCategoriaClientAndEstado`,
    async ({ fecha, categoriaId, cliente }, info) => {
      return await errorNotification(
        () => this.service.GetAllTicketsByDateCategorieAndClient(fecha, categoriaId, cliente),
        info
      );
    }
  );

  GetAllTicketsByPlantId = createAsyncThunk<ITickets[], number>(
    `Tickets/GetAllTicketsByPlantId`,
    async (plantId, info) => {
      return await errorNotification(() => this.service.GetAllTicketsByPlantId(plantId), info);
    }
  );

  GetAllTicketsClose = createAsyncThunk<ITickets[], { plantId; fechaDesde; fechaHasta }>(
    `Tickets/GetAllTicketsClose`,
    async ({ plantId, fechaDesde, fechaHasta }, info) => {
      return await errorNotification(() => this.service.GetAllTicketsClose(plantId, fechaDesde, fechaHasta), info);
    }
  );

  GetAllTicketsByDate = createAsyncThunk<ITickets[], { fechaDesde; fechaHasta; plantId }>(
    `Tickets/GetAllTicketsByDate`,
    async ({ fechaDesde, fechaHasta, plantId }, info) => {
      return await errorNotification(() => this.service.GetAllTicketsByDate(fechaDesde, fechaHasta, plantId), info);
    }
  );

  GetAllRecordsOfTicketsByOperatorId = createAsyncThunk<ITickets[], { operatorId; fecha }>(
    `Tickets/GetAllRecordsOfTicketsByOperatorId`,
    async ({ operatorId, fecha }, info) => {
      return await errorNotification(() => this.service.GetAllRecordsOfTicketsByOperatorId(operatorId, fecha), info);
    }
  );

  SearchTicketBySdOption = createAsyncThunk<ITickets[], string>(
    `Ticket/SearchTicketBySdOption`,
    async (sdTicket, info) => {
      return await errorNotification(() => this.service.SearchTicketBySdOption(sdTicket), info);
    }
  );

  GetAllTicketsByDatesAndOperatorId = createAsyncThunk<ITickets[], { operatorId; fechaDesde }>(
    `Tickets/GetAllTicketsByDatesAndOperatorId`,
    async ({ operatorId, fechaDesde }, info) => {
      return await errorNotification(
        () => this.service.GetAllTicketsByDatesAndOperatorId(operatorId, fechaDesde),
        info
      );
    }
  );

  GetTicketById = createAsyncThunk<ITickets, number>(`Tickets/GetTicketById`, async (id, info) => {
    return await errorNotification(() => this.service.GetTicketById(id), info);
  });

  GetAllTicketsByPlantOperatorInclusiveClosedTickets = createAsyncThunk<ITickets[], number>(
    `Tickets/GetAllTicketsByOperatorInclusiveClosedTickets`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllTicketsByPlantOperatorInclusiveClosedTickets(id), info);
    }
  );

  GetAllTicketsByOperatorIdInclusiveClosed = createAsyncThunk<ITickets[], number>(
    `Tickets/GetAllTicketsByOperatorIdInclusiveClosed`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllTicketsByOperatorIdInclusiveClosed(id), info);
    }
  );
}

export const TicketsSliceRequest = new ticketsClassSlice(ticketsService);

const initialState: IIniState<ITickets> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsSlice = createSlice({
  name: "Tickets",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TicketsSliceRequest.builderAll(builder);
  }
});
