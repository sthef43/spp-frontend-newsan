import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IZPL_Productos } from "app/models/IZPL_Productos";

import { ZPL_ProductosService } from "app/services/zpl_Productos.services";
//<IAuth, IAuthUser>
const zpl_productosService = new ZPL_ProductosService();

class ZPL_ProductosClassSlice {
  constructor(private service: ZPL_ProductosService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IZPL_Productos[]>(`ZPL_Productos/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getAllByTipoEquipo = createAsyncThunk<IZPL_Productos[], string>(
    `ZPL_Productos/GetAllByTipoEquipo`,
    async (tipoE, thunk) => {
      return await errorNotification(() => this.service.getAllByTipoEquipo(tipoE), thunk);
    }
  );
}
export const ZPL_ProductosSliceRequests = new ZPL_ProductosClassSlice(zpl_productosService);

const initialState: IIniState<IZPL_Productos> = {
  loading: null,
  dataAll: [],
  data: null
};

export const ZPL_ProductosSlice = createSlice({
  name: "ZPL_Productos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ZPL_ProductosSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(ZPL_ProductosSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ZPL_ProductosSliceRequests.getAllByTipoEquipo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ZPL_ProductosSliceRequests.getAllByTipoEquipo.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
