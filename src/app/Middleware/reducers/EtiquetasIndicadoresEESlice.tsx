import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { IEtiquetasIndicadoresEE } from "app/models/IEtiquetasIndicadoresEE";
import { EtiquetasIndicadoresEEService } from "app/services/etiquetasIndicadoresEE.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const etiquetasIndicadoresEEService = new EtiquetasIndicadoresEEService();
class etiquetasIndicadoresEEClassSlice extends GenericSlice<IEtiquetasIndicadoresEE> {
  constructor(private service: EtiquetasIndicadoresEEService) {
    super("EtiquetasIndicadoresEE", service);
  }
  //nuevos asyncthunks aqui
  getAllByTipoM = createAsyncThunk<IEtiquetasIndicadoresEE[], string>(
    `EtiquetasIndicadoresEE/GetAllByTipoM`,
    async (tipoM, info) => {
      return await errorNotification(() => this.service.getAllByTipoM(tipoM), info);
    }
  );
}
export const EtiquetasIndicadoresEESliceRequests = new etiquetasIndicadoresEEClassSlice(etiquetasIndicadoresEEService);

const initialState: IIniState<IEtiquetasIndicadoresEE> = {
  loading: null,
  data: null
};

export const etiquetasIndicadoresEESlice = createSlice({
  name: "EtiquetasIndicadoresEE",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EtiquetasIndicadoresEESliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(EtiquetasIndicadoresEESliceRequests.getAllByTipoM.fulfilled, (state, action) => {
      state.loading = "fullfiled";
      state.data = action.payload;
    });
    builder.addCase(EtiquetasIndicadoresEESliceRequests.getAllByTipoM.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
