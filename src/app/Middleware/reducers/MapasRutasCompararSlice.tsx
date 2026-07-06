import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { MapasRutasCompararService } from "app/services/mapasRutasComparar.service";
import { IMapasRutasComparar } from "app/models/IRutasCamposComparar";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const mapasRutasCompararService = new MapasRutasCompararService();

class mapasRutasCompararClassSlice extends GenericSlice<IMapasRutasComparar> {
  constructor(private service: MapasRutasCompararService) {
    super("MapasRutasComparar", service);
  }
  getAllByCampoId = createAsyncThunk<IMapasRutasComparar[], number>(
    `MapasRutasComparar/GetAllByCampoId`,
    async (campoId, info) => {
      return await errorNotification(() => this.service.getAllByCampoId(campoId), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const MapasRutasCompararSliceRequest = new mapasRutasCompararClassSlice(mapasRutasCompararService);

const initialState: IIniState<IMapasRutasComparar> = {
  loading: null,
  data: null,
  dataAll: []
};

export const mapasRutasCompararSlice = createSlice({
  name: "mapasRutasComparar",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    MapasRutasCompararSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(MapasRutasCompararSliceRequest.getAllByCampoId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(MapasRutasCompararSliceRequest.getAllByCampoId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
