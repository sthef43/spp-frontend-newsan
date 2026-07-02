/* import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ITipoEtiqueta } from "app/models/ITipoEtiqueta";
import { IZPL_TipoEtiquetas } from "app/models/IZPL_TipoEtiquetas";
import { ZPL_PrintService } from "app/services/ZPL_Print.service";
//<IAuth, IAuthUser>
const zpl_printService = new ZPL_PrintService();

class ZPL_PrintClassSlice {
  constructor(private service: ZPL_PrintService) {}
  //Nuevos endpoints que no heredan de generic
  getPrints = createAsyncThunk<ITipoEtiqueta[]>(`ZPL_TipoEtiquetas/GetAll`, async (info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });

  imprimir = createAsyncThunk<boolean>(`PautaIngenieria/Imprimir`, async (x, info) => {
    return await errorNotification(() => this.service.Imprimir(), info);
  });
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
 */

import React from "react";

export const ZPL_Print = () => {
  return <div>ZPL_Print</div>;
};
