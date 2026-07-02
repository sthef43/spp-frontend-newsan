import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITransferenciaUsuariosPermitidos } from "../models/ITransferenciaUsuariosPermitidos";
import { TransferenciaUsuariosPermitidosService } from "../services/transferenciaUsuariosPermitidos.service";

const transferenciaUsuariosPermitidosService = new TransferenciaUsuariosPermitidosService();

class TransferenciaUsuariosPermitidosClassSlice extends GenericSlice<ITransferenciaUsuariosPermitidos> {
  constructor(private service: TransferenciaUsuariosPermitidosService) {
    super("TransferenciaUsuariosPermitidos", service);
  }

  GetAllUsersBySectorId = createAsyncThunk<ITransferenciaUsuariosPermitidos[], number>(
    `TransferenciaUsuariosPermitidos/GetAllUsersBySectorId`,
    async (sectorId, info) => {
      return await errorNotification(() => this.service.GetAllUsersBySectorId(sectorId), info);
    }
  );

  GetUserByDni = createAsyncThunk<ITransferenciaUsuariosPermitidos, string>(
    `TransferenciaUsuariosPermitidos/GetUserByDni`,
    async (dni, info) => {
      return await errorNotification(() => this.service.GetUserByDni(dni), info);
    }
  );
}

export const TransferenciaUsuariosPermitidosSliceRequest = new TransferenciaUsuariosPermitidosClassSlice(
  transferenciaUsuariosPermitidosService
);

const inititalState: IIniState<ITransferenciaUsuariosPermitidos> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const TransferenciaUsuariosPermitidosSlice = createSlice({
  name: "TransferenciaUsuariosPermitidos",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    TransferenciaUsuariosPermitidosSliceRequest.builderAll(builder);
    builder.addCase(TransferenciaUsuariosPermitidosSliceRequest.GetAllUsersBySectorId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(TransferenciaUsuariosPermitidosSliceRequest.GetAllUsersBySectorId.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
