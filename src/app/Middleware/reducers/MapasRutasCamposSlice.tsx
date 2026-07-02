import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { MapasRutasCamposService } from "app/services/mapasRutasCampos.service";
import { IMapasRutasCampos } from "app/models/IMapasRutasCampos";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const mapasRutasCamposService = new MapasRutasCamposService();

class mapasRutasCamposClassSlice extends GenericSlice<IMapasRutasCampos> {
  constructor(private service: MapasRutasCamposService) {
    super("MapasRutasCampos", service);
  }
  //nuevos asyncthunks aqui
  getListByMapaRutaId = createAsyncThunk<IMapasRutasCampos[], number>(
    `MapasRutasCampos/GetListByMapaRutaId`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getListByMapaRutaId(modelo), info);
    }
  );
}
export const MapasRutasCamposSliceRequest = new mapasRutasCamposClassSlice(mapasRutasCamposService);

const initialState: IIniState<IMapasRutasCampos> = {
  loading: null,
  data: null,
  dataAll: []
};

export const mapasRutasCamposSlice = createSlice({
  name: "mapasRutasCampos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    MapasRutasCamposSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(MapasRutasCamposSliceRequest.getListByMapaRutaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(MapasRutasCamposSliceRequest.getListByMapaRutaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
