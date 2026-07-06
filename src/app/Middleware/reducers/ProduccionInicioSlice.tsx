import { ProduccionInicioService } from "app/services/produccionInicio.service";
import { IProduccionInicio } from "app/models/IProduccionInicio";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IIniState } from "app/models/IIniState";
//<IAuth, IAuthUser>
const produccionInicioService = new ProduccionInicioService();

class ProduccionInicioClassSlice {
  constructor(private service: ProduccionInicioService) {}
  //Nuevos endpoints que no heredan de generic
  getByCodigoRequest = createAsyncThunk<IProduccionInicio, string>(
    `ProduccionInicio/getByCodigo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByCodigo(modelo), info);
    }
  );
}
export const ProduccionInicioSliceRequests = new ProduccionInicioClassSlice(produccionInicioService);

const initialState: IIniState<IProduccionInicio> = {
  loading: null,
  data: null
};

export const ProduccionInicioSlice = createSlice({
  name: "ProduccionInicio",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ProduccionInicioSliceRequests.getByCodigoRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ProduccionInicioSliceRequests.getByCodigoRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
