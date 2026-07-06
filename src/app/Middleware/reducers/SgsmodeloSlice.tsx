import { IIniState } from "app/models/IIniState";
import { ISgsmodelo } from "app/models/ISgsmodelo";
import { SgsmodeloService } from "app/services/sgsmodelo.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { errorNotification } from "../HelperMidleware/errorNotifications";
const modelService = new SgsmodeloService();
class modelClassSlice {
  constructor(private service: SgsmodeloService) { }
  create = createAsyncThunk<boolean, ISgsmodelo>("Sgsmodelo/create", async (x, info) => {
    return await errorNotification(() => this.service.create(x), info);
  });
  getAll = createAsyncThunk<ISgsmodelo[]>("Sgsmodelo/getAll", async (x, info) => {
    return await errorNotification(() => this.service.getAll(), info);
  });
  //nuevos asyncthunks aqui
}
export const SgsmodeloSliceRequests = new modelClassSlice(modelService);

const initialState: IIniState<ISgsmodelo> = {
  loading: null,
  data: null
};

export const modelSlice = createSlice({
  name: "Sgsmodelo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(SgsmodeloSliceRequests.create.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(SgsmodeloSliceRequests.create.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(SgsmodeloSliceRequests.getAll.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(SgsmodeloSliceRequests.getAll.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
