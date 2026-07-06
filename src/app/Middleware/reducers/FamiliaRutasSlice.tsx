import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { FamiliaRutasService } from "app/services/familiaRutas.service";
import { IFamiliaRutas } from "app/models/IFamiliaRutas";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const familiaRutasService = new FamiliaRutasService();
class familiaRutasSlice extends GenericSlice<IFamiliaRutas> {
  constructor(private service: FamiliaRutasService) {
    super("FamiliaRutas", service);
  }
  //nuevos asyncthunks aqui
  getAllRutaByFamiliaId = createAsyncThunk<IFamiliaRutas[], number>(
    `FamiliaRutas/GetAllRutaByFamiliaId`,
    async (id, info) => {
      return await errorNotification(() => this.service.getAllRutaByFamiliaId(id), info);
    }
  );
  getAllByFilters = createAsyncThunk<IFamiliaRutas[], { familiaId; lineaId }>(
    `FamiliaRutas/GetAllByFilters`,
    async (object, info) => {
      return await errorNotification(() => this.service.getAllByFilters(object), info);
    }
  );
}
export const FamiliaRutasSliceRequest = new familiaRutasSlice(familiaRutasService);

const initialState: IIniState<IFamiliaRutas> = {
  loading: null,
  data: null
};

export const exitSlice = createSlice({
  name: "FamiliaRutas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    FamiliaRutasSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(FamiliaRutasSliceRequest.getAllRutaByFamiliaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(FamiliaRutasSliceRequest.getAllRutaByFamiliaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
