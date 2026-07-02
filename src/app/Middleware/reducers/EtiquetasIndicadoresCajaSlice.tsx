import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { EtiquetasIndicadoresCajaService } from "app/services/etiquetasIndicadoresCaja.service";
import { IEtiquetasIndicadoresCaja } from "app/models/IEtiquetasIndicadoresCaja";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const etiquetasIndicadoresCajaService = new EtiquetasIndicadoresCajaService();
class etiquetasIndicadoresCajaClassSlice extends GenericSlice<IEtiquetasIndicadoresCaja> {
  constructor(private service: EtiquetasIndicadoresCajaService) {
    super("EtiquetasIndicadoresCaja", service);
  }
  //nuevos asyncthunks aqui
  getAllByTipoM = createAsyncThunk<IEtiquetasIndicadoresCaja[], string>(
    `EtiquetasIndicadoresCaja/GetAllByTipoM`,
    async (tipoM, info) => {
      return await errorNotification(() => this.service.getAllByTipoM(tipoM), info);
    }
  );
}
export const EtiquetasIndicadoresCajaSliceRequests = new etiquetasIndicadoresCajaClassSlice(
  etiquetasIndicadoresCajaService
);

const initialState: IIniState<IEtiquetasIndicadoresCaja> = {
  loading: null,
  data: null
};

export const etiquetasIndicadoresCajaSlice = createSlice({
  name: "EtiquetasIndicadoresCaja",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EtiquetasIndicadoresCajaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(EtiquetasIndicadoresCajaSliceRequests.getAllByTipoM.fulfilled, (state, action) => {
      state.loading = "fullfiled";
      state.data = action.payload;
    });
    builder.addCase(EtiquetasIndicadoresCajaSliceRequests.getAllByTipoM.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
