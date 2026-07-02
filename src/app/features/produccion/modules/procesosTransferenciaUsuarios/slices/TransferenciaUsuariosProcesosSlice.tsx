import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITransferenciaUsuariosProcesos } from "../models/ITransferenciaUsuariosProcesos";
import { TransferenciaUsuariosProcesosService } from "../services/transferenciaUsuariosProcesos.service";

const transferenciaUsuariosProcesosService = new TransferenciaUsuariosProcesosService();

class TransferenciaUsuariosProcesosClassSlice extends GenericSlice<ITransferenciaUsuariosProcesos> {
  constructor(private service: TransferenciaUsuariosProcesosService) {
    super("TransferenciaUsuariosProcesos", service);
  }

  GetAllProcessBySectorId = createAsyncThunk<ITransferenciaUsuariosProcesos[], number>(
    `TransferenciaUsuariosProcesos/GetAllProcessBySectorId`,
    async (sectorId, info) => {
      return await errorNotification(() => this.service.GetAllProcessBySectorId(sectorId), info);
    }
  );
}

export const TransferenciaUsuariosProcesosSliceRequest = new TransferenciaUsuariosProcesosClassSlice(
  transferenciaUsuariosProcesosService
);

const inititalState: IIniState<ITransferenciaUsuariosProcesos> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const TransferenciaUsuariosProcesosSlice = createSlice({
  name: "TransferenciaUsuariosProcesos",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    TransferenciaUsuariosProcesosSliceRequest.builderAll(builder);
    builder.addCase(TransferenciaUsuariosProcesosSliceRequest.GetAllProcessBySectorId.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(TransferenciaUsuariosProcesosSliceRequest.GetAllProcessBySectorId.rejected, (state, _) => {
      state.loading = "fulfilled";
    });
  }
});
