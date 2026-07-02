import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { CompresorService } from "app/services/compresor.service";
import { ICompresor } from "app/models/ICompresor";
//<IAuth, IAuthUser>
const compresorService = new CompresorService();

class CompresorClassSlice {
  constructor(private service: CompresorService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<ICompresor[]>(`Compresor/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getByIdRequest = createAsyncThunk<ICompresor[], number>(`Compresor/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByIdRequest(modelo), info);
  });
  Create = createAsyncThunk<boolean, ICompresor>(`Compresor/Create`, async (modelo, info) => {
    return await errorNotification(() => this.service.create(modelo), info);
  });
  Update = createAsyncThunk<boolean, ICompresor>(`Compresor/Update`, async (modelo, info) => {
    return await errorNotification(() => this.service.update(modelo), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`Compresor/DeleteRequest`, async (number, info) => {
    return await errorNotification(() => this.service.deleteRequest(number), info);
  });
}
export const CompresorSliceRequests = new CompresorClassSlice(compresorService);

const initialState: IIniState<ICompresor> = {
  loading: null,
  data: null
};

export const CompresorSlice = createSlice({
  name: "Compresor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(CompresorSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(CompresorSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(CompresorSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(CompresorSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(CompresorSliceRequests.Create.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(CompresorSliceRequests.Create.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(CompresorSliceRequests.Update.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(CompresorSliceRequests.Update.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(CompresorSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(CompresorSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
