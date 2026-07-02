import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ITransferenciaUsuariosBloq } from "../models/ITransferenciaUsuariosBloq";
import { TransferenciaUsuariosBloqService } from "../services/TransferenciaUsuariosBloq.service";

const transferenciaUsuariosBloqService = new TransferenciaUsuariosBloqService();

class TransferenciaUsuariosBloqClassSlice extends GenericSlice<ITransferenciaUsuariosBloq> {
  constructor(private service: TransferenciaUsuariosBloqService) {
    super("TransferenciaUsuariosBloq", service);
  }

  GetBloqByUsuarioIdAndSectorId = createAsyncThunk<ITransferenciaUsuariosBloq, { usuarioId; sectorId }>(
    `TransferenciauUsuariosBloq/GetBloqByUsuarioIdAndSectorId`,
    async ({ usuarioId, sectorId }, info) => {
      return await errorNotification(() => this.service.GetBloqByUsuarioIdAndSectorId(usuarioId, sectorId), info);
    }
  );

  GetAllBloqsByUserId = createAsyncThunk<ITransferenciaUsuariosBloq[], number>(
    `TransferenciaUsuariosBloq/GetAllBloqsByUserId`,
    async (usuarioId, info) => {
      return await errorNotification(() => this.service.GetAllBloqsByUserId(usuarioId), info);
    }
  );
}

export const TransferenciaUsuariosBloqSliceRequest = new TransferenciaUsuariosBloqClassSlice(
  transferenciaUsuariosBloqService
);

const inititalState: IIniState<ITransferenciaUsuariosBloq> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const TransferenciaUsuariosBloqSlice = createSlice({
  name: "TransferenciaUsuariosBloq",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    TransferenciaUsuariosBloqSliceRequest.builderAll(builder);
    builder.addCase(TransferenciaUsuariosBloqSliceRequest.GetBloqByUsuarioIdAndSectorId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(TransferenciaUsuariosBloqSliceRequest.GetBloqByUsuarioIdAndSectorId.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
