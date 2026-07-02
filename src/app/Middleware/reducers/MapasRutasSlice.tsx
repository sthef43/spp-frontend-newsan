import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { MapasRutasService } from "app/services/mapasRutas.service";
import { IMapasRutas } from "app/models/IMapasRutas";
import { errorNotification } from "../HelperMidleware/errorNotifications";
const mapasRutasService = new MapasRutasService();
class mapasRutasClassSlice extends GenericSlice<IMapasRutas> {
  constructor(private service: MapasRutasService) {
    super("MapasRutas", service);
  }
  //nuevos asyncthunks aqui
  getByRutaIdAndEsUltimo = createAsyncThunk<IMapasRutas, number>(
    `MapasRutas/getByRutaIdAndEsUltimo`,

    async (rutaId, info) => {
      return await errorNotification(() => this.service.getByRutaIdAndEsUltimo(rutaId), info);
    }
  );

  GetByRutaIdAndPrimero = createAsyncThunk<IMapasRutas, number>(
    `MapasRutas/getByRutaIdAndEsUltimo`,
    async (rutaId, info) => {
      return await errorNotification(() => this.service.GetByRutaIdAndPrimero(rutaId), info);
    }
  );
}
export const MapasRutasSliceRequest = new mapasRutasClassSlice(mapasRutasService);

const initialState: IIniState<IMapasRutas> = {
  loading: null,
  data: null
};

export const mapasRutasSlice = createSlice({
  name: "mapasRutas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    MapasRutasSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
