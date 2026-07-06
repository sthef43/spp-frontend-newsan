import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IPautaIngenieria } from "app/models/IPautaIngenieria";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { PautaIngenieriaService } from "app/services/pautaIngenieria.service";

const pautaIngenieriaService = new PautaIngenieriaService();

class pautaIngenieriaClassSlice extends GenericSlice<IPautaIngenieria> {
  constructor(private service: PautaIngenieriaService) {
    super("PautaIngenieria", service);
  }
  //nuevos asyncthunks aqui
  getListByLineaProduccionFamiliaId = createAsyncThunk<IPautaIngenieria[], number>(
    `PautaIngenieria/GetListByLineaProduccionFamiliaId`,
    async (lineaProduccionFamiliaId, info) => {
      return await errorNotification(
        () => this.service.getListByLineaProduccionFamiliaId(lineaProduccionFamiliaId),
        info
      );
    }
  );

  getListActivados = createAsyncThunk<IPautaIngenieria[]>(`PautaIngenieria/GetListActivados`, async (x, info) => {
    return await errorNotification(() => this.service.getListActivados(), info);
  });
}
export const PautaIngenieriaSliceRequest = new pautaIngenieriaClassSlice(pautaIngenieriaService);

const initialState: IIniState<IPautaIngenieria> = {
  loading: null,
  data: null
};

export const pautaIngenieriaSlice = createSlice({
  name: "pautaIngenieria",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    PautaIngenieriaSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(PautaIngenieriaSliceRequest.getListByLineaProduccionFamiliaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PautaIngenieriaSliceRequest.getListByLineaProduccionFamiliaId.rejected, (state, action) => {
      state.loading = "rejected";
    });

    //
    builder.addCase(PautaIngenieriaSliceRequest.getListActivados.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PautaIngenieriaSliceRequest.getListActivados.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
