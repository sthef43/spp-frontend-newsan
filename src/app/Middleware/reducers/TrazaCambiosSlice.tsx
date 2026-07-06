import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ITrazaCambios } from "app/models/ITrazaCambios";
import { TrazaCambiosService } from "app/services/trazaCambios.service";

const trazaCambiosService = new TrazaCambiosService();
class trazaCambiosClassSlice extends GenericSlice<ITrazaCambios> {
  constructor(private service: TrazaCambiosService) {
    super("Modelo", service);
  }
  //nuevos asyncthunks aqui
  getHistorialByCodigo = createAsyncThunk<ITrazaCambios[], string>(
    `TrazaCambios/getHistorialByCodigo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.GetHistorialByCodigo(codigo), info);
    }
  );
}

export const TrazaCambiosSliceRequest = new trazaCambiosClassSlice(trazaCambiosService);

const initialState: IIniState<ITrazaCambios> = {
  loading: null,
  data: null,
  dataAll: []
};

export const trazaCambiosSlice = createSlice({
  name: "TrazaCambios",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TrazaCambiosSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(TrazaCambiosSliceRequest.getHistorialByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
      state.dataAll = action.payload;
    });
    builder.addCase(TrazaCambiosSliceRequest.getHistorialByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
