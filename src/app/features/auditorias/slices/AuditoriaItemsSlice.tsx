import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaItems } from "../models/IAuditoriaItems";
import { AuditoriaItemsService } from "../services/AuditoriaItems.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const service = new AuditoriaItemsService();

class AuditoriaItemsClassSlice extends GenericSlice<IAuditoriaItems> {
  constructor(private service: AuditoriaItemsService) {
    super("AuditoriaItems", service);
  }

  MultiPostReturnList = createAsyncThunk<IAuditoriaItems[], IAuditoriaItems[]>(
    `AuditoriaItems/MultiPostReturnList`,
    async (data: IAuditoriaItems[], info) => {
      return await errorNotification(() => this.service.MultiPostReturnList(data), info);
    }
  );
}

export const AuditoriaItemsSliceRequest = new AuditoriaItemsClassSlice(service);

const initialState: IIniState<IAuditoriaItems> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaItemsSlice = createSlice({
  name: "AuditoriaItems",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaItemsSliceRequest.builderAll(builder);
  }
});
