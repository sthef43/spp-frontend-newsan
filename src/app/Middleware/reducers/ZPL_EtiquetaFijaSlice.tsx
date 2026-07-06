import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ZPL_EttiquetaFijaService } from "app/services/zpl_etiquetaFija.service";
import { IZPL_EtiquetaFija } from "app/models/IZPL_EtiquetaFija";
//<IAuth, IAuthUser>
const zpl_etiquetaFijaService = new ZPL_EttiquetaFijaService();

class ZPL_EtiquetaFijaClassSlice {
  constructor(private service: ZPL_EttiquetaFijaService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IZPL_EtiquetaFija[]>(`ZPL_TipoEtiquetas/getAllRequest`, async (x, info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });
  getListByTipoEtiquetaId = createAsyncThunk<IZPL_EtiquetaFija[], number>(
    `ZPL_EtiquetaFija/getAllRequest`,
    async (tipoEtiquetaId, info) => {
      return await errorNotification(() => this.service.getListByTipoEtiquetaId(tipoEtiquetaId), info);
    }
  );
  postRequest = createAsyncThunk<IZPL_EtiquetaFija, IZPL_EtiquetaFija>(
    `ZPL_TipoEtiquetas/postRequest`,
    async (x, info) => {
      return await errorNotification(() => this.service.post(x), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IZPL_EtiquetaFija>(`ZPL_TipoEtiquetas/putRequest`, async (x, info) => {
    return await errorNotification(() => this.service.put(x), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`ZPL_TipoEtiquetas/deleteRequest`, async (x, info) => {
    return await errorNotification(() => this.service.delete(x), info);
  });
}
export const ZPL_EtiquetaFijaSliceRequests = new ZPL_EtiquetaFijaClassSlice(zpl_etiquetaFijaService);

const initialState: IIniState<IZPL_EtiquetaFija> = {
  loading: null,
  data: null
};

export const ZPL_EtiquetasSlice = createSlice({
  name: "ZPL_Etiquetas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
