import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IOrigenes } from "app/models/IOrigen";
import { OrigenService } from "app/services/origen.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const origenService = new OrigenService();
class OrigenClass {
  url = "Origenes";
  constructor(private service: OrigenService) {}
  GetAllRequest = createAsyncThunk<IOrigenes[]>(`${this.url}/getAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAll(), thunk);
  });
  PostRequest = createAsyncThunk<boolean, IOrigenes>(`${this.url}/Post`, async (entity, info) => {
    return await errorNotification(() => this.service.postRequest(entity), info);
  });
  PutRequest = createAsyncThunk<boolean, IOrigenes>(`${this.url}/Put`, async (entity, info) => {
    return await errorNotification(() => this.service.putRequest(entity), info);
  });
  DeleteRequest = createAsyncThunk<boolean, number>(`${this.url}/Delete`, async (id, info) => {
    return await errorNotification(() => this.service.deleteRequest(id), info);
  });
  GetAllByCodRep = createAsyncThunk<IOrigenes[], number>(`${this.url}/GetAllByCodRep`, async (codRep, info) => {
    return await errorNotification(() => this.service.getAllByCodRep(codRep), info);
  });
}
export const OrigenesSliceRequest = new OrigenClass(origenService);
const initialState: IIniState<IOrigenes> = {
  dataAll: [],
  data: null,
  object: null,
  loading: null
};
export const OrigenesSlice = createSlice({
  initialState,
  name: "Origenes",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(OrigenesSliceRequest.GetAllRequest.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(OrigenesSliceRequest.GetAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(OrigenesSliceRequest.GetAllByCodRep.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(OrigenesSliceRequest.GetAllByCodRep.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
