import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { HoraExtraTurnoExtrasService } from "app/services/horaExtraTurnoExtras.service";
import { IHoraExtraTurnoExtras } from "app/models/IHoraExtraTurnoExtras";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const horaExtraTurnoExtrasService = new HoraExtraTurnoExtrasService();
class horaExtraTurnoExtrasClassSlice extends GenericSlice<IHoraExtraTurnoExtras> {
  constructor(private service: HoraExtraTurnoExtrasService) {
    super("HoraExtraTurnoExtras", service);
  }
  //nuevos asyncthunks aqui
  getAllByDateAndProductoIdRequest = createAsyncThunk<
    IHoraExtraTurnoExtras[],
    { productoId: number; desdeFecha: string; hastaFecha: string }
  >(`HoraExtraTurnoExtras/GetByDateAndProductId`, async ({ productoId, desdeFecha, hastaFecha }, info) => {
    return await errorNotification(() => this.service.getByDateAndProductId(productoId, desdeFecha, hastaFecha), info);
  });
}
export const HoraExtraTurnoExtrasSliceRequests = new horaExtraTurnoExtrasClassSlice(horaExtraTurnoExtrasService);

const initialState: IIniState<IHoraExtraTurnoExtras> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const HoraExtraTurnoExtrasSlice = createSlice({
  name: "HoraExtraTurnoExtras",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    HoraExtraTurnoExtrasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(HoraExtraTurnoExtrasSliceRequests.getAllByDateAndProductoIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(HoraExtraTurnoExtrasSliceRequests.getAllByDateAndProductoIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
