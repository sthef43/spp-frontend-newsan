import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { ISupermaestro } from "app/models/ISupermaestro";
import { SupermaestroService } from "app/services/supermaestro.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const supermaestroService = new SupermaestroService();
class supermaestroClassSlice {
  constructor(private supermaestroSrv: SupermaestroService) {}
  getAll = createAsyncThunk<ISupermaestro[]>("Supermaestro/GetAll", async (thunk, info) => {
    return await errorNotification(() => this.supermaestroSrv.getAllRequest(), info);
  });
  getByGenerico = createAsyncThunk<ISupermaestro[], string>("Supermaestro/GetByGenerico", async (generico, info) => {
    return await errorNotification(() => this.supermaestroSrv.getByGenerico(generico), info);
  });
  deleteRequest = createAsyncThunk<ISupermaestro[], number>("Supermaestro/Delete", async (id, info) => {
    return await errorNotification(() => this.supermaestroSrv.deleteRequest(id), info);
  });
  multiPostNested = createAsyncThunk<boolean, ISupermaestro[]>("Supermaestro/MultiPost", async (entity, info) => {
    return await errorNotification(() => this.supermaestroSrv.MultiPostNested(entity), info);
  });
  putRequest = createAsyncThunk<boolean, ISupermaestro>("Supermaestro", async (entity, info) => {
    return await errorNotification(() => this.supermaestroSrv.PutRequest(entity), info);
  });
  multiDeleteRequest = createAsyncThunk<boolean, ISupermaestro[]>("Supermaestro/MultiDelete", async (entity, info) => {
    return await errorNotification(() => this.supermaestroSrv.MultiDeleteRequest(entity), info);
  });
}
export const SupermaestroSliceRequest = new supermaestroClassSlice(supermaestroService);
const InitState: IIniState<ISupermaestro> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};
export const SupermaestroSlice = createSlice({
  initialState: InitState,
  name: "Supermaestro",
  reducers: {},
  extraReducers(builder) {
    builder.addCase(SupermaestroSliceRequest.getAll.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(SupermaestroSliceRequest.getAll.rejected, (state, action) => {
      state.loading = "rejetecd";
    });
    builder.addCase(SupermaestroSliceRequest.getByGenerico.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(SupermaestroSliceRequest.getByGenerico.rejected, (state, action) => {
      state.loading = "rejetecd";
    });
  }
});
