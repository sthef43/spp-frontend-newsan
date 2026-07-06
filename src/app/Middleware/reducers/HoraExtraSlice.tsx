import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { HoraExtraService } from "app/services/horaExtra.service";
import { IHoraExtra } from "app/models/IHoraExtra";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const horaExtraService = new HoraExtraService();
class horaExtraClassSlice extends GenericSlice<IHoraExtra> {
  constructor(private service: HoraExtraService) {
    super("HoraExtra", service);
  }
  //nuevos asyncthunks aqui
  getAllByDateAndProductoIdRequest = createAsyncThunk<
    IHoraExtra[],
    { productoId: number; desdeFecha: string; hastaFecha: string }
  >(`HoraExtra/GetByDateAndProductId`, async ({ productoId, desdeFecha, hastaFecha }, info) => {
    return await errorNotification(() => this.service.getByDateAndProductId(productoId, desdeFecha, hastaFecha), info);
  });
}
export const HoraExtraSliceRequests = new horaExtraClassSlice(horaExtraService);

const initialState: IIniState<IHoraExtra> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const HoraExtraSlice = createSlice({
  name: "HoraExtra",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    HoraExtraSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(HoraExtraSliceRequests.getAllByDateAndProductoIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(HoraExtraSliceRequests.getAllByDateAndProductoIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
