import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { IIniState } from "app/models";
import { IDatos } from "app/models/AOI/IDatos";
import { IDatos2 } from "app/models/AOI/IDatos2";
import { DatosService } from "app/services/AOI/datos.service";

const datosService = new DatosService();
class datosClassSlice {
  constructor(private service: DatosService) {}

  GetByIdPrueba = createAsyncThunk<IDatos, number>(`Datos/getByIdPrueba`, async (data, info) => {
    return await errorNotification(() => this.service.getByIdPrueba(data), info);
  });

  GetItemByDate = createAsyncThunk<IDatos2[], string>("Datos/getItemsByDate", async (data, info) => {
    return await errorNotification(() => this.service.getItemsByDate(data), info);
  });
}

export const DatosSliceRequest = new datosClassSlice(datosService);

const initialState: IIniState<IDatos> = {
  loading: null,
  data: null
};

export const datosSlice = createSlice({
  name: "Datos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DatosSliceRequest.GetByIdPrueba.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(DatosSliceRequest.GetByIdPrueba.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
