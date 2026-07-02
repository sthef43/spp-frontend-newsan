import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { AjusteService } from "app/services/ajuste.service";
import { IAjuste } from "app/models/IAjuste";
//<IAuth, IAuthUser>
const ajusteService = new AjusteService();

class AjusteClass {
  constructor(private service: AjusteService) {}
  //Nuevos endpoints que no heredan de generic
  getAllByLineaId = createAsyncThunk<IAjuste[], number>(`Ajuste/GetAllByLineaId`, async (lineaId, info) => {
    return await errorNotification(() => this.service.getAllByLineaId(lineaId), info);
  });
  getByLineaId = createAsyncThunk<IAjuste, number>(`Ajuste/GetByLineaId`, async (lineaId, info) => {
    return await errorNotification(() => this.service.getByLineaId(lineaId), info);
  });
  putRequest = createAsyncThunk<IAjuste, IAjuste>(`Ajuste/PutRequest`, async (model, info) => {
    return await errorNotification(() => this.service.PutRequest(model), info);
  });
}
export const AjusteSliceRequests = new AjusteClass(ajusteService);

const initialState: IIniState<IAjuste> = {
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
    builder.addCase(AjusteSliceRequests.getAllByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AjusteSliceRequests.getAllByLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AjusteSliceRequests.getByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(AjusteSliceRequests.getByLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AjusteSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AjusteSliceRequests.putRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
