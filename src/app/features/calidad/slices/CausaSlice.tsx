import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { ICausa } from "app/models/ICausa";
import { CausaService } from "app/services/causa.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const causaService = new CausaService();
class CausaSliceClass {
  url = "Causa";
  constructor(private service: CausaService) {}
  GetAllRequest = createAsyncThunk<ICausa[]>(`${this.url}/getAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAll(), thunk);
  });
  PostRequest = createAsyncThunk<boolean, ICausa>(`${this.url}/Post`, async (entity, info) => {
    return await errorNotification(() => this.service.postRequest(entity), info);
  });
  PutRequest = createAsyncThunk<boolean, ICausa>(`${this.url}/Put`, async (entity, info) => {
    return await errorNotification(() => this.service.putRequest(entity), info);
  });
  DeleteRequest = createAsyncThunk<boolean, number>(`${this.url}/Delete`, async (id, info) => {
    return await errorNotification(() => this.service.deleteRequest(id), info);
  });
  GetAllByCodRep = createAsyncThunk<ICausa[], number>(`${this.url}/GetAllByCodRep`, async (codRep, info) => {
    return await errorNotification(() => this.service.getAllByCodRep(codRep), info);
  });
}

export const CausaSliceRequest = new CausaSliceClass(causaService);
const initialState: IIniState<ICausa> = {
  loading: null,
  dataAll: [],
  data: null,
  object: null
};
export const CausaSlice = createSlice({
  name: "Causa",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CausaSliceRequest.GetAllRequest.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CausaSliceRequest.GetAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(CausaSliceRequest.GetAllByCodRep.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CausaSliceRequest.GetAllByCodRep.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
