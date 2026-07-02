import { ITipoEtiqueta } from "app/models/ITipoEtiqueta";

import { IIniState } from "app/models/IIniState";
import { TipoEtiquetaService } from "app/services/tipoEtiqueta.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const tipoEtiquetaService = new TipoEtiquetaService();

class TipoEtiquetaClassSlice {
  constructor(private service: TipoEtiquetaService) {}
  //Nuevos endpoints que no heredan de generic
  GetByIdLinea = createAsyncThunk<ITipoEtiqueta[], number>(`TipoEtiqueta/GetByIdLinea`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByIdLinea(modelo), info);
  });
}
export const TipoEtiquetaSliceRequests = new TipoEtiquetaClassSlice(tipoEtiquetaService);

const initialState: IIniState<ITipoEtiqueta> = {
  loading: null,
  data: null
};

export const TipoEtiquetaSlice = createSlice({
  name: "TipoEtiqueta",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(TipoEtiquetaSliceRequests.GetByIdLinea.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(TipoEtiquetaSliceRequests.GetByIdLinea.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
