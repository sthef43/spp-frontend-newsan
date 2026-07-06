import { IColor } from "app/models";
import { IIniState } from "app/models/IIniState";
import { ColorService } from "app/features/calidad/services/color.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const colorService = new ColorService();

class ColorClassSlice {
  constructor(private service: ColorService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IColor[]>(`Color/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getByIdRequest = createAsyncThunk<IColor[], number>(`Color/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByIdRequest(modelo), info);
  });
  CreateColor = createAsyncThunk<boolean, IColor>(`Color/CreateColor`, async (modelo, info) => {
    return await errorNotification(() => this.service.create(modelo), info);
  });
  UpdateColor = createAsyncThunk<boolean, IColor>(`Color/UpdateColor`, async (modelo, info) => {
    return await errorNotification(() => this.service.update(modelo), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`Color/DeleteRequest`, async (number, info) => {
    return await errorNotification(() => this.service.deleteRequest(number), info);
  });
}
export const ColorSliceRequests = new ColorClassSlice(colorService);

const initialState: IIniState<IColor> = {
  loading: null,
  data: null
};

export const ColorSlice = createSlice({
  name: "Color",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ColorSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ColorSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ColorSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ColorSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ColorSliceRequests.CreateColor.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ColorSliceRequests.CreateColor.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ColorSliceRequests.UpdateColor.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ColorSliceRequests.UpdateColor.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ColorSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ColorSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
