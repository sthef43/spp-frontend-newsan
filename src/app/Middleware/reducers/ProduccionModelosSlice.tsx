import { IProduccionModelos } from "app/models/IProduccionModelo";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IIniState } from "app/models/IIniState";
import { ProduccionModelosService } from "app/services/ProduccionModelos.service";
//<IAuth, IAuthUser>
const produccionModelosService = new ProduccionModelosService();

class ProduccionModelosClassSlice {
  constructor(private service: ProduccionModelosService) {}
  //Nuevos endpoints que no heredan de generic
  getByCodigoRequest = createAsyncThunk<IProduccionModelos, string>(
    `ProduccionModelos/getByCodigo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByCodigo(modelo), info);
    }
  );
}
export const ProduccionModelosSliceRequests = new ProduccionModelosClassSlice(produccionModelosService);

const initialState: IIniState<IProduccionModelos> = {
  loading: null,
  data: null
};

export const ProduccionModelosSlice = createSlice({
  name: "ProduccionModelos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ProduccionModelosSliceRequests.getByCodigoRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ProduccionModelosSliceRequests.getByCodigoRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
