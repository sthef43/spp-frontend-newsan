import { IProveedor } from "app/models/IProveedor";

import { IIniState } from "app/models/IIniState";
import { ProveedorService } from "app/services/proveedor.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const proveedorService = new ProveedorService();

class ProveedorClassSlice {
  constructor(private service: ProveedorService) {}
  //Nuevos endpoints que no heredan de generic
  getAllByTipoUnidadRequest = createAsyncThunk<IProveedor, string>(
    `Proveedor/GetByAllTipoUnidad`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByTipoUnidadRequest(modelo), info);
    }
  );
}
export const ProveedorSliceRequests = new ProveedorClassSlice(proveedorService);

const initialState: IIniState<IProveedor> = {
  loading: null,
  data: null
};

export const ProveedorSlice = createSlice({
  name: "Proveedor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ProveedorSliceRequests.getAllByTipoUnidadRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ProveedorSliceRequests.getAllByTipoUnidadRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
