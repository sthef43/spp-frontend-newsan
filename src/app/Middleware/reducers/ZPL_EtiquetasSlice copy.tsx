import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IZPL_Etiquetas } from "app/models/IZPL_Etiquetas";
import { ZPL_EtiquetasService } from "app/services/zpl_Etiquetas.service";
//<IAuth, IAuthUser>
const zpl_etiquetasService = new ZPL_EtiquetasService();

class ZPL_EtiquetasClassSlice {
  constructor(private service: ZPL_EtiquetasService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IZPL_Etiquetas[]>(`ZPL_TipoEtiquetas/getAllRequest`, async (x, info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });
  getListByTipoEtiquetaId = createAsyncThunk<IZPL_Etiquetas[], number>(
    `ZPL_Etiquetas/GetListByTipoEtiquetaId`,
    async (tipoEtiquetaId, info) => {
      return await errorNotification(() => this.service.getListByTipoEtiquetaId(tipoEtiquetaId), info);
    }
  );
  postRequest = createAsyncThunk<IZPL_Etiquetas, IZPL_Etiquetas>(`ZPL_Etiquetas`, async (modelo, info) => {
    return await errorNotification(() => this.service.PostRequest(modelo), info);
  });
  putRequest = createAsyncThunk<IZPL_Etiquetas, IZPL_Etiquetas>(`ZPL_Etiquetas`, async (modelo, info) => {
    return await errorNotification(() => this.service.PutRequest(modelo), info);
  });
}
export const ZPL_EtiquetasSliceRequests = new ZPL_EtiquetasClassSlice(zpl_etiquetasService);

const initialState: IIniState<IZPL_Etiquetas> = {
  loading: null,
  data: null
};

export const ZPL_EtiquetasSlice = createSlice({
  name: "ZPL_Etiquetas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ZPL_EtiquetasSliceRequests.getListByTipoEtiquetaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(ZPL_EtiquetasSliceRequests.getListByTipoEtiquetaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
