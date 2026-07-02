import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaValores } from "../models/IAuditoriaValores";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { AuditoriaValoresService } from "../services/AuditoriaValores.service";

const service = new AuditoriaValoresService();

class AuditoriaValoresClassSlice extends GenericSlice<IAuditoriaValores> {
  constructor(private service: AuditoriaValoresService) {
    super("AuditoriaValores", service);
  }

  MultiPostReturnList = createAsyncThunk<IAuditoriaValores[], IAuditoriaValores[]>(
    `AuditoriaValores/MultiPostReturnList`,
    async (data: IAuditoriaValores[], info) => {
      return await errorNotification(() => this.service.MultiPostReturnList(data), info);
    }
  );
}

export const AuditoriaValoresSliceRequest = new AuditoriaValoresClassSlice(service);

const initialState: IIniState<IAuditoriaValores> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaValoresSlice = createSlice({
  name: "AuditoriaValores",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaValoresSliceRequest.builderAll(builder);
  }
});
