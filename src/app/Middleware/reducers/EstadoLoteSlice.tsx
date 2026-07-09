import { IEstadoLote } from "app/models/IEstadoLote";

import { IIniState } from "app/models/IIniState";
import { EstadoLoteService } from "app/services/estadoLote.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const estadoLoteService = new EstadoLoteService();

class EstadoLoteClassSlice {
  constructor(private service: EstadoLoteService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IEstadoLote[]>(`EstadoLote/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
}
export const EstadoLoteSliceRequests = new EstadoLoteClassSlice(estadoLoteService);

const initialState: IIniState<IEstadoLote> = {
  loading: null,
  data: null
};

export const EstadoLoteSlice = createSlice({
  name: "EstadoLote",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(EstadoLoteSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EstadoLoteSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
