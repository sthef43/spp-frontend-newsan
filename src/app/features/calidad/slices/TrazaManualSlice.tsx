import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ITrazaManual } from "app/models/ITrazaManual";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { TrazaManualService } from "../services/trazaManual.service";
//<IAuth, IAuthUser>
const trazaManualService = new TrazaManualService();

class TrazaManualClassSlice extends GenericSlice<ITrazaManual> {
  constructor(private service: TrazaManualService) {
    super("TrazaManual", service);
  }
  //Nuevos endpoints que no heredan de generic
  getAllByCodigo = createAsyncThunk<ITrazaManual[], { codigo; tipoDeCodigo }>(
    `TrazaManual/GetAllByCodigo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.getAllByCodigo(codigo), info);
    }
  );
  getAllByDateAndLineaId = createAsyncThunk<ITrazaManual[], { fechaDesde; fechaHasta; lineaId }>(
    `TrazaManual/GetAllByDateAndLineaId`,
    async ({ fechaDesde, fechaHasta, lineaId }, info) => {
      return await errorNotification(() => this.service.getAllByDateAndLineaId(fechaDesde, fechaHasta, lineaId), info);
    }
  );
  getByNroSerie = createAsyncThunk<ITrazaManual, string>(`TrazaManual/GetByNroSerie`, async (codigo, info) => {
    return await errorNotification(() => this.service.getByNroSerie(codigo), info);
  });
  getByTraza = createAsyncThunk<ITrazaManual, string>(`TrazaManual/GetByNroSerie`, async (codigo, info) => {
    return await errorNotification(() => this.service.getByTraza(codigo), info);
  });
  deleteOldRequest = createAsyncThunk<boolean, number>(`TrazaManual/DeleteOld`, async (id, info) => {
    return await errorNotification(() => this.service.deleteOldRequest(id), info);
  });
}
export const TrazaManualSliceRequests = new TrazaManualClassSlice(trazaManualService);

const initialState: IIniState<ITrazaManual> = {
  loading: null,
  dataAll: [],
  data: null
};

export const TrazaManualSlice = createSlice({
  name: "TrazaManual",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TrazaManualSliceRequests.builderAll(builder);
    builder.addCase(TrazaManualSliceRequests.getAllByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(TrazaManualSliceRequests.getAllByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TrazaManualSliceRequests.getAllByDateAndLineaId.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(TrazaManualSliceRequests.getAllByDateAndLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TrazaManualSliceRequests.getByNroSerie.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.object = action.payload;
    });
    builder.addCase(TrazaManualSliceRequests.getByNroSerie.rejected, (state, action) => {
      state.loading = "rejected";
    });
    //Nuevos slices que no heredan de generic
  }
});
