import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaItemsResult } from "../models/IAuditoriaItemsResult";
import { AuditoriaItemsResultService } from "../services/AuditoriaItemsResult.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const auditoriaItemsResultService = new AuditoriaItemsResultService();

class AuditoriaItemsResultClassSlice extends GenericSlice<IAuditoriaItemsResult> {
  constructor(private service: AuditoriaItemsResultService) {
    super("AuditoriaItemsResult", service);
  }

  MultiPutItemsResult = createAsyncThunk<IAuditoriaItemsResult[], IAuditoriaItemsResult[]>(
    `AuditoriaItemsResult/MultiPutItemsResult`,
    async (items, info) => {
      return await errorNotification(() => this.service.MultiPutItemsResult(items), info);
    }
  );

  DeleteItemsGlobal = createAsyncThunk<boolean, { AuditoriasIdPadre: number; nombreItem: string }>(
    `AuditoriaItemsResult/DeleteItemsGlobal`,
    async (model, info) => {
      return await errorNotification(() => this.service.DeleteItemsGlobal(model), info);
    }
  );
}

export const AuditoriaItemsResultSliceRequest = new AuditoriaItemsResultClassSlice(auditoriaItemsResultService);

const inititalState: IIniState<IAuditoriaItemsResult> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditoriaItemsResultSlice = createSlice({
  name: "AuditoriaItemsResult",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaItemsResultSliceRequest.builderAll(builder);
  }
});
