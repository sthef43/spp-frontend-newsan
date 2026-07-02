import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITicketsMailGroup } from "app/features/tickets/models/ITicketsMailGroup";
import { TicketsMailGroupService } from "../services/TicketsMailGroup.service";

const tikcetsMailGroupService = new TicketsMailGroupService();

class ticketsMailGroupClassSlice extends GenericSlice<ITicketsMailGroup> {
  constructor(private service: TicketsMailGroupService) {
    super("TicketsMailGroup", service);
  }

  GetAllMailByGrupoId = createAsyncThunk<ITicketsMailGroup[], number>(
    `TicketsMailGroup/GetAllMailByGrupoId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllMailByGrupoId(id), info);
    }
  );

  AddNewEmail = createAsyncThunk<ITicketsMailGroup, ITicketsMailGroup>(
    `TicketsMailGroup/AddNewEmail`,
    async (id, info) => {
      return await errorNotification(() => this.service.AddNewEmail(id), info);
    }
  );

  DeleteEmailById = createAsyncThunk<ITicketsMailGroup, number>(
    `TicketsMailGroup/DeleteEmailById`,
    async (id, info) => {
      return await errorNotification(() => this.service.DeleteEmailById(id), info);
    }
  );
}

export const TicketMailGroupSliceRequets = new ticketsMailGroupClassSlice(tikcetsMailGroupService);

const initialState: IIniState<ITicketsMailGroup> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const ticketsMailGroupSlice = createSlice({
  name: "TicketsMailGroup",
  initialState: initialState,
  reducers: {
    setArrayTicketsEstados: (state, actions: PayloadAction<ITicketsMailGroup[]>) => {
      state.dataAll = actions.payload;
    }
  },
  extraReducers: (builder) => {
    TicketMailGroupSliceRequets.builderAll(builder);
  }
});
