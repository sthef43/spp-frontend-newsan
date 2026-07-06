import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ZPL_TipoEtiquetasService } from "app/services/zpl_TipoEtiquetas.service";
import { IZPL_TipoEtiquetas } from "app/models/IZPL_TipoEtiquetas";
//<IAuth, IAuthUser>
const zpl_tipoEtiquetasService = new ZPL_TipoEtiquetasService();

class ZPL_TipoEtiquetasClassSlice {
  constructor(private service: ZPL_TipoEtiquetasService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IZPL_TipoEtiquetas[]>(`ZPL_TipoEtiquetas/getAllRequest`, async (x, info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });
  getListByEstadoRequest = createAsyncThunk<IZPL_TipoEtiquetas[], string>(
    `ZPL_TipoEtiquetas/getListByEstadoRequest`,
    async (estado, info) => {
      return await errorNotification(() => this.service.getListByEstadoRequest(estado), info);
    }
  );
}
export const ZPL_TipoEtiquetasSliceRequests = new ZPL_TipoEtiquetasClassSlice(zpl_tipoEtiquetasService);

const initialState: IIniState<IZPL_TipoEtiquetas> = {
  loading: null,
  data: null
};

export const ZPL_TipoEtiquetasSlice = createSlice({
  name: "ZPL_TipoEtiquetas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
