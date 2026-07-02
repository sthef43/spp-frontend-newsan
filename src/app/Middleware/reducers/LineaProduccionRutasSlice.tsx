import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ILineaProduccionRutas } from "app/models/ILineaProduccionRutas";
import { LineaProduccionRutasService } from "app/services/lineaProduccionRutas.service";

const lineaProduccionRutasService = new LineaProduccionRutasService();
class LineaProduccionRutasSlice extends GenericSlice<ILineaProduccionRutas> {
  constructor(private service: LineaProduccionRutasService) {
    super("LineaProduccionRutas", service);
  }
  //nuevos asyncthunks aqui
  getAllRutaByLineaId = createAsyncThunk<ILineaProduccionRutas[], number>(
    `LineaProduccionRutas/GetAllRutaByLineaId`,
    async (id, info) => {
      return await errorNotification(() => this.service.getAllRutaByLineaId(id), info);
    }
  );
  getRutaActivaByLineaId = createAsyncThunk<ILineaProduccionRutas, number>(
    `LineaProduccionRutas/GetRutaActiva`,
    async (id, info) => {
      return await errorNotification(() => this.service.getRutaActiva(id), info);
    }
  );
  getRutaActivaByLineaIdPuestoFin = createAsyncThunk<ILineaProduccionRutas, number>(
    `LineaProduccionRutas/GetRutaActivaByLineaId`,
    async (id, info) => {
      return await errorNotification(() => this.service.getRutaActivaByLineaId(id), info);
    }
  );
}
export const LineaProduccionRutasSliceRequest = new LineaProduccionRutasSlice(lineaProduccionRutasService);

const initialState: IIniState<ILineaProduccionRutas> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const exitSlice = createSlice({
  name: "LineaProduccionRutas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    LineaProduccionRutasSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(LineaProduccionRutasSliceRequest.getAllRutaByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(LineaProduccionRutasSliceRequest.getAllRutaByLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaProduccionRutasSliceRequest.getRutaActivaByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(LineaProduccionRutasSliceRequest.getRutaActivaByLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaProduccionRutasSliceRequest.getRutaActivaByLineaIdPuestoFin.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(LineaProduccionRutasSliceRequest.getRutaActivaByLineaIdPuestoFin.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
