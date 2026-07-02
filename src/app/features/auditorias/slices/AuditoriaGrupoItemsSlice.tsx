/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaGrupoItems } from "../models/IAuditoriaGrupoItems";
import { AuditoriaGrupoItemsService } from "../services/AuditoriaGrupoItems.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const service = new AuditoriaGrupoItemsService();

class AuditoriaGrupoItemsClassSlice extends GenericSlice<IAuditoriaGrupoItems> {
  constructor(private service: AuditoriaGrupoItemsService) {
    super("AuditoriaGrupoItems", service);
  }

  GetAllGroupsByItems = createAsyncThunk<IAuditoriaGrupoItems[], void>(
    `AuditoriaGrupoItems/GetAllGroupsByItems`,
    async (_, info) => {
      return await errorNotification(() => this.service.GetAllGroupsByItems(), info);
    }
  );
}

export const AuditoriaGrupoItemsSliceRequest = new AuditoriaGrupoItemsClassSlice(service);

const initialState: IIniState<IAuditoriaGrupoItems> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaGrupoItemsSlice = createSlice({
  name: "AuditoriaGrupoItems",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaGrupoItemsSliceRequest.builderAll(builder);
    builder.addCase(AuditoriaGrupoItemsSliceRequest.GetAllGroupsByItems.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(AuditoriaGrupoItemsSliceRequest.GetAllGroupsByItems.rejected, (state, _action) => {
      state.loading = "rejected";
    });
  }
});
