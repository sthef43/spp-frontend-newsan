import { ILimitesTraza } from "app/models";
import { IIniState } from "app/models/IIniState";
import { LimitesTrazaService } from "app/services/limitesTraza.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";
//<IAuth, IAuthUser>
const limitesTrazaService = new LimitesTrazaService();

class LimitesTrazaClassSlice extends GenericSlice<ILimitesTraza> {
  constructor(private service: LimitesTrazaService) {
    super("LimitesTraza", service);
  }
  //Nuevos endpoints que no heredan de generic
  getReporteRequest = createAsyncThunk<ILimitesTraza[], { identificadorLinea; turno; fechaDesde; fechaHasta }>(
    `LimitesTraza/GetReporteDiario`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getReporteRequest(modelo), info);
    }
  );
  getByLimitesIdAndFecha = createAsyncThunk<ILimitesTraza[], { limitesId; fecha }>(
    `LimitesTraza/getByLimitesIdAndFecha`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByLimitesIdAndFecha(modelo), info);
    }
  );
}
export const LimitesTrazaSliceRequests = new LimitesTrazaClassSlice(limitesTrazaService);

const initialState: IIniState<ILimitesTraza> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const LimitesTrazaSlice = createSlice({
  name: "LimitesTraza",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(LimitesTrazaSliceRequests.getReporteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(LimitesTrazaSliceRequests.getReporteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
