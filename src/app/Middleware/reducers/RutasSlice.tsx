import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { RutasService } from "app/services/rutas.service";
import { IRutas } from "app/models/IRutas";
import { errorNotification } from "../HelperMidleware/errorNotifications";
const rutasService = new RutasService();
class rutasClassSlice extends GenericSlice<IRutas> {
  constructor(private service: RutasService) {
    super("Rutas", service);
  }
  //nuevos asyncthunks aqui
  GetByLineaIdRequest = createAsyncThunk<IRutas[], number>(`Rutas/GetByLineaId`, async (id, info) => {
    return await errorNotification(() => this.service.GetByLineaIdRequest(id), info);
  });
}
export const RutasSliceRequest = new rutasClassSlice(rutasService);

const initialState: IIniState<IRutas> = {
  loading: null,
  data: null
};

export const rutasSlice = createSlice({
  name: "Rutas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    RutasSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(RutasSliceRequest.GetByLineaIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(RutasSliceRequest.GetByLineaIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
