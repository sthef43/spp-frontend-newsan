import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { InsttrazaService } from "app/services/insttraza.service";
import { IInsttraza } from "app/models/IInsttraza";
//<IAuth, IAuthUser>
const insttrazaService = new InsttrazaService();

class InsttrazaClassSlice {
  constructor(private service: InsttrazaService) {}
  //Nuevos endpoints que no heredan de generic
  getReporteRequest = createAsyncThunk<IInsttraza[], { identificadorLinea; turno; fechaDesde; fechaHasta }>(
    `Insttraza/GetReporteDiario`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getReporteRequest(modelo), info);
    }
  );
}
export const InsttrazaSliceRequests = new InsttrazaClassSlice(insttrazaService);

const initialState: IIniState<IInsttraza> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const InsttrazaSlice = createSlice({
  name: "Insttraza",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(InsttrazaSliceRequests.getReporteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(InsttrazaSliceRequests.getReporteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
