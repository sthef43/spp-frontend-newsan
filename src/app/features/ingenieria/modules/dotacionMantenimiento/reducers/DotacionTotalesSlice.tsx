import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IDotacionTotales } from "../models/IDotacionTotales";
import { DotacionTotalesService } from "../services/DotacionTotales.service";

const dotacionTotalesService = new DotacionTotalesService();

class DotacionTotalesClassSlice extends GenericSlice<IDotacionTotales> {
  constructor(private service: DotacionTotalesService) {
    super("DotacionTotales", service);
  }

  GetTotalsByDotacionId = createAsyncThunk<IDotacionTotales, number>(
    `DotacionTotales/GetTotalsByDotacionId`,
    async (dotacionId, info) => {
      return await errorNotification(() => this.service.GetTotalsByDotacionId(dotacionId), info);
    }
  );
}

export const DotacionTotalesSliceRequest = new DotacionTotalesClassSlice(dotacionTotalesService);

const inititalState: IIniState<IDotacionTotales> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const DotacionTotales = createSlice({
  name: "DotacionTotales",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    DotacionTotalesSliceRequest.builderAll(builder);
  }
});
