import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { EtiquetasIndicadoresModeloService } from "app/services/etiquetasIndicadoresModelo.service";
import { IEtiquetasIndicadoresModelo } from "app/models/IEtiquetasIndicadoresModelo";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const etiquetasIndicadoresModeloService = new EtiquetasIndicadoresModeloService();
class etiquetasIndicadoresClassSlice extends GenericSlice<IEtiquetasIndicadoresModelo> {
  constructor(private service: EtiquetasIndicadoresModeloService) {
    super("EtiquetasIndicadoresModelo", service);
  }
  //nuevos asyncthunks aqui
  getAllByTipoM = createAsyncThunk<IEtiquetasIndicadoresModelo[], { tipoM; tipoU }>(
    `EtiquetasIndicadoresCaja/GetAllByTipoM`,
    async (tipoM, info) => {
      return await errorNotification(() => this.service.getAllByTipoM(tipoM), info);
    }
  );
}
export const EtiquetasIndicadoresModeloSliceRequests = new etiquetasIndicadoresClassSlice(
  etiquetasIndicadoresModeloService
);

const initialState: IIniState<IEtiquetasIndicadoresModelo> = {
  loading: null,
  data: null
};

export const etiquetasIndicadoresModeloSlice = createSlice({
  name: "EtiquetasIndicadoresModelo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EtiquetasIndicadoresModeloSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(EtiquetasIndicadoresModeloSliceRequests.getAllByTipoM.fulfilled, (state, action) => {
      state.loading = "fullfiled";
      state.data = action.payload;
    });
    builder.addCase(EtiquetasIndicadoresModeloSliceRequests.getAllByTipoM.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
