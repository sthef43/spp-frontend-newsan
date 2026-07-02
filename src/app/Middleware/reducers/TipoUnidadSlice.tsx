import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { TipoUnidadService } from "app/services/tipoUnidad.service";
import { ITipoUnidad } from "app/models/ITipoUnidad";
const tipoUnidadService = new TipoUnidadService();

class TipoUnidadClassSlice {
  constructor(private service: TipoUnidadService) { }
  getAllRequest = createAsyncThunk<ITipoUnidad[]>(`TipoUnidad/GetAll`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });
  putRequest = createAsyncThunk<boolean, ITipoUnidad>(`TipoUnidad/PutRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.putRequest(modelo), info);
  });
  postRequest = createAsyncThunk<ITipoUnidad, ITipoUnidad>(`TipoUnidad/PostRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.postRequest(modelo), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`TipoUnidad/Delete`, async (modelo, info) => {
    return await errorNotification(() => this.service.deleteRequest(modelo), info);
  });
}
export const TipoUnidadSliceRequests = new TipoUnidadClassSlice(tipoUnidadService);

const initialState: IIniState<ITipoUnidad> = {
  loading: null,
  data: null,
  dataAll: []
};

export const tipoUnidadSlice = createSlice({
  name: "TipoUnidad",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(TipoUnidadSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(TipoUnidadSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
})