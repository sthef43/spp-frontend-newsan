import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { TablerosService } from "app/services/tableros.service";
import { ITableroTermoformado } from "app/models/Tableros/ITableroTermoformado";

const tableroService = new TablerosService();

class TableroClass {
  constructor(private service: TablerosService) {}
  //Nuevos endpoints que no heredan de generic
  getTableroTermoformados = createAsyncThunk<ITableroTermoformado[], {diarioLineaPuestoId:number,consumoLineaPuesto:number}>(`Tablero/Termoformado`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetTableroTermoformados(modelo.diarioLineaPuestoId,modelo.consumoLineaPuesto), info);
  });
}
export const TableroRequests = new TableroClass(tableroService);

const initialState: IIniState<ITableroTermoformado> = {
  loading: null,
  dataAll: [],
  data: null,
  object: null
};

export const AjusteSlice = createSlice({
  name: "Ajuste",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(TableroRequests.getTableroTermoformados.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(TableroRequests.getTableroTermoformados.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});